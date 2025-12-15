import React from "react";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Settings,
  MapPin,
  Trophy,
} from "lucide-react";
import Card from "../../common/UI/Card";
import { useApi } from "../../../hooks/useApi";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, loading } = useApi("/dashboard/admin");

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || "0",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Courses",
      value: stats?.activeCourses || "0",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Upcoming Exams",
      value: stats?.upcomingExams || "0",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "System Usage",
      value: stats?.systemUsage || "0%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

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
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 text-lg">
          System overview and management tools
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-lg`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/users" className="glass-card p-6 card-hover group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Manage Users</h3>
                <p className="text-sm text-slate-600">
                  Add, edit, and manage user accounts
                </p>
              </div>
            </div>
          </Link>

          <Link to="/exams" className="glass-card p-6 card-hover group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Manage Exams</h3>
                <p className="text-sm text-slate-600">
                  Create and schedule examinations
                </p>
              </div>
            </div>
          </Link>

          <Link to="/syllabus" className="glass-card p-6 card-hover group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Manage Syllabus
                </h3>
                <p className="text-sm text-slate-600">
                  Upload and organize course materials
                </p>
              </div>
            </div>
          </Link>

          <Link to="/seating" className="glass-card p-6 card-hover group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Seating Management
                </h3>
                <p className="text-sm text-slate-600">
                  Arrange examination seating
                </p>
              </div>
            </div>
          </Link>

          <Link to="/events" className="glass-card p-6 card-hover group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <Trophy className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Event Management
                </h3>
                <p className="text-sm text-slate-600">
                  Organize college events
                </p>
              </div>
            </div>
          </Link>

          <Link to="/halls" className="glass-card p-6 card-hover group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Hall Management
                </h3>
                <p className="text-sm text-slate-600">
                  Manage examination halls
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
              <div>
                <p className="font-semibold text-slate-800">
                  New student registered
                </p>
                <p className="text-sm text-slate-600">
                  John Doe - Computer Science
                </p>
              </div>
              <p className="text-xs text-slate-500 font-medium">5 min ago</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
              <div>
                <p className="font-semibold text-slate-800">
                  Exam schedule updated
                </p>
                <p className="text-sm text-slate-600">Mathematics Final Exam</p>
              </div>
              <p className="text-xs text-slate-500 font-medium">1 hour ago</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
              <div>
                <p className="font-semibold text-slate-800">
                  Syllabus uploaded
                </p>
                <p className="text-sm text-slate-600">Physics - Semester 3</p>
              </div>
              <p className="text-xs text-slate-500 font-medium">2 hours ago</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">
                Database
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">
                API Services
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">
                AI Service
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                Limited
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">
                Storage
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                85% Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
