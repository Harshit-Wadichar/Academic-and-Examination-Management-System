import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';
import StudentDashboard from '../components/student/Dashboard/StudentDashboard';
import AdminDashboard from '../components/admin/Dashboard/AdminDashboard';
import SeatingManagerDashboard from '../components/seating-manager/Dashboard/SeatingManagerDashboard';
import ClubCoordinatorDashboard from '../components/club-coordinator/Dashboard/ClubCoordinatorDashboard';
import TeacherDashboard from '../components/teacher/TeacherDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case USER_ROLES.STUDENT:
        return <StudentDashboard />;
      case USER_ROLES.ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.SEATING_MANAGER:
        return <SeatingManagerDashboard />;
      case USER_ROLES.CLUB_COORDINATOR:
        return <ClubCoordinatorDashboard />;
      case USER_ROLES.TEACHER:
        return <TeacherDashboard />;
      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Academic Management System</h2>
            <p className="text-gray-600 mt-2">Please contact administrator for role assignment.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-300">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;