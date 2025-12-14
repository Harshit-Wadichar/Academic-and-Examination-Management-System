# Project file structure

```
college-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── syllabus.controller.js
│   │   │   ├── exam.controller.js
│   │   │   ├── hallticket.controller.js
│   │   │   ├── seating.controller.js
│   │   │   ├── event.controller.js
│   │   │   └── ai-service.controller.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Syllabus.js
│   │   │   ├── Course.js
│   │   │   ├── Exam.js
│   │   │   ├── HallTicket.js
│   │   │   ├── SeatingArrangement.js
│   │   │   ├── Event.js
│   │   │   └── AcademicRecord.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── syllabus.routes.js
│   │   │   ├── exam.routes.js
│   │   │   ├── hallticket.routes.js
│   │   │   ├── seating.routes.js
│   │   │   ├── event.routes.js
│   │   │   └── ai.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── pdf.service.js
│   │   │   ├── email.service.js
│   │   │   ├── ai-integration.service.js
│   │   │   └── seating-algorithm.service.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   └── errorHandler.js
│   │   ├── scripts/
│   │   │   └── seedData.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Layout/
│   │   │   │   │   ├── Navbar.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   └── Footer.jsx
│   │   │   │   ├── UI/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   ├── Card.jsx
│   │   │   │   │   ├── Modal.jsx
│   │   │   │   │   ├── Table.jsx
│   │   │   │   │   └── LoadingSpinner.jsx
│   │   │   │   └── Auth/
│   │   │   │       ├── ProtectedRoute.jsx
│   │   │   │       └── RoleBasedRoute.jsx
│   │   │   ├── student/
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── StudentDashboard.jsx
│   │   │   │   ├── HallTicket/
│   │   │   │   │   └── HallTicketCard.jsx
│   │   │   │   ├── Syllabus/
│   │   │   │   │   └── SyllabusViewer.jsx
│   │   │   │   └── Exams/
│   │   │   │       └── ExamSchedule.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── AdminDashboard.jsx
│   │   │   │   ├── Users/
│   │   │   │   │   └── UserManagement.jsx
│   │   │   │   ├── Syllabus/
│   │   │   │   │   └── SyllabusManager.jsx
│   │   │   │   └── Exams/
│   │   │   │       └── ExamController.jsx
│   │   │   ├── seating-manager/
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── SeatingManagerDashboard.jsx
│   │   │   │   ├── Seating/
│   │   │   │   │   └── SeatingArrangement.jsx
│   │   │   │   └── Halls/
│   │   │   │       └── HallManagement.jsx
│   │   │   └── club-coordinator/
│   │   │       ├── Dashboard/
│   │   │       │   └── ClubCoordinatorDashboard.jsx
│   │   │       ├── Events/
│   │   │       │   └── EventManager.jsx
│   │   │       └── Clubs/
│   │ │           └── ClubManagement.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SyllabusPage.jsx
│   │   │   ├── HallTicketPage.jsx
│   │   │   ├── SeatingPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   └── storage.service.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── styles/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── python-ai-service/
│   ├── app/
│   │   ├── mindmap_generator.py
│   │   ├── suggestion_engine.py
│   │   └── text_processor.py
│   ├── requirements.txt
│   ├── main.py
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── package.json (workspace)
````