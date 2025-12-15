import { Routes, Route } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import StudentDashboard from '../components/student/Dashboard/StudentDashboard.jsx'
import AdminDashboard from '../components/admin/Dashboard/AdminDashboard.jsx'
import SeatingManagerDashboard from '../components/seating-manager/Dashboard/SeatingManagerDashboard.jsx'
import ClubCoordinatorDashboard from '../components/club-coordinator/Dashboard/ClubCoordinatorDashboard.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  const dashboards = {
    student: StudentDashboard,
    admin: AdminDashboard,
    seating_manager: SeatingManagerDashboard,
    club_coordinator: ClubCoordinatorDashboard,
  }

  const DashComponent = dashboards[user?.role] || StudentDashboard
  return <DashComponent />
}
