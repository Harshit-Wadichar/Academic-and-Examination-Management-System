@echo off
echo Starting Academic Management System...
echo.

echo Killing existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5002') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /PID %%a /F >nul 2>&1

echo Checking MongoDB on port 27018...
mongosh --port 27018 --eval "db.adminCommand('ping')" > nul 2>&1
if %errorlevel% neq 0 (
    echo Starting MongoDB without authentication...
    mkdir data\db 2>nul
    start "MongoDB" mongod --dbpath data\db --port 27018 --noauth
    timeout /t 5 > nul
)
echo MongoDB ready ✓

echo.
echo Starting services...

echo 1. Backend API (Port 5002)...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 > nul

echo 2. Frontend (Port 5173)...
start "Frontend" cmd /k "cd Frontend && npm run dev"

timeout /t 3 > nul

echo 3. AI Service (Port 8000)...
start "AI Service" cmd /k "cd python-ai-service && python main.py"

echo.
echo Access URLs:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5002
echo - AI Service: http://localhost:8000
echo.
pause