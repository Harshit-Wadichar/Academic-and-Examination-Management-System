@echo off
REM MongoDB Management Script for Windows
REM This script provides reliable MongoDB management

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="status" goto status
goto help

:start
echo Starting MongoDB...
call :start_mongo
goto end

:stop
echo Stopping MongoDB...
call :stop_mongo
goto end

:restart
echo Restarting MongoDB...
call :stop_mongo
timeout /t 2 > nul
call :start_mongo
goto end

:status
echo Checking MongoDB status...
tasklist /FI "IMAGENAME eq mongod.exe" /FO TABLE
netstat -ano | findstr 27018
goto end

:help
echo MongoDB Management Script
echo Usage: %0 [command]
echo Commands:
echo   start   - Start MongoDB
echo   stop    - Stop MongoDB
echo   restart - Restart MongoDB
echo   status  - Check MongoDB status
goto end

:start_mongo
REM Create data directory if it doesn't exist
if not exist "data\db" mkdir data\db

REM Remove lock file if it exists (from unclean shutdown)
if exist "data\db\mongod.lock" (
    echo Removing stale lock file...
    del "data\db\mongod.lock" 2>nul
)

REM Start MongoDB
echo Starting MongoDB on port 27018...
start "MongoDB" /B mongod --dbpath data\db --port 27018 --noauth --logpath data\mongod.log --logappend

REM Wait a moment for startup
timeout /t 3 > nul

REM Check if it's running
tasklist /FI "IMAGENAME eq mongod.exe" /FO CSV | findstr mongod.exe >nul
if %errorlevel%==0 (
    echo MongoDB started successfully!
) else (
    echo MongoDB failed to start. Check data\mongod.log for details.
)
goto :eof

:stop_mongo
REM Find and stop MongoDB process
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq mongod.exe" /FO CSV ^| findstr mongod.exe') do (
    echo Stopping MongoDB process %%i...
    taskkill /PID %%i /F >nul 2>&1
)
timeout /t 2 > nul
goto :eof

:end