from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Facility, Professional
from ..schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from ..auth import get_password_hash, verify_password, create_access_token
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def format_user_response(user: User, db: Session) -> UserResponse:
    fac = db.query(Facility).filter(Facility.user_id == user.id).first()
    prof = db.query(Professional).filter(Professional.user_id == user.id).first()
    
    prof_resp = None
    if prof:
        prof_resp = {
            "id": prof.id,
            "user_id": prof.user_id,
            "name": user.name,
            "email": user.email,
            "specialty": prof.specialty,
            "experience_years": prof.experience_years,
            "location": prof.location,
            "availability": prof.availability,
            "rating": prof.rating
        }

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
        facility=fac,
        professional=prof_resp
    )

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )
    
    role = user_data.role.upper()
    if role not in ["ADMIN", "FACILITY", "PROFESSIONAL"]:
        role = "PROFESSIONAL"

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        role=role
    )
    db.add(new_user)
    db.flush()

    # Create associated profile
    if role == "FACILITY":
        facility = Facility(
            user_id=new_user.id,
            name=user_data.facility_name or user_data.name,
            location=user_data.facility_location or user_data.location or "Dublin",
            contact_email=user_data.email
        )
        db.add(facility)
    elif role == "PROFESSIONAL":
        prof = Professional(
            user_id=new_user.id,
            specialty=user_data.specialty or "General Medicine",
            experience_years=user_data.experience_years or 2,
            location=user_data.location or "Dublin",
            availability="Immediate",
            rating=5.0
        )
        db.add(prof)

    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=format_user_response(new_user, db)
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=format_user_response(user, db)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return format_user_response(current_user, db)
