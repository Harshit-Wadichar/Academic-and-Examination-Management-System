@echo off
echo Starting MongoDB without authentication...

mkdir data\db 2>nul

echo Starting mongod on port 27018 without auth...
start "MongoDB" mongod --dbpath data\db --port 27018 --noauth

timeout /t 3 > nul

echo MongoDB started on port 27018 without authentication
echo Database will be created at: %cd%\data\db