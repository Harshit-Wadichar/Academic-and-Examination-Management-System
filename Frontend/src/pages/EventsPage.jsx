import React from "react";
import { useAuth } from "../hooks/useAuth";
import EventManager from "../components/club-coordinator/Events/EventManager";
import StudentEvents from "../components/student/Events/StudentEvents";

const EventsPage = () => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (user?.role) {
      case "club-coordinator":
      case "admin":
        return <EventManager />;
      case "student":
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
      case "club-coordinator":
      case "admin":
        return "Event Management";
      case "student":
        return "College Events";
      default:
        return "Events";
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case "club-coordinator":
      case "admin":
        return "Organize and manage college events";
      case "student":
        return "Stay updated with upcoming college events and activities";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="mt-2 text-gray-600">{getPageDescription()}</p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default EventsPage;
