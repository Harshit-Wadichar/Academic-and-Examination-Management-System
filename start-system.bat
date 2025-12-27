@echo off
REM Comprehensive startup script for Academic Management System
REM This ensures MongoDB is running before starting the backend

echo ========================================
echo Academic Management System Startup
echo ========================================

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" /FO CSV | findstr mongod.exe >nul
if %errorlevel%==0 (
    echo ✅ MongoDB is already running
) else (
    echo 🚀 Starting MongoDB...
    call manage-mongodb.bat start
    timeout /t 5 > nul
)

REM Verify MongoDB connection
echo 🔍 Verifying MongoDB connection...
mongosh --eval "db.runCommand({ping: 1})" "mongodb://127.0.0.1:27018/academic_management_system" --quiet >nul 2>&1
if %errorlevel%==0 (
    echo ✅ MongoDB connection verified
) else (
    echo ❌ MongoDB connection failed
    echo Please check:
    echo - Is MongoDB running? Run: manage-mongodb.bat status
    echo - Check logs: data\mongod.log
    pause
    exit /b 1
)

REM Start backend server
echo 🚀 Starting backend server...
cd backend
npm start

REM If backend exits, keep terminal open
echo Backend server stopped. Press any key to exit...
pause >nul