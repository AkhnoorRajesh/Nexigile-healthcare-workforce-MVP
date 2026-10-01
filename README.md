# Nexgile – MediOracle Healthcare Workforce Portal

A modern healthcare staffing and AI matching web application.

- **Frontend**: React + Vite (Boutique Wellness Aesthetic)
- **Backend**: Python + FastAPI
- **Database**: SQLite (SQLAlchemy ORM - auto-initialized and seeded on first run)

---

## Quick Start Guide

You need **two terminal windows**: one for the Backend and one for the Frontend.

### Terminal 1: Backend (FastAPI)

1. Open PowerShell or Command Prompt and navigate to the project directory:
   ```bash
   cd c:\Users\NAWAB\OneDrive\Desktop\dataminds\backend
   ```

2. (Optional) Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   Backend will be running at: **http://127.0.0.1:8000**  
   Interactive API docs (Swagger): **http://127.0.0.1:8000/docs**

---

### Terminal 2: Frontend (React + Vite)

1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd c:\Users\NAWAB\OneDrive\Desktop\dataminds\frontend
   ```

2. (First time only) Install Node packages:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will be running at: **http://localhost:5173**

---

## Demo Login Accounts (Pre-Seeded)

On the login page, you can use the **1-Click Quick Access cards** or enter:

| Portal Role | Email | Password |
| :--- | :--- | :--- |
| **Hospital Facility** | `facility@medioracle.com` | `Facility@123` |
| **Healthcare Professional** | `professional@medioracle.com` | `Professional@123` |
| **Platform Administrator** | `admin@medioracle.com` | `Admin@123` |
