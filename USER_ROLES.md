# User Roles and Responsibilities

## Overview
The Academic and Examination Management System supports 4 distinct user roles, each with specific permissions and responsibilities.

---

## 1. Student (student)

### Responsibilities
- View course syllabus and materials
- Download hall tickets for exams
- Check seating arrangements
- View exam schedule
- Access academic events
- View personal academic records
- Generate AI-powered mindmaps from syllabus
- Get personalized academic suggestions

### Access Permissions
✅ **Can Access:**
- Personal dashboard
- Syllabus viewer
- Hall ticket download
- Seating arrangement view
- Events calendar
- Profile management
- AI features (mindmap generation, suggestions)

❌ **Cannot Access:**
- User management
- Exam creation/editing
- Seating arrangement creation
- Hall management
- Event management
- System administration

### Key Features
- **Dashboard**: View enrolled courses, upcoming exams, hall tickets
- **Syllabus**: Access course materials and generate mindmaps
- **Hall Tickets**: Download exam hall tickets
- **Seating**: View assigned exam seating
- **Events**: Browse college events

---

## 2. Admin (admin)

### Responsibilities
- Complete system administration
- Manage all users (students, faculty, staff)
- Create and manage exams
- Manage syllabus for all courses
- Issue hall tickets to students
- View system-wide analytics
- Approve events (if required)
- Manage all system settings

### Access Permissions
✅ **Can Access:**
- All features available to other roles
- User management (CRUD operations)
- Exam management (create, edit, delete)
- Syllabus management (all courses)
- Hall ticket issuance
- System dashboard with analytics
- Event approval
- Seating arrangement management
- Hall management

### Key Features
- **User Management**: Add, edit, delete users, assign roles
- **Exam Management**: Create exams, set schedules, manage exam details
- **Syllabus Management**: Create and update course syllabus
- **Hall Tickets**: Issue hall tickets to students
- **Dashboard**: System-wide statistics and analytics
- **Events**: Approve events created by coordinators

---

## 3. Seating Manager (seating_manager)

### Responsibilities
- Manage examination halls
- Create seating arrangements for exams
- Allocate students to specific seats
- Manage hall capacity and locations
- Generate seating charts
- Finalize seating arrangements

### Access Permissions
✅ **Can Access:**
- Hall management (create, edit, delete halls)
- Seating arrangement creation
- View all exams
- Generate seating charts
- Finalize seating arrangements
- View seating statistics

❌ **Cannot Access:**
- User management
- Exam creation (can view)
- Syllabus management
- Event management
- System settings

### Key Features
- **Hall Management**: 
  - Create examination halls
  - Set hall capacity
  - Define hall locations
  - Manage hall availability

- **Seating Arrangements**:
  - Select exam and hall
  - Generate automatic seating arrangement
  - Assign students to specific seats
  - Finalize arrangements
  - Download seating charts

- **Dashboard**: 
  - View upcoming exams
  - Hall utilization statistics
  - Pending seating arrangements

---

## 4. Club Coordinator (club_coordinator)

### Responsibilities
- Create and manage college events
- Coordinate club activities
- Manage event registrations
- View event attendance
- Update event details
- Cancel events if needed

### Access Permissions
✅ **Can Access:**
- Event creation and management
- Event editing and updates
- View all events
- Event cancellation
- Event attendance tracking
- Club management features

❌ **Cannot Access:**
- User management
- Exam management
- Syllabus management
- Seating arrangements
- Hall management
- System administration

### Key Features
- **Event Management**:
  - Create new events
  - Edit event details
  - Set event dates and locations
  - Manage event capacity
  - Cancel events

- **Dashboard**:
  - View upcoming events
  - Event statistics
  - Attendance tracking

---

## Role Comparison Table

| Feature | Student | Admin | Seating Manager | Club Coordinator |
|---------|---------|-------|-----------------|------------------|
| View Syllabus | ✅ | ✅ | ❌ | ❌ |
| Download Hall Ticket | ✅ | ✅ | ❌ | ❌ |
| View Seating | ✅ | ✅ | ❌ | ❌ |
| View Events | ✅ | ✅ | ❌ | ✅ |
| Manage Users | ❌ | ✅ | ❌ | ❌ |
| Create Exams | ❌ | ✅ | ❌ | ❌ |
| Manage Syllabus | ❌ | ✅ | ❌ | ❌ |
| Issue Hall Tickets | ❌ | ✅ | ❌ | ❌ |
| Manage Halls | ❌ | ✅ | ✅ | ❌ |
| Create Seating | ❌ | ✅ | ✅ | ❌ |
| Create Events | ❌ | ✅ | ❌ | ✅ |
| System Analytics | ❌ | ✅ | ❌ | ❌ |

---

## Registration and Role Assignment

### During Registration
When registering a new account:
1. Choose your role from dropdown
2. Available roles: Student, Admin, Seating Manager, Club Coordinator
3. Role determines dashboard and access permissions

### Role Assignment (Admin Only)
Admins can:
- Change user roles after registration
- Assign multiple roles (if system allows)
- Deactivate user accounts

---

## Dashboard Overview by Role

### Student Dashboard
- Upcoming exams count
- Enrolled courses
- Hall tickets available
- Recent events
- Quick actions (syllabus, tickets, seating, events)
- AI suggestions section

### Admin Dashboard
- Total students count
- Active courses
- Upcoming exams
- System usage statistics
- User distribution
- Exam statistics
- Quick access to all management features

### Seating Manager Dashboard
- Pending seating arrangements
- Hall utilization
- Upcoming exams requiring seating
- Quick access to hall management
- Seating arrangement tools

### Club Coordinator Dashboard
- Upcoming events
- Event statistics
- Attendance data
- Quick event creation
- Event management tools

---

## Best Practices

### For Students
- Keep profile information updated
- Download hall tickets well in advance
- Check seating arrangements before exams
- Use AI features for better learning

### For Admins
- Regularly review user accounts
- Create exams with sufficient advance notice
- Ensure syllabus is up-to-date
- Monitor system usage and analytics

### For Seating Managers
- Create halls with accurate capacity
- Finalize seating arrangements early
- Ensure proper student distribution
- Coordinate with exam schedule

### For Club Coordinators
- Create events with complete information
- Set appropriate capacity limits
- Update event details promptly
- Track attendance effectively

---

## Support

For role-specific issues or permission problems, contact system administrator.

