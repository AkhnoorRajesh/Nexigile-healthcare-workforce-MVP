from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Application, Shift, Professional, Facility, User
from ..schemas import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate, ProfessionalResponse, ShiftResponse
from ..dependencies import get_current_user, require_role
from ..matching import calculate_ai_match

router = APIRouter(prefix="/api/applications", tags=["Applications"])

def enrich_application_response(app: Application, db: Session) -> ApplicationResponse:
    prof_resp = None
    if app.professional:
        user = app.professional.user
        prof_resp = ProfessionalResponse(
            id=app.professional.id,
            user_id=app.professional.user_id,
            name=user.name if user else "Professional",
            email=user.email if user else "",
            specialty=app.professional.specialty,
            experience_years=app.professional.experience_years,
            location=app.professional.location,
            availability=app.professional.availability,
            rating=app.professional.rating
        )

    shift_resp = None
    if app.shift:
        shift_resp = ShiftResponse(
            id=app.shift.id,
            facility_id=app.shift.facility_id,
            facility_name=app.shift.facility.name if app.shift.facility else "Hospital",
            role=app.shift.role,
            specialty=app.shift.specialty,
            date=app.shift.date,
            start_time=app.shift.start_time,
            end_time=app.shift.end_time,
            location=app.shift.location,
            rate=app.shift.rate,
            required_experience=app.shift.required_experience,
            status=app.shift.status,
            created_at=app.shift.created_at,
            match_score=app.match_score
        )

    return ApplicationResponse(
        id=app.id,
        shift_id=app.shift_id,
        professional_id=app.professional_id,
        status=app.status,
        match_score=app.match_score,
        applied_at=app.applied_at,
        professional=prof_resp,
        shift=shift_resp
    )

@router.get("", response_model=List[ApplicationResponse])
def get_applications(
    shift_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Application)

    if current_user.role == "PROFESSIONAL":
        prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()
        if not prof:
            return []
        query = query.filter(Application.professional_id == prof.id)

    elif current_user.role == "FACILITY":
        fac = db.query(Facility).filter(Facility.user_id == current_user.id).first()
        if not fac:
            return []
        # Filter applications belonging to shifts of this facility
        query = query.join(Shift).filter(Shift.facility_id == fac.id)

    # Admin sees all, or if shift_id is provided
    if shift_id:
        query = query.filter(Application.shift_id == shift_id)

    if status and status.lower() != "all":
        query = query.filter(Application.status == status.upper())

    applications = query.order_by(Application.applied_at.desc()).all()
    return [enrich_application_response(app, db) for app in applications]

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_shift(
    app_data: ApplicationCreate,
    current_user: User = Depends(require_role(["PROFESSIONAL"])),
    db: Session = Depends(get_db)
):
    prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()
    if not prof:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Professional profile not found")

    shift = db.query(Shift).filter(Shift.id == app_data.shift_id).first()
    if not shift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shift not found")

    if shift.status in ["CONFIRMED", "COMPLETED", "CANCELLED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot apply: Shift is already {shift.status}"
        )

    # Prevent duplicate applications
    existing = db.query(Application).filter(
        Application.shift_id == shift.id,
        Application.professional_id == prof.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this shift"
        )

    # Calculate match score
    score, _ = calculate_ai_match(shift, prof)

    new_app = Application(
        shift_id=shift.id,
        professional_id=prof.id,
        status="APPLIED",
        match_score=score
    )
    db.add(new_app)

    # Update shift status to APPLIED if OPEN
    if shift.status == "OPEN":
        shift.status = "APPLIED"

    db.commit()
    db.refresh(new_app)

    return enrich_application_response(new_app, db)

@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(require_role(["FACILITY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    shift = app.shift
    new_status = status_update.status.upper()

    if new_status not in ["ACCEPTED", "REJECTED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be either ACCEPTED or REJECTED"
        )

    app.status = new_status

    if new_status == "ACCEPTED":
        # Shift becomes CONFIRMED
        shift.status = "CONFIRMED"
        # Reject other pending applications for this shift
        other_apps = db.query(Application).filter(
            Application.shift_id == shift.id,
            Application.id != app.id,
            Application.status == "APPLIED"
        ).all()
        for other in other_apps:
            other.status = "REJECTED"

    elif new_status == "REJECTED":
        # If no other active applications, shift can return to OPEN
        active_apps = db.query(Application).filter(
            Application.shift_id == shift.id,
            Application.id != app.id,
            Application.status == "APPLIED"
        ).count()
        if active_apps == 0 and shift.status == "APPLIED":
            shift.status = "OPEN"

    db.commit()
    db.refresh(app)

    return enrich_application_response(app, db)
