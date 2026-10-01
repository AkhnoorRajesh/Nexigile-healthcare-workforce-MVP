import sys
import os

# Ensure .venv site-packages is available for any interpreter
_venv_site = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".venv", "Lib", "site-packages"))
if os.path.exists(_venv_site) and _venv_site not in sys.path:
    sys.path.insert(0, _venv_site)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import auth, shifts, applications, facilities, professionals, admin

from contextlib import asynccontextmanager

# Initialize DB tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Nexgile MediOracle API",
    description="Healthcare Workforce Management & AI Matching Portal API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for MVP ease of testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(shifts.router)
app.include_router(applications.router)
app.include_router(facilities.router)
app.include_router(professionals.router)
app.include_router(admin.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Nexgile MediOracle Workforce Portal",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
