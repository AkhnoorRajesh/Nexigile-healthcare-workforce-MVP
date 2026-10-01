from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Shift, Facility, Professional, Application, User
from ..schemas import ShiftCreate, ShiftResponse, MatchResponse
from ..dependencies import get_current_user, get_optional_current_user, require_role
from ..matching import calculate_ai_match

router = APIRouter(prefix="/api/shifts", tags=["Shifts"])

def enrich_shift_response(shift: Shift, professional: Optional[Professional], db: Session) -> ShiftResponse:
    match_score = None
    match_factors = []
    has_applied = False

    if professional:
        match_score, match_factors = calculate_ai_match(shift, professional)
        app = db.query(Application).filter(
            Application.shift_id == shift.id,
            Application.professional_id == professional.id
        ).first()
        has_applied = (app is not None)

    app_count = db.query(Application).filter(Application.shift_id == shift.id).count()

    return ShiftResponse(
        id=shift.id,
        facility_id=shift.facility_id,
        facility_name=shift.facility.name if shift.facility else "Hospital",
        role=shift.role,
        specialty=shift.specialty,
        date=shift.date,
        start_time=shift.start_time,
        end_time=shift.end_time,
        location=shift.location,
        rate=shift.rate,
        required_experience=shift.required_experience,
        status=shift.status,
        created_at=shift.created_at,
        match_score=match_score,
        match_factors=match_factors,
        has_applied=has_applied,
        applicants_count=app_count
    )

@router.get("", response_model=List[ShiftResponse])
def get_shifts(
    search: Optional[str] = None,
    location: Optional[str] = None,
    specialty: Optional[str] = None,
    role: Optional[str] = None,
    min_rate: Optional[float] = None,
    date: Optional[str] = None,
    status_filter: Optional[str] = None,
    facility_only: bool = False,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Shift)

    # If facility user requesting their own shifts
    if facility_only and current_user and current_user.role == "FACILITY":
        facility = db.query(Facility).filter(Facility.user_id == current_user.id).first()
        if facility:
            query = query.filter(Shift.facility_id == facility.id)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            (Shift.role.ilike(term)) |
            (Shift.specialty.ilike(term)) |
            (Shift.location.ilike(term))
        )
    if location and location.lower() != "all":
        query = query.filter(Shift.location.ilike(f"%{location.strip()}%"))
    if specialty and specialty.lower() != "all":
        query = query.filter(Shift.specialty.ilike(f"%{specialty.strip()}%"))
    if role and role.lower() != "all":
        query = query.filter(Shift.role.ilike(f"%{role.strip()}%"))
    if min_rate and min_rate > 0:
        query = query.filter(Shift.rate >= min_rate)
    if date:
        query = query.filter(Shift.date == date)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(Shift.status == status_filter.upper())

    # Order newest first
    shifts = query.order_by(Shift.created_at.desc()).all()

    # Get professional profile if available
    prof = None
    if current_user and current_user.role == "PROFESSIONAL":
        prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()

    return [enrich_shift_response(s, prof, db) for s in shifts]

@router.post("", response_model=ShiftResponse, status_code=status.HTTP_201_CREATED)
def create_shift(
    shift_data: ShiftCreate,
    current_user: User = Depends(require_role(["FACILITY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    facility = db.query(Facility).filter(Facility.user_id == current_user.id).first()
    if not facility and current_user.role == "ADMIN":
        # Fallback to first facility
        facility = db.query(Facility).first()

    if not facility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility profile not found for this account"
        )

    # Validation
    if not shift_data.role or not shift_data.specialty or not shift_data.location:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Role, Specialty, and Location are mandatory fields"
        )
    if shift_data.rate <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Hourly rate must be greater than zero"
        )

    new_shift = Shift(
        facility_id=facility.id,
        role=shift_data.role,
        specialty=shift_data.specialty,
        date=shift_data.date,
        start_time=shift_data.start_time,
        end_time=shift_data.end_time,
        location=shift_data.location,
        rate=shift_data.rate,
        required_experience=shift_data.required_experience,
        status="OPEN"
    )
    db.add(new_shift)
    db.commit()
    db.refresh(new_shift)

    return enrich_shift_response(new_shift, None, db)

@router.get("/{shift_id}", response_model=ShiftResponse)
def get_shift_details(
    shift_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shift not found")
    
    prof = None
    if current_user and current_user.role == "PROFESSIONAL":
        prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()

    return enrich_shift_response(shift, prof, db)

@router.get("/{shift_id}/match", response_model=MatchResponse)
def get_shift_match_breakdown(
    shift_id: int,
    current_user: User = Depends(require_role(["PROFESSIONAL"])),
    db: Session = Depends(get_db)
):
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shift not found")
    
    prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()
    if not prof:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Professional profile not found")

    score, factors = calculate_ai_match(shift, prof)
    return MatchResponse(score=score, factors=factors)
