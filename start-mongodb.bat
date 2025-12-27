@echo off
echo Starting MongoDB with proper error handling...

REM Create data directory if it doesn't exist
if not exist "data\db" mkdir data\db

REM Remove lock file if it exists (from unclean shutdown)
if exist "data\db\mongod.lock" (
    echo Removing stale lock file...
    del "data\db\mongod.lock"
)

echo Starting MongoDB on port 27018...
mongod --dbpath data\db --port 27018 --noauth --logpath data\mongod.log --logappend

if %errorlevel% neq 0 (
    echo MongoDB failed to start. Check the log file: data\mongod.log
    pause
    exit /b 1
)

echo MongoDB started successfully!
echo Database will be created at: %cd%\data\db
echo Log file: %cd%\data\mongod.log