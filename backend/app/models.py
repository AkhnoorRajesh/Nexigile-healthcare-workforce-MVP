import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # ADMIN, FACILITY, PROFESSIONAL
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    facility_profile = relationship("Facility", back_populates="user", uselist=False, cascade="all, delete-orphan")
    professional_profile = relationship("Professional", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)

    user = relationship("User", back_populates="facility_profile")
    shifts = relationship("Shift", back_populates="facility", cascade="all, delete-orphan")

class Professional(Base):
    __tablename__ = "professionals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    specialty = Column(String, nullable=False)
    experience_years = Column(Integer, nullable=False, default=1)
    location = Column(String, nullable=False)
    availability = Column(String, nullable=False, default="Immediate")
    rating = Column(Float, default=5.0)

    user = relationship("User", back_populates="professional_profile")
    applications = relationship("Application", back_populates="professional", cascade="all, delete-orphan")

class Shift(Base):
    __tablename__ = "shifts"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    role = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    location = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    required_experience = Column(Integer, nullable=False, default=1)
    status = Column(String, nullable=False, default="OPEN")  # OPEN, APPLIED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=utc_now)

    facility = relationship("Facility", back_populates="shifts")
    applications = relationship("Application", back_populates="shift", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    shift_id = Column(Integer, ForeignKey("shifts.id"), nullable=False)
    professional_id = Column(Integer, ForeignKey("professionals.id"), nullable=False)
    status = Column(String, nullable=False, default="APPLIED")  # APPLIED, ACCEPTED, REJECTED
    match_score = Column(Integer, nullable=False, default=85)
    applied_at = Column(DateTime, default=utc_now)

    shift = relationship("Shift", back_populates="applications")
    professional = relationship("Professional", back_populates="applications")
