import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SeatingDashboard = lazy(() => import('./pages/SeatingDashboard'));
const ClubCoordinatorDashboard = lazy(() => import('./pages/ClubCoordinatorDashboard'));

// Loading component
const Loading = () => (
  <div style={styles.loading}>
    <div style={styles.spinner}></div>
    <p>Loading...</p>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'student':
          return <Navigate to="/student" replace />;
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'seatingManager':
          return <Navigate to="/seating" replace />;
        case 'clubCoordinator':
          return <Navigate to="/club" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

// Role-based dashboard redirect
const RoleBasedRedirect = () => {
  const { getUserRole } = useAuth();
  const role = getUserRole();

  switch (role) {
    case 'student':
      return <Navigate to="/student" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'seatingManager':
      return <Navigate to="/seating" replace />;
    case 'clubCoordinator':
      return <Navigate to="/club" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes - role specific */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/seating" element={
              <ProtectedRoute allowedRoles={['seatingManager']}>
                <SeatingDashboard />
              </ProtectedRoute>
            } />

            <Route path="/club" element={
              <ProtectedRoute allowedRoles={['clubCoordinator']}>
                <ClubCoordinatorDashboard />
              </ProtectedRoute>
            } />

            {/* Root route redirects based on authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default App;