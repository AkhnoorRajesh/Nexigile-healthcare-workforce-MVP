import datetime
from sqlalchemy.orm import Session
from .models import User, Facility, Professional, Shift, Application
from .auth import get_password_hash
from .matching import calculate_ai_match

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.email == "admin@medioracle.com").first():
        print("Database already seeded with demo data.")
        return

    print("Seeding database with realistic healthcare workforce data...")

    # 1. Demo Users
    admin_user = User(
        name="Elena Vance (Admin)",
        email="admin@medioracle.com",
        password_hash=get_password_hash("Admin@123"),
        role="ADMIN"
    )
    db.add(admin_user)

    facility_user = User(
        name="St. Mary's Health Group",
        email="facility@medioracle.com",
        password_hash=get_password_hash("Facility@123"),
        role="FACILITY"
    )
    db.add(facility_user)

    prof_user = User(
        name="Sarah Jenkins, RN",
        email="professional@medioracle.com",
        password_hash=get_password_hash("Professional@123"),
        role="PROFESSIONAL"
    )
    db.add(prof_user)
    db.commit()

    # Link demo Facility Profile
    demo_facility = Facility(
        user_id=facility_user.id,
        name="St. Mary's University Hospital",
        location="Dublin",
        contact_email="facility@medioracle.com"
    )
    db.add(demo_facility)

    # Link demo Professional Profile
    demo_prof = Professional(
        user_id=prof_user.id,
        specialty="Emergency Care",
        experience_years=6,
        location="Dublin",
        availability="Immediate",
        rating=4.9
    )
    db.add(demo_prof)
    db.commit()

    # 2. Add 4 More Realistic Facilities (Total 5)
    facilities_data = [
        {"name": "Mater Misericordiae University Hospital", "location": "Dublin", "email": "staffing@mater.ie"},
        {"name": "Cork University Hospital", "location": "Cork", "email": "locum@cuh.hse.ie"},
        {"name": "Galway University Hospitals", "location": "Galway", "email": "workforce@galwayhosp.ie"},
        {"name": "University Hospital Limerick", "location": "Limerick", "email": "nursing@uhl.ie"},
    ]
    created_facilities = [demo_facility]
    for fac in facilities_data:
        # Create an account for each facility
        fac_u = User(
            name=fac["name"],
            email=fac["email"],
            password_hash=get_password_hash("Facility@123"),
            role="FACILITY"
        )
        db.add(fac_u)
        db.flush()
        f_obj = Facility(
            user_id=fac_u.id,
            name=fac["name"],
            location=fac["location"],
            contact_email=fac["email"]
        )
        db.add(f_obj)
        created_facilities.append(f_obj)
    db.commit()

    # 3. Add 9 More Realistic Professionals (Total 10)
    professionals_data = [
        {"name": "Liam O'Connor, RN", "email": "liam.nurse@example.com", "specialty": "ICU", "exp": 7, "loc": "Dublin", "avail": "Immediate", "rating": 4.95},
        {"name": "Aoife Murphy, HCA", "email": "aoife.care@example.com", "specialty": "General Medicine", "exp": 4, "loc": "Cork", "avail": "Immediate", "rating": 4.8},
        {"name": "David Walsh, RPh", "email": "david.pharm@example.com", "specialty": "Clinical Pharmacist", "exp": 8, "loc": "Dublin", "avail": "Flexible", "rating": 4.9},
        {"name": "Ciara Kelly, PT", "email": "ciara.physio@example.com", "specialty": "Rehabilitation", "exp": 5, "loc": "Galway", "avail": "Weekends", "rating": 4.75},
        {"name": "Sean Brennan, RN", "email": "sean.brennan@example.com", "specialty": "Mental Health", "exp": 6, "loc": "Limerick", "avail": "Immediate", "rating": 4.85},
        {"name": "Niamh Byrne, RN", "email": "niamh.byrne@example.com", "specialty": "Pediatrics", "exp": 5, "loc": "Dublin", "avail": "Flexible", "rating": 4.9},
        {"name": "Patrick Doyle, SCW", "email": "patrick.doyle@example.com", "specialty": "General Medicine", "exp": 3, "loc": "Cork", "avail": "Immediate", "rating": 4.65},
        {"name": "Emma Gallagher, RN", "email": "emma.g@example.com", "specialty": "Emergency Care", "exp": 4, "loc": "Dublin", "avail": "Weekends", "rating": 4.7},
        {"name": "Conor Ryan, RN", "email": "conor.ryan@example.com", "specialty": "ICU", "exp": 9, "loc": "Galway", "avail": "Immediate", "rating": 5.0}
    ]
    created_profs = [demo_prof]
    for p in professionals_data:
        p_u = User(
            name=p["name"],
            email=p["email"],
            password_hash=get_password_hash("Professional@123"),
            role="PROFESSIONAL"
        )
        db.add(p_u)
        db.flush()
        prof_obj = Professional(
            user_id=p_u.id,
            specialty=p["specialty"],
            experience_years=p["exp"],
            location=p["loc"],
            availability=p["avail"],
            rating=p["rating"]
        )
        db.add(prof_obj)
        created_profs.append(prof_obj)
    db.commit()

    # 4. Add 14 Realistic Shifts across Facilities (Total > 12)
    today = datetime.date.today()
    shifts_data = [
        # Shifts for demo facility (St. Mary's)
        {
            "facility": demo_facility,
            "role": "Registered Nurse",
            "specialty": "Emergency Care",
            "date": str(today + datetime.timedelta(days=1)),
            "start_time": "19:00",
            "end_time": "07:00",
            "location": "Dublin",
            "rate": 38.50,
            "required_experience": 2,
            "status": "OPEN"
        },
        {
            "facility": demo_facility,
            "role": "Staff Nurse",
            "specialty": "ICU",
            "date": str(today + datetime.timedelta(days=2)),
            "start_time": "08:00",
            "end_time": "20:00",
            "location": "Dublin",
            "rate": 42.00,
            "required_experience": 3,
            "status": "OPEN"
        },
        {
            "facility": demo_facility,
            "role": "Healthcare Assistant",
            "specialty": "General Medicine",
            "date": str(today + datetime.timedelta(days=3)),
            "start_time": "07:30",
            "end_time": "15:30",
            "location": "Dublin",
            "rate": 26.00,
            "required_experience": 1,
            "status": "OPEN"
        },
        {
            "facility": demo_facility,
            "role": "Registered Nurse",
            "specialty": "Pediatrics",
            "date": str(today + datetime.timedelta(days=4)),
            "start_time": "08:00",
            "end_time": "18:00",
            "location": "Dublin",
            "rate": 39.00,
            "required_experience": 2,
            "status": "OPEN"
        },
        # Shifts for other hospitals
        {
            "facility": created_facilities[1],  # Mater
            "role": "Registered Nurse",
            "specialty": "Emergency Care",
            "date": str(today + datetime.timedelta(days=1)),
            "start_time": "20:00",
            "end_time": "08:00",
            "location": "Dublin",
            "rate": 40.00,
            "required_experience": 3,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[1],
            "role": "Clinical Pharmacist",
            "specialty": "Clinical Pharmacist",
            "date": str(today + datetime.timedelta(days=2)),
            "start_time": "09:00",
            "end_time": "17:00",
            "location": "Dublin",
            "rate": 52.00,
            "required_experience": 4,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[2],  # Cork
            "role": "Registered Nurse",
            "specialty": "ICU",
            "date": str(today + datetime.timedelta(days=2)),
            "start_time": "08:00",
            "end_time": "20:00",
            "location": "Cork",
            "rate": 41.50,
            "required_experience": 3,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[2],
            "role": "Healthcare Assistant",
            "specialty": "General Medicine",
            "date": str(today + datetime.timedelta(days=3)),
            "start_time": "14:00",
            "end_time": "22:00",
            "location": "Cork",
            "rate": 25.50,
            "required_experience": 1,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[3],  # Galway
            "role": "Physiotherapist",
            "specialty": "Rehabilitation",
            "date": str(today + datetime.timedelta(days=1)),
            "start_time": "09:00",
            "end_time": "17:00",
            "location": "Galway",
            "rate": 44.00,
            "required_experience": 2,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[3],
            "role": "Staff Nurse",
            "specialty": "Mental Health",
            "date": str(today + datetime.timedelta(days=4)),
            "start_time": "08:00",
            "end_time": "18:00",
            "location": "Galway",
            "rate": 37.00,
            "required_experience": 2,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[4],  # Limerick
            "role": "Registered Nurse",
            "specialty": "Mental Health",
            "date": str(today + datetime.timedelta(days=2)),
            "start_time": "19:00",
            "end_time": "07:00",
            "location": "Limerick",
            "rate": 39.50,
            "required_experience": 3,
            "status": "OPEN"
        },
        {
            "facility": created_facilities[4],
            "role": "Social Care Worker",
            "specialty": "General Medicine",
            "date": str(today + datetime.timedelta(days=5)),
            "start_time": "08:30",
            "end_time": "16:30",
            "location": "Limerick",
            "rate": 28.00,
            "required_experience": 1,
            "status": "OPEN"
        },
        {
            "facility": demo_facility,
            "role": "Registered Nurse",
            "specialty": "Emergency Care",
            "date": str(today + datetime.timedelta(days=6)),
            "start_time": "08:00",
            "end_time": "18:00",
            "location": "Dublin",
            "rate": 38.00,
            "required_experience": 2,
            "status": "CONFIRMED"
        },
        {
            "facility": demo_facility,
            "role": "Staff Nurse",
            "specialty": "ICU",
            "date": str(today + datetime.timedelta(days=7)),
            "start_time": "19:00",
            "end_time": "07:00",
            "location": "Dublin",
            "rate": 43.00,
            "required_experience": 3,
            "status": "OPEN"
        }
    ]

    created_shifts = []
    for s in shifts_data:
        shift_obj = Shift(
            facility_id=s["facility"].id,
            role=s["role"],
            specialty=s["specialty"],
            date=s["date"],
            start_time=s["start_time"],
            end_time=s["end_time"],
            location=s["location"],
            rate=s["rate"],
            required_experience=s["required_experience"],
            status=s["status"]
        )
        db.add(shift_obj)
        created_shifts.append(shift_obj)
    db.commit()

    # 5. Create 10 realistic applications
    # Shift 0 (Emergency Care in Dublin at demo facility): applications from other professionals so facility has pending applications ready to review!
    app_configs = [
        # For Demo Facility's shift 0:
        (created_shifts[0], created_profs[7], "APPLIED"), # Emma Gallagher (Emergency Care Dublin)
        (created_shifts[1], created_profs[1], "APPLIED"), # Liam O'Connor (ICU Dublin)
        (created_shifts[1], created_profs[9], "APPLIED"), # Conor Ryan (ICU Galway)
        (created_shifts[2], created_profs[2], "APPLIED"), # Aoife Murphy (General Medicine Cork)
        (created_shifts[3], created_profs[6], "APPLIED"), # Niamh Byrne (Pediatrics Dublin)
        # Confirmed shift
        (created_shifts[12], created_profs[1], "ACCEPTED"), # Confirmed placement
        # Applications from demo professional to other hospital shifts
        (created_shifts[4], demo_prof, "APPLIED"), # Demo prof applied to Mater Emergency Care
        # Other facilities' applications
        (created_shifts[5], created_profs[3], "APPLIED"), # David Walsh at Mater Pharmacist
        (created_shifts[8], created_profs[4], "ACCEPTED"), # Ciara Kelly at Galway
        (created_shifts[10], created_profs[5], "APPLIED"), # Sean Brennan at Limerick
    ]

    for shift_item, prof_item, app_status in app_configs:
        score, _ = calculate_ai_match(shift_item, prof_item)
        app = Application(
            shift_id=shift_item.id,
            professional_id=prof_item.id,
            status=app_status,
            match_score=score,
            applied_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=12)
        )
        db.add(app)
        if app_status == "APPLIED" and getattr(shift_item, "status", None) == "OPEN":
            setattr(shift_item, "status", "APPLIED")

    db.commit()
    print("Database seeding completed successfully.")
