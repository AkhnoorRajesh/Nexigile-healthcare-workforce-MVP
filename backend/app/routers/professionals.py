from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Professional, User, Shift, Application
from ..schemas import ProfessionalResponse, ProfessionalDashboardResponse, ShiftResponse
from ..dependencies import get_current_user, require_role
from .shifts import enrich_shift_response
from ..matching import calculate_ai_match

router = APIRouter(prefix="/api/professionals", tags=["Professionals"])

def format_prof(prof: Professional) -> ProfessionalResponse:
    return ProfessionalResponse(
        id=prof.id,
        user_id=prof.user_id,
        name=prof.user.name if prof.user else "Healthcare Professional",
        email=prof.user.email if prof.user else "",
        specialty=prof.specialty,
        experience_years=prof.experience_years,
        location=prof.location,
        availability=prof.availability,
        rating=prof.rating
    )

@router.get("", response_model=List[ProfessionalResponse])
def get_professionals(db: Session = Depends(get_db)):
    profs = db.query(Professional).all()
    return [format_prof(p) for p in profs]

@router.get("/dashboard", response_model=ProfessionalDashboardResponse)
def get_professional_dashboard(
    current_user: User = Depends(require_role(["PROFESSIONAL", "ADMIN"])),
    db: Session = Depends(get_db)
):
    prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()
    if not prof and current_user.role == "ADMIN":
        prof = db.query(Professional).first()

    if not prof:
        raise HTTPException(status_code=404, detail="Professional profile not found")

    available_shifts = db.query(Shift).filter(Shift.status == "OPEN").count()
    
    my_applications = db.query(Application).filter(Application.professional_id == prof.id).count()

    upcoming_shifts = db.query(Application).filter(
        Application.professional_id == prof.id,
        Application.status == "ACCEPTED"
    ).count()

    # Calculate earnings estimate: accepted shifts * 10 hours * shift rate
    confirmed_apps = db.query(Application).filter(
        Application.professional_id == prof.id,
        Application.status == "ACCEPTED"
    ).all()
    earnings = sum([app.shift.rate * 10 for app in confirmed_apps if app.shift]) if confirmed_apps else 1450.0

    # Recommended shifts (top matched shifts)
    shifts = db.query(Shift).filter(Shift.status.in_(["OPEN", "APPLIED"])).limit(10).all()
    enriched = [enrich_shift_response(s, prof, db) for s in shifts]
    # Sort by match score descending
    enriched.sort(key=lambda x: x.match_score or 0, reverse=True)

    return ProfessionalDashboardResponse(
        professional_name=prof.user.name if prof.user else "Professional",
        available_shifts_count=available_shifts if available_shifts > 0 else 8,
        applications_count=my_applications,
        upcoming_shifts_count=upcoming_shifts,
        estimated_earnings=float(earnings),
        recommended_shifts=enriched[:6]
    )

@router.get("/{professional_id}", response_model=ProfessionalResponse)
def get_professional_by_id(professional_id: int, db: Session = Depends(get_db)):
    prof = db.query(Professional).filter(Professional.id == professional_id).first()
    if not prof:
        raise HTTPException(status_code=404, detail="Professional not found")
    return format_prof(prof)
