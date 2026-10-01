@echo off
echo ========================================================
echo Starting Nexgile - MediOracle Healthcare Workforce Portal
echo ========================================================

echo Starting FastAPI Backend on port 8000...
if exist "%~dp0.venv\Scripts\python.exe" (
    start "MediOracle Backend" cmd /k "cd /d %~dp0backend && "%~dp0.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000"
) else (
    start "MediOracle Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"
)

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend on port 5173...
start "MediOracle Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Application launched!
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo ========================================================
pause
