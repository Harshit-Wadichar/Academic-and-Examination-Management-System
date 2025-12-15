import React from "react";
import { Trophy, Users, Calendar, CheckCircle } from "lucide-react";
import Card from "../../common/UI/Card";
import { useApi } from "../../../hooks/useApi";

const ClubCoordinatorDashboard = () => {
  const { data: dashboardData, loading } = useApi(
    "/dashboard/club-coordinator"
  );

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
          Club Coordinator Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage clubs and coordinate events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.data?.totalEvents || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Upcoming Events
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.data?.upcomingEvents || 0}
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
              <p className="text-sm font-medium text-gray-600">Recent Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.data?.recentEvents || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Approvals
              </p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Events">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Tech Fest 2024</p>
                <p className="text-sm text-gray-600">Computer Science Club</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Approved
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Cultural Night</p>
                <p className="text-sm text-gray-600">Arts Club</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Pending
              </span>
            </div>
          </div>
        </Card>

        <Card title="Club Activities">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <p className="font-medium text-blue-900">Photography Workshop</p>
              <p className="text-sm text-blue-700">
                Photography Club - Dec 20, 2024
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="font-medium text-green-900">Coding Competition</p>
              <p className="text-sm text-green-700">
                Programming Club - Dec 22, 2024
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClubCoordinatorDashboard;
