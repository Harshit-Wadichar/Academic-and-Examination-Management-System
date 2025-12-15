import React from "react";
import { useAuth } from "../hooks/useAuth";
import SeatingArrangement from "../components/seating-manager/Seating/SeatingArrangement";
import StudentSeating from "../components/student/Seating/StudentSeating";

const SeatingPage = () => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (user?.role) {
      case "seating-manager":
      case "admin":
        return <SeatingArrangement />;
      case "student":
        return <StudentSeating />;
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
      case "seating-manager":
      case "admin":
        return "Seating Management";
      case "student":
        return "My Seating Arrangements";
      default:
        return "Seating";
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case "seating-manager":
      case "admin":
        return "Manage examination seating arrangements";
      case "student":
        return "View your examination seating arrangements";
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

export default SeatingPage;
