@echo off
echo Starting Academic and Examination Management System...

:: Start MongoDB (if installed as service, this might not be needed, but good to check)
:: echo Starting MongoDB...
:: net start MongoDB

:: Start Backend
start "Backend Server" cmd /k "cd backend && npm install && npm run dev"

:: Start Frontend
start "Frontend Application" cmd /k "cd Frontend && npm install && npm run dev"

:: Start Python AI Service
start "AI Service" cmd /k "cd python-ai-service && pip install -r requirements.txt && python main.py"

echo All services launched!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo AI Service: http://localhost:8000
