import React from "react";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Settings,
  Trophy,
  Grid,
  Inbox,
  MapPin,
} from "lucide-react";
import Card from "../../common/UI/Card";
import { useApi } from "../../../hooks/useApi";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, loading } = useApi("/dashboard/admin");

  const statCards = [
    {
      title: "Total Students",
      value: stats?.data?.totalStudents || stats?.totalStudents || "0",
      icon: Users,
      bgValues: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Active Courses",
      value: stats?.data?.activeCourses || stats?.activeCourses || "0",
      icon: BookOpen,
      bgValues: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Upcoming Exams",
      value: stats?.data?.upcomingExams || stats?.upcomingExams || "0",
      icon: Calendar,
      bgValues: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
    },
    {
      title: "Total Events",
      value: stats?.data?.totalEvents || stats?.totalEvents || "0",
      icon: TrendingUp,
      bgValues: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto min-h-screen">
      
       {/* Removed Fixed background overlay as it was interfering with Dark Mode */}
       
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} variant="default" className="relative group overflow-hidden border-t-4 border-t-white/0 hover:border-t-primary-500 transition-all duration-300" noPadding animated={false}>
             <div className="p-6">
               <div className="flex justify-between items-start mb-4">
                 <div className={`p-4 rounded-2xl ${stat.bgValues}`}>
                   <stat.icon size={26} />
                 </div>
               </div>
               <div>
                 <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                 <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
               </div>
             </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
           <span className="w-1.5 h-6 bg-primary-600 rounded-full mr-3"></span>
           Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
              { path: "/users", title: "Manage Users", desc: "Add, edit, and manage accounts", icon: Users, color: "blue" },
              { path: "/exams", title: "Manage Exams", desc: "Create and schedule examinations", icon: Calendar, color: "emerald" },
              { path: "/syllabus", title: "Manage Syllabus", desc: "Upload course materials", icon: BookOpen, color: "purple" },
              { path: "/seating", title: "Seating Plans", desc: "Arrange examination seating", icon: MapPin, color: "orange" },
              { path: "/problem-inbox", title: "Problem Inbox", desc: "Resolve student issues", icon: Inbox, color: "teal" },
              { path: "/admin/clubs", title: "Manage Clubs", desc: "Oversee student organizations", icon: Users, color: "pink" },
          ].map((action, i) => (
             <Link key={i} to={action.path}>
               <Card variant="glass" hover className="h-full group cursor-pointer" animated={false}>
                 <div className="flex items-start space-x-5">
                   <div className={`p-3.5 rounded-2xl bg-${action.color}-50 dark:bg-${action.color}-900/20 transition-transform duration-300 group-hover:scale-110`}>
                     <action.icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                       {action.title}
                     </h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                       {action.desc}
                     </p>
                   </div>
                 </div>
               </Card>
             </Link>
          ))}
        </div>
      </div>

      {/* System & Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
           <Card title="Recent Activities" variant="default" className="h-full" animated={false}>
               <div className="space-y-3">
                {(stats?.data?.recentActivities || stats?.recentActivities)?.length > 0 ? (
                    (stats?.data?.recentActivities || stats?.recentActivities).map((activity, index) => (
                        <div key={index} className="flex items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 shrink-0">
                               <Settings size={16} className="text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{activity.message}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{activity.details}</p>
                            </div>
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                           <Trophy className="text-slate-300 dark:text-slate-600" size={32} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activities</p>
                    </div>
                )}
               </div>
           </Card>
        </div>

        {/* Pending Actions (Action Center) */}
        <div>
           <Card title="Action Center" variant="default" className="h-full" animated={false}>
              <div className="space-y-4">
                 {[
                     { 
                       label: "Pending Club Requests", 
                       count: stats?.data?.pendingActions?.clubs || 0,
                       icon: Users,
                       color: "pink",
                       link: "/admin/clubs"
                     },
                     { 
                       label: "Event Approvals", 
                       count: stats?.data?.pendingActions?.events || 0, 
                       icon: Trophy,
                       color: "purple",
                       link: "/events"
                     },
                     { 
                       label: "Notes Review", 
                       count: stats?.data?.pendingActions?.notes || 0, 
                       icon: BookOpen,
                       color: "blue",
                       link: "/admin/notes"
                     },
                     { 
                       label: "Open Issues", 
                       count: stats?.data?.pendingActions?.problems || 0, 
                       icon: Settings, // Using Settings as generic icon for issues/problems
                       color: "orange",
                       link: "/problem-inbox"
                     }
                 ].map((action, i) => (
                    <Link key={i} to={action.link} className="block">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                         <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 text-${action.color}-600 dark:text-${action.color}-400`}>
                              <action.icon size={18} />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {action.label}
                            </span>
                         </div>
                         <div className="flex items-center">
                            {action.count > 0 && (
                              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                            )}
                            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300`}>
                               {action.count}
                            </span>
                         </div>
                      </div>
                    </Link>
                 ))}
                 
                 <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                      Items requiring your immediate attention are marked with a red indicator.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
