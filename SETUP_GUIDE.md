# Complete Setup Guide

## Step 1: Install MongoDB

### Option A: MongoDB Community Server (Recommended)
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically as a Windows service

### Option B: MongoDB using Chocolatey
```bash
# Install Chocolatey first (if not installed)
# Then run:
choco install mongodb

# Start MongoDB service
net start MongoDB
```

### Option C: MongoDB using Docker (Easiest)
```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Check if running
docker ps
```

## Step 2: Verify MongoDB Installation

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"
```

## Step 3: Install Project Dependencies

```bash
# Install all dependencies
npm run install:all
```

## Step 4: Start All Services

### Terminal 1: Backend API
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd Frontend
npm run dev
```

### Terminal 3: AI Service
```bash
cd python-ai-service
python main.py
```

## Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **AI Service**: http://localhost:8000
- **MongoDB**: localhost:27017

## Step 6: Test the Setup

1. Go to http://localhost:5173/register
2. Create a new account
3. Login and explore the dashboard

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB service is running
net start MongoDB

# Or restart the service
net stop MongoDB
net start MongoDB
```

### Port Issues
If any port is busy, update the .env files:
- Backend: Change PORT in `backend/.env`
- Frontend: Change VITE_API_BASE_URL in `Frontend/.env`

### Python Dependencies
```bash
cd python-ai-service
pip install -r requirements.txt
python -m textblob.download_corpora
```

## Default Test Credentials

After registration, you can create accounts with these roles:
- Student: Any email with role 'student'
- Admin: Any email with role 'admin'
- Seating Manager: Any email with role 'seating_manager'
- Club Coordinator: Any email with role 'club_coordinator'

## Quick Commands

```bash
# Start everything at once (requires 3 terminals)
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
npm run dev:ai        # Terminal 3

# Build for production
npm run build:frontend
```