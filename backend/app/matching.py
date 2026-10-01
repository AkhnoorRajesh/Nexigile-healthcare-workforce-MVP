from typing import Tuple, List
from .models import Shift, Professional

def calculate_ai_match(shift: Shift, professional: Professional) -> Tuple[int, List[str]]:
    """
    Transparent deterministic healthcare matching algorithm:
    - Specialty match: 30%
    - Availability: 20%
    - Location: 20%
    - Experience: 15%
    - Rating: 10%
    - Preference: 5%
    Total: 0 - 100
    """
    score = 0
    factors = []

    # 1. Specialty Match (30%)
    prof_spec = professional.specialty.lower().strip()
    shift_spec = shift.specialty.lower().strip()
    if prof_spec == shift_spec or shift_spec in prof_spec or prof_spec in shift_spec:
        score += 30
        factors.append("Specialty match")
    elif any(word in shift_spec for word in prof_spec.split() if len(word) > 3):
        score += 18
        factors.append("Related clinical specialty")
    else:
        score += 5

    # 2. Availability Match (20%)
    avail = (professional.availability or "").lower().strip()
    if "immediate" in avail or "full" in avail:
        score += 20
        factors.append("Availability match")
    elif "flexible" in avail or "weekends" in avail:
        score += 16
        factors.append("Flexible scheduling match")
    else:
        score += 10

    # 3. Location Proximity (20%)
    prof_loc = professional.location.lower().strip()
    shift_loc = shift.location.lower().strip()
    if prof_loc == shift_loc or prof_loc in shift_loc or shift_loc in prof_loc:
        score += 20
        factors.append("Location proximity")
    else:
        # Distance penalty
        score += 8

    # 4. Experience Match (15%)
    exp_diff = professional.experience_years - shift.required_experience
    if exp_diff >= 0:
        score += 15
        factors.append("Experience match")
    elif exp_diff == -1:
        score += 10
        factors.append("Junior qualified")
    else:
        score += 5

    # 5. Rating (10%)
    raw_rating = getattr(professional, "rating", 4.5)
    rating = float(raw_rating) if raw_rating is not None else 4.5
    rating_score = round((rating / 5.0) * 10)
    score += rating_score
    if rating >= 4.7:
        factors.append("High caregiver rating")

    # 6. Preference / Rate alignment (5%)
    # If rate is >= 30/hr, professional preference is satisfied
    if shift.rate >= 30.0:
        score += 5
        factors.append("Competitive hourly rate preference")
    else:
        score += 3

    # Clamp score to 100
    final_score = max(20, min(99, score))
    return final_score, factors
