# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- MongoDB (v7.0+) or Docker

### Option 1: Local Development (Recommended for Development)

#### 1. Install Dependencies
```bash
# Install all dependencies at once
npm run install:all
```

#### 2. Start MongoDB
```bash
# If you have MongoDB installed locally
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

#### 3. Start All Services
```bash
# Terminal 1: Backend API
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: AI Service
npm run dev:ai
```

#### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000

### Option 2: Docker (Recommended for Production)

#### 1. Start Everything with Docker
```bash
# Build and start all services
npm run docker:up

# Or manually
docker-compose up --build
```

#### 2. Access the Application
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **MongoDB**: localhost:27017

### 🧪 Test the Setup

#### 1. Test AI Service
```bash
cd python-ai-service
python test_service.py
```

#### 2. Test Frontend Build
```bash
cd frontend
npm run build
```

#### 3. Test Backend Syntax
```bash
cd backend
node -c server.js
```

### 👤 Default Login Credentials

Since this is a fresh installation, you'll need to register a new account:

1. Go to http://localhost:5173/register
2. Fill in the registration form
3. Choose your role (Student, Admin, etc.)
4. Login with your credentials

### 🔧 Common Issues & Solutions

#### Issue: MongoDB Connection Error
```bash
# Solution: Make sure MongoDB is running
# Local MongoDB:
mongod

# Docker MongoDB:
docker run -d -p 27017:27017 mongo:7.0
```

#### Issue: Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000

# Kill the process or change port in .env files
```

#### Issue: Python Dependencies Missing
```bash
cd python-ai-service
pip install -r requirements.txt
python -m textblob.download_corpora
```

#### Issue: Frontend Build Fails
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 📁 Project Structure Overview

```
Academic-and-Examination-Management-System/
├── frontend/          # React.js + Tailwind CSS
├── backend/           # Node.js + Express + MongoDB
├── python-ai-service/ # Python + FastAPI + AI/ML
├── docker-compose.yml # Docker orchestration
└── package.json       # Workspace scripts
```

### 🎯 Next Steps

1. **Explore the Application**: Navigate through different role-based dashboards
2. **Test AI Features**: Try generating mindmaps from syllabus content
3. **Customize**: Modify the code to fit your specific requirements
4. **Deploy**: Use Docker for production deployment

### 📚 Additional Resources

- **Full Documentation**: See README.md
- **API Documentation**: Visit http://localhost:5000/health when backend is running
- **AI Service Docs**: Visit http://localhost:8000/docs when AI service is running

### 🆘 Need Help?

If you encounter any issues:
1. Check the console logs in each terminal
2. Verify all services are running on correct ports
3. Ensure all dependencies are installed
4. Check the README.md for detailed troubleshooting

---

**Happy Coding! 🎉**