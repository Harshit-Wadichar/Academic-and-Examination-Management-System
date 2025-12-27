import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { USER_ROLES } from "./utils/constants";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/Auth/ProtectedRoute";
import RoleBasedRoute from "./components/common/Auth/RoleBasedRoute";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import TeacherSyllabusManager from "./components/teacher/Syllabus/TeacherSyllabusManager";
import UploadNotes from "./components/teacher/UploadNotes";
import StudentNotes from "./components/student/Notes/StudentNotes";
import SyllabusViewer from "./components/student/Syllabus/SyllabusViewer";
import AdminNotesControl from "./components/admin/Notes/AdminNotesControl";
import Navbar from "./components/common/Layout/Navbar";
import Sidebar from "./components/common/Layout/Sidebar";
import PageTransition from "./components/common/Layout/PageTransition";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import ExamManagement from "./pages/ExamManagement";
import HallTicket from "./pages/HallTicket";
import SeatingPage from "./pages/SeatingPage";
import EventsPage from "./pages/EventsPage";
import CourseCatalog from "./pages/CourseCatalog";
import HallManagement from "./components/seating-manager/Halls/HallManagement";
import ClubManagement from "./components/club-coordinator/Clubs/ClubManagement";
import ClubJoinRequests from "./components/club-coordinator/Clubs/ClubJoinRequests";
import AdminClubApproval from "./components/admin/Clubs/AdminClubApproval";
import AdminAnnouncements from "./components/admin/Announcements/AdminAnnouncements";
import HallTicketApprovals from "./pages/HallTicketApprovals";
import StudentClubs from "./components/student/Clubs/StudentClubs";
import ProblemBox from "./components/student/ProblemBox/ProblemBox";
import ProblemInbox from "./components/common/ProblemInbox";
import { useAuth } from "./hooks/useAuth";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
              <PageTransition>
                <TeacherDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
              <PageTransition>
                <StudentNotes />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <PageTransition>
                <AdminNotesControl />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/syllabus"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
              <PageTransition>
                <SyllabusViewer />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/syllabus"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
              <PageTransition>
                <TeacherSyllabusManager />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/upload-notes"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
              <PageTransition>
                <UploadNotes />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CourseCatalog />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes */}
        <Route
          path="/hall-ticket"
          element={
            <ProtectedRoute>
              <PageTransition>
                <HallTicket />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/seating"
          element={
            <ProtectedRoute>
              <PageTransition>
                <SeatingPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <PageTransition>
                <EventsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <PageTransition>
                <UserManagement />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <RoleBasedRoute allowedRoles={["admin", "teacher"]}>
              <PageTransition>
                <ExamManagement />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/halls"
          element={
            <RoleBasedRoute allowedRoles={["seating_manager", "admin"]}>
              <PageTransition>
                <HallManagement />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/clubs"
          element={
            <RoleBasedRoute
              allowedRoles={["club_coordinator", "admin"]}
            >
              <PageTransition>
                <ClubManagement />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        <Route
          path="/club-coordinator/events"
          element={
            <RoleBasedRoute
              allowedRoles={["club_coordinator", "admin"]}
            >
              <PageTransition>
                <EventsPage />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Admin Club Approval */}
        <Route
          path="/admin/clubs"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <PageTransition>
                <AdminClubApproval />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Admin Announcements */}
        <Route
          path="/admin/announcements"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <PageTransition>
                <AdminAnnouncements />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Admin Hall Ticket Approvals */}
        <Route
          path="/admin/hall-tickets"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <PageTransition>
                <HallTicketApprovals />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Student Clubs */}
        <Route
          path="/student/clubs"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <PageTransition>
                <StudentClubs />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Club Coordinator Join Requests */}
        <Route
          path="/club-coordinator/join-requests"
          element={
            <RoleBasedRoute allowedRoles={["club_coordinator", "admin"]}>
              <PageTransition>
                <ClubJoinRequests />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Problem Box - Students */}
        <Route
          path="/problem-box"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <PageTransition>
                <ProblemBox />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Problem Inbox - Staff */}
        <Route
          path="/problem-inbox"
          element={
            <RoleBasedRoute allowedRoles={["admin", "seating_manager", "club_coordinator"]}>
              <PageTransition>
                <ProblemInbox />
              </PageTransition>
            </RoleBasedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AnimatedRoutes />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">


      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
          <div className="min-h-full">
             <AnimatedRoutes />
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppLayout />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
              containerStyle={{
                  zIndex: 99999
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
