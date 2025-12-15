import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/Auth/ProtectedRoute";
import RoleBasedRoute from "./components/common/Auth/RoleBasedRoute";
import Navbar from "./components/common/Layout/Navbar";
import Sidebar from "./components/common/Layout/Sidebar";
import Footer from "./components/common/Layout/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SyllabusPage from "./pages/SyllabusPage";
import UserManagement from "./pages/UserManagement";
import ExamManagement from "./pages/ExamManagement";
import HallTicket from "./pages/HallTicket";
import SeatingPage from "./pages/SeatingPage";
import EventsPage from "./pages/EventsPage";
import HallManagement from "./components/seating-manager/Halls/HallManagement";
import ClubManagement from "./components/club-coordinator/Clubs/ClubManagement";
import { useAuth } from "./hooks/useAuth";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="min-h-full">{children}</div>
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
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/syllabus"
                  element={
                    <ProtectedRoute>
                      <SyllabusPage />
                    </ProtectedRoute>
                  }
                />

                {/* Placeholder routes */}
                <Route
                  path="/hall-ticket"
                  element={
                    <ProtectedRoute>
                      <HallTicket />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/seating"
                  element={
                    <ProtectedRoute>
                      <SeatingPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <EventsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <RoleBasedRoute allowedRoles={["admin"]}>
                      <UserManagement />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/exams"
                  element={
                    <RoleBasedRoute allowedRoles={["admin"]}>
                      <ExamManagement />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/halls"
                  element={
                    <RoleBasedRoute allowedRoles={["seating-manager", "admin"]}>
                      <HallManagement />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/clubs"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["club-coordinator", "admin"]}
                    >
                      <ClubManagement />
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
            </AppLayout>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
