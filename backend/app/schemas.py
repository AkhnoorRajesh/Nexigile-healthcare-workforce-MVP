from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth & User
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str  # ADMIN, FACILITY, PROFESSIONAL
    # Optional profile info for registration
    facility_name: Optional[str] = None
    facility_location: Optional[str] = None
    specialty: Optional[str] = None
    experience_years: Optional[int] = 1
    location: Optional[str] = None

class FacilityResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    location: str
    contact_email: str

    class Config:
        from_attributes = True

class ProfessionalResponse(BaseModel):
    id: int
    user_id: int
    name: Optional[str] = None
    email: Optional[str] = None
    specialty: str
    experience_years: int
    location: str
    availability: str
    rating: float

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime
    facility: Optional[FacilityResponse] = None
    professional: Optional[ProfessionalResponse] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Shifts
class ShiftBase(BaseModel):
    role: str
    specialty: str
    date: str
    start_time: str
    end_time: str
    location: str
    rate: float
    required_experience: int = 1

class ShiftCreate(ShiftBase):
    pass

class ShiftResponse(ShiftBase):
    id: int
    facility_id: int
    facility_name: Optional[str] = None
    status: str
    created_at: datetime
    match_score: Optional[int] = None
    match_factors: Optional[List[str]] = None
    has_applied: Optional[bool] = False
    applicants_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Applications
class ApplicationCreate(BaseModel):
    shift_id: int

class ApplicationStatusUpdate(BaseModel):
    status: str  # ACCEPTED or REJECTED

class ApplicationResponse(BaseModel):
    id: int
    shift_id: int
    professional_id: int
    status: str
    match_score: int
    applied_at: datetime
    professional: Optional[ProfessionalResponse] = None
    shift: Optional[ShiftResponse] = None

    class Config:
        from_attributes = True

# Matching
class MatchResponse(BaseModel):
    score: int
    factors: List[str]

# Dashboards
class FacilityDashboardResponse(BaseModel):
    facility_name: str
    open_shifts_count: int
    confirmed_staff_count: int
    fill_rate: int
    pending_applications_count: int
    recent_shifts: List[ShiftResponse]
    recent_applications: List[ApplicationResponse]
    activity_chart: List[dict]

class ProfessionalDashboardResponse(BaseModel):
    professional_name: str
    available_shifts_count: int
    applications_count: int
    upcoming_shifts_count: int
    estimated_earnings: float
    recommended_shifts: List[ShiftResponse]

class AdminDashboardResponse(BaseModel):
    total_facilities: int
    total_professionals: int
    active_shifts: int
    successful_placements: int
    recent_shifts: List[ShiftResponse]
    recent_professionals: List[ProfessionalResponse]
    recent_applications: List[ApplicationResponse]
    analytics: dict
