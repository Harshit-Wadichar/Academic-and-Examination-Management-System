# Academic and Examination Management System

A comprehensive full-stack application for managing academic and examination processes in educational institutions. The system provides role-based dashboards for Students, Admins, Seating Managers, and Club Coordinators.

## 🏗️ Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js and MongoDB
- **AI Service**: Python with FastAPI for mindmap generation and academic suggestions
- **Database**: MongoDB for data storage

## 🚀 Features

### Student Features

- View syllabus and course materials
- Download hall tickets
- Check seating arrangements
- View upcoming events
- Access AI-generated study suggestions

### Admin Features

- User management (students, faculty, staff)
- Syllabus management
- Exam scheduling and management
- System analytics and reporting

### Seating Manager Features

- Create and manage seating arrangements
- Hall management
- Exam hall allocation

### Club Coordinator Features

- Event management and approval
- Club administration
- Activity coordination

### AI Features

- Generate mindmaps from syllabus content
- Provide personalized academic suggestions
- Performance analysis and recommendations

## 📁 Project Structure

```
Academic-and-Examination-Management-System/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic services
│   │   └── config/         # Configuration files
│   └── package.json
├── python-ai-service/      # Python AI microservice
│   ├── app/
│   │   ├── mindmap_generator.py
│   │   ├── suggestion_engine.py
│   │   └── text_processor.py
│   ├── main.py
│   └── requirements.txt
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.11 or higher)
- MongoDB (v7.0 or higher)
- Git

### 🗄️ Database Management

#### Quick Start (Recommended)

```bash
# Start the entire system (MongoDB + Backend + Frontend)
./start-system.bat
```

#### Manual MongoDB Management

```bash
# Start MongoDB
./manage-mongodb.bat start

# Stop MongoDB
./manage-mongodb.bat stop

# Restart MongoDB
./manage-mongodb.bat restart

# Check MongoDB status
./manage-mongodb.bat status
```

#### Troubleshooting Database Issues

**If MongoDB won't start:**

1. Check if port 27018 is available: `netstat -ano | findstr 27018`
2. Remove lock file if exists: Delete `data/db/mongod.lock`
3. Check MongoDB logs: `data/mongod.log`

**If backend can't connect:**

1. Ensure MongoDB is running: `./manage-mongodb.bat status`
2. Verify connection: `mongosh --eval "db.runCommand({ping: 1})" "mongodb://127.0.0.1:27018/academic_management_system"`
3. Check backend logs for detailed error messages

**Database Configuration:**

- **Port**: 27018
- **Database Name**: academic_management_system
- **Data Directory**: `data/db/`
- **Log File**: `data/mongod.log`

### Automatic Recovery

The backend now includes automatic database reconnection with:

- 5 retry attempts with exponential backoff
- Connection monitoring and auto-reconnection
- Detailed error logging for troubleshooting

### Method 1: Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Academic-and-Examination-Management-System
```

#### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your configuration
npm run dev
```

#### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

#### 4. Setup AI Service

```bash
cd python-ai-service
pip install -r requirements.txt
python main.py
```

#### 5. Setup Database

- Install and start MongoDB
- The application will create the database automatically on first run

### Method 2: Docker Setup

#### 1. Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

#### 2. Access the Application

- Frontend: http://localhost:5173 (development) or http://localhost (production)
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: localhost:27017

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/academic_management_system
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000/api
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### AI Service Endpoints

- `POST /api/generate-mindmap` - Generate mindmap from syllabus
- `POST /api/get-suggestions` - Get academic suggestions
- `GET /health` - Health check

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
npm run test
```

### AI Service Testing

```bash
cd python-ai-service
python -m pytest
```

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start

# AI Service
cd python-ai-service
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React.js with Tailwind CSS
- **Backend Development**: Node.js with Express.js
- **AI/ML Development**: Python with FastAPI
- **Database**: MongoDB

## 🆘 Support

For support, email support@academicms.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - User authentication and role-based access
  - Basic CRUD operations for all entities
  - AI-powered mindmap generation
  - Academic suggestion engine

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Integration with external LMS
- [ ] Automated report generation
- [ ] Video conferencing integration
- [ ] Advanced AI features (chatbot, predictive analytics)

---

**Note**: This is a comprehensive academic management system designed for educational institutions. Please ensure proper security measures are in place before deploying to production.
