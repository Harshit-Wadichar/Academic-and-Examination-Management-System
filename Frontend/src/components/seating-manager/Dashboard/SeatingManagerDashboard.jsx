import React from "react";
import { MapPin, Users, Calendar, Settings } from "lucide-react";
import Card from "../../common/UI/Card";
import { useApi } from "../../../hooks/useApi";

const SeatingManagerDashboard = () => {
  const { data: dashboardData, loading } = useApi("/dashboard/seating-manager");

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Seating Manager Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage examination seating arrangements and halls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Halls</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.data?.totalHalls || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Upcoming Seatings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.data?.upcomingSeatings || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Recent Arrangements
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.data?.recentArrangements || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Available Capacity
              </p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Seating Arrangements">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Mathematics Final - Hall A</p>
              <p className="text-sm text-gray-600">120 students assigned</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Completed
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Physics Mid-term - Hall B & C</p>
              <p className="text-sm text-gray-600">200 students assigned</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              In Progress
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SeatingManagerDashboard;
