import React from "react";
import { Trophy, Users, Calendar, CheckCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
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

  const stats = dashboardData?.data || {};
  const events = stats.events || [];
  
  // Count pending events
  const pendingEvents = events.filter(e => e.status === "Pending").length;

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Club Coordinator Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage clubs and coordinate events.
          </p>
        </div>
        <Link to="/club-coordinator/events">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Manage Events
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalEvents || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming Events
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.upcomingEvents || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.recentEvents || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Approvals
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingEvents}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Events">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div>
                    <p className="font-medium dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === "Approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : event.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link to="/club-coordinator/events">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                <p className="font-medium text-blue-900 dark:text-blue-300">Create New Event</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Organize a new club event or workshop
                </p>
              </div>
            </Link>
            <Link to="/club-coordinator/events">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                <p className="font-medium text-green-900 dark:text-green-300">View All Events</p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Manage and track all club events
                </p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClubCoordinatorDashboard;
