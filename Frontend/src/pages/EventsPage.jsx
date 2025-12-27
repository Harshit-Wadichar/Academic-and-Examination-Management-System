import React from "react";
import { useAuth } from "../hooks/useAuth";
import AdminEventApproval from "../components/admin/Events/AdminEventApproval";
import EventManager from "../components/club-coordinator/Events/EventManager";
import StudentEvents from "../components/student/Events/StudentEvents";
import { Trophy } from "lucide-react";
import { USER_ROLES } from "../utils/constants";

const EventsPage = () => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (user?.role) {
      case USER_ROLES.CLUB_COORDINATOR:
        return <EventManager />;
      case USER_ROLES.ADMIN:
        return <AdminEventApproval />;
      case USER_ROLES.STUDENT:
        return <StudentEvents />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="text-gray-600">
              You don't have permission to view this page.
            </p>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case USER_ROLES.CLUB_COORDINATOR:
      case USER_ROLES.ADMIN:
        return "Event Management";
      case USER_ROLES.STUDENT:
        return "College Events";
      default:
        return "Events";
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case USER_ROLES.CLUB_COORDINATOR:
      case USER_ROLES.ADMIN:
        return "Organize and manage college events";
      case "student":
        return "Stay updated with upcoming college events and activities";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen relative p-6">

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 flex items-center">
            <Trophy className="mr-3 text-indigo-500" size={32} />
            {getPageTitle()}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{getPageDescription()}</p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default EventsPage;
