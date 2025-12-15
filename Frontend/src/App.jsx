import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/common/Layout/Navbar.jsx'
import Sidebar from './components/common/Layout/Sidebar.jsx'
import Footer from './components/common/Layout/Footer.jsx'
import LoadingSpinner from './components/common/UI/LoadingSpinner.jsx'
import ProtectedRoute from './components/common/Auth/ProtectedRoute.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const SyllabusPage = lazy(() => import('./pages/SyllabusPage.jsx'))
const HallTicketPage = lazy(() => import('./pages/HallTicketPage.jsx'))
const SeatingPage = lazy(() => import('./pages/SeatingPage.jsx'))
const EventsPage = lazy(() => import('./pages/EventsPage.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
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
              <Route
                path="/hallticket"
                element={
                  <ProtectedRoute>
                    <HallTicketPage />
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
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App
