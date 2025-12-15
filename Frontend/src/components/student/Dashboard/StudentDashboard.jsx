import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  MapPin,
  Trophy,
  Calendar,
  TrendingUp,
  Clock,
  Bell,
} from "lucide-react";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import { useApi } from "../../../hooks/useApi";

const StudentDashboard = () => {
  const { data: dashboardData, loading } = useApi("/dashboard/student");

  const quickActions = [
    {
      title: "View Syllabus",
      description: "Access course syllabus and materials",
      icon: BookOpen,
      link: "/syllabus",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Hall Ticket",
      description: "Download your examination hall ticket",
      icon: FileText,
      link: "/hall-ticket",
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Seating Arrangement",
      description: "Check your exam seating arrangement",
      icon: MapPin,
      link: "/seating",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Events",
      description: "View upcoming college events",
      icon: Trophy,
      link: "/events",
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const stats = [
    {
      label: "Courses Enrolled",
      value: dashboardData?.data?.enrolledCourses || "0",
      icon: BookOpen,
      change: "Active",
    },
    {
      label: "Upcoming Exams",
      value: dashboardData?.data?.upcomingExams || "0",
      icon: Calendar,
      change:
        dashboardData?.data?.upcomingExams > 0 ? "Next exam soon" : "No exams",
    },
    {
      label: "Hall Tickets",
      value: dashboardData?.data?.hallTickets || "0",
      icon: FileText,
      change: "Available",
    },
    {
      label: "Events",
      value: dashboardData?.data?.recentEvents || "0",
      icon: Trophy,
      change: "Upcoming",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Welcome Back! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Here's what's happening with your academics
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Button variant="outline" icon={<Bell size={20} />}>
              Notifications
            </Button>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              delay={index * 0.1}
              className="relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Access your most used features">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={action.link}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:shadow-xl"
                  >
                    <div
                      className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Upcoming Exams" subtitle="Don't miss your important dates">
          <div className="space-y-4">
            {[
              {
                subject: "Mathematics",
                type: "Final Exam",
                date: "Dec 15, 2024",
                time: "10:00 AM",
                status: "upcoming",
              },
              {
                subject: "Physics",
                type: "Mid-term",
                date: "Dec 18, 2024",
                time: "2:00 PM",
                status: "upcoming",
              },
              {
                subject: "Chemistry",
                type: "Lab Test",
                date: "Dec 20, 2024",
                time: "11:00 AM",
                status: "scheduled",
              },
            ].map((exam, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {exam.subject}
                    </p>
                    <p className="text-sm text-gray-600">{exam.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {exam.date}
                  </p>
                  <p className="text-xs text-gray-500">{exam.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card
          title="Recent Announcements"
          subtitle="Stay updated with latest news"
        >
          <div className="space-y-4">
            {[
              {
                title: "Exam Schedule Released",
                content: "Final examination schedule has been published.",
                time: "2 hours ago",
                type: "info",
              },
              {
                title: "Library Hours Extended",
                content: "Library will remain open until 10 PM during exams.",
                time: "1 day ago",
                type: "success",
              },
              {
                title: "Assignment Deadline",
                content: "Physics assignment due date extended to Dec 22.",
                time: "2 days ago",
                type: "warning",
              },
            ].map((announcement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-xl border-l-4 ${
                  announcement.type === "info"
                    ? "bg-blue-50 border-blue-500"
                    : announcement.type === "success"
                    ? "bg-green-50 border-green-500"
                    : "bg-yellow-50 border-yellow-500"
                } hover:shadow-md transition-all duration-300`}
              >
                <p className="font-semibold text-gray-900 mb-1">
                  {announcement.title}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-gray-500">{announcement.time}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
