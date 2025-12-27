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
  Sparkles,
} from "lucide-react";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import { useApi, useApiMutation } from "../../../hooks/useApi";
import { useAuth } from "../../../hooks/useAuth";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, loading } = useApi("/dashboard/student");
  const { mutate: getSuggestions, loading: suggestionsLoading } = useApiMutation();
  const [suggestions, setSuggestions] = React.useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper function to get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      exam: 'blue',
      event: 'purple',
      club: 'pink',
      seating: 'green',
      urgent: 'red',
      general: 'blue',
      college_announcement: 'blue',
      important_update: 'amber',
      official_notice: 'indigo',
    };
    return colors[category] || 'blue';
  };

  const handleGetSuggestions = async () => {
    const performanceData = {
        student_id: user._id || user.id, // Ensure we send the database ID
        // Backend will now fetch grades, attendance, and exam context
    };

    try {
        const result = await getSuggestions('post', '/ai/get-suggestions', performanceData);
        if (result.success) {
            console.log("AI Response:", result);
            // The API returns a structure with { study_recommendations: [], ... }
            // API response is result.data (which is the body), and inside that we might have 'data' key depending on controller
            // The API return structure is nested: 
            // Controller returns { success: true, data: PythonResponse }
            // PythonResponse is { success: true, data: EngineResult }
            // So we need result.data.data
            const pythonResponse = result.data;
            let engineResult = pythonResponse.data || pythonResponse; 
            
            // Fix for double nesting (Backend Wrapper -> Python Wrapper -> Data)
            if (engineResult.success && engineResult.data) {
                engineResult = engineResult.data;
            } 
            
            let recommendations = [];
            if (Array.isArray(engineResult)) {
                recommendations = engineResult;
            } else {
                recommendations = engineResult.study_recommendations || [];
            }
            
            if (engineResult.overall_suggestion) {
                recommendations.unshift(engineResult.overall_suggestion);
            }
            
            if (recommendations.length === 0) {
                 recommendations.push("Keep working hard! More data needed for personalized suggestions.");
            }
            
            setSuggestions(recommendations);
        } else {
            // Fallback for demo if API fails
            setSuggestions([
                "Focus on Data Structures for better performance in algorithms.",
                "Maintain your excellent attendance record.",
                "Consider joining the Coding Club to apply your skills."
            ]);
        }
    } catch (err) {
        console.error("AI API Error:", err);
        // Fallback for demo if API fails
        setSuggestions([
            "Focus on Data Structures for better performance in algorithms.",
            "Maintain your excellent attendance record.",
            "Consider joining the Coding Club to apply your skills (Fallback Mode)."
        ]);
    }
  };

  const quickActions = [
    {
      title: "Course Catalog",
      description: "Browse and enroll in new courses",
      icon: BookOpen,
      link: "/courses",
      color: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
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
  ];

  const stats = [
    {
      label: "Course Enrolled",
      value: user?.course || "Not Enrolled",
      icon: BookOpen,
      change: `Sem ${user?.semester || "-"}`,
    },
    {
      label: "Upcoming Exams",
      value: dashboardData?.data?.upcomingExams || 0,
      icon: Calendar,
      change:
        dashboardData?.data?.upcomingExams > 0 ? "Next exam soon" : "No exams",
    },
    {
      label: "Hall Tickets",
      value: dashboardData?.data?.hallTickets || 0,
      icon: FileText,
      change: "Available",
    },
    {
      label: "Events",
      value: dashboardData?.data?.recentEvents || 0,
      icon: Trophy,
      change: "Upcoming",
    },
  ];

  // Get dynamic upcoming exams
  const upcomingExamsList = dashboardData?.data?.upcomingExamsList || [];

  // Get dynamic announcements
  const recentAnnouncementsList = dashboardData?.data?.recentAnnouncementsList || [];



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 min-h-screen text-slate-800 dark:text-slate-100"
    >

      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 flex items-center">
              <TrendingUp className="mr-3 text-indigo-500" size={32} />
              Welcome Back! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Here's what's happening with your academics
            </p>
          </div>

        </div>
      </motion.div>

       {/* AI Advisor Section */}
       <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <TrendingUp className="mr-2" /> AI Academic Advisor
                </h3>
                <p className="text-indigo-100 mb-4 md:mb-0">
                    Get personalized suggestions based on your performance.
                </p>
            </div>
            <Button 
                onClick={handleGetSuggestions} 
                loading={suggestionsLoading}
                className="bg-white text-indigo-600 hover:bg-gray-100 border-none"
            >
                Get Suggestions
            </Button>
        </div>
        
        {suggestions && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
                <h4 className="font-semibold mb-2">Your PERSONALIZED Plan:</h4>
                <div className="space-y-3">
                    {Array.isArray(suggestions) ? (
                        suggestions.map((rec, index) => {
                            // Dynamic Styling based on content
                            const text = typeof rec === 'string' ? rec : JSON.stringify(rec);
                            let styleClass = "bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600";
                            let iconColor = "text-purple-600 dark:text-purple-400";
                            
                            if (text.includes("URGENT") || text.includes("Exam in") || text.includes("Assessment")) {
                                styleClass = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-sm";
                                iconColor = "text-red-500";
                            } else if (text.includes("Strategy")) {
                                styleClass = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-sm";
                                iconColor = "text-amber-500";
                            }

                            return (
                                <div
                                  key={index}
                                  className={`p-3 rounded-xl border flex gap-3 items-start ${styleClass} transition-all hover:scale-[1.01]`}
                                >
                                  <div className={`mt-0.5 ${iconColor}`}>
                                    <Sparkles size={16} />
                                  </div>
                                  <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                    {text}
                                  </p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-3 bg-white/50 rounded-xl">
                            <p className="text-gray-700">{typeof suggestions === 'string' ? suggestions : "See your detailed report."}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
       </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {typeof stat.value === 'object' ? JSON.stringify(stat.value) : stat.value}
                  </p>
                  <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center">
                     <TrendingUp size={12} className="mr-1" /> {stat.change}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${index === 0 ? 'from-blue-500 to-blue-600' : index === 1 ? 'from-purple-500 to-purple-600' : index === 2 ? 'from-pink-500 to-pink-600' : 'from-orange-500 to-orange-600'} shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h2>
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
                    className="glass-card p-6 h-full flex flex-col items-center text-center hover:bg-white/90 dark:hover:bg-slate-800/90 group cursor-pointer border border-white/20 dark:border-slate-700"
                  >
                    <div
                      className={`w-14 h-14 ${action.iconBg} dark:bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner`}
                    >
                      <Icon className={`h-7 w-7 ${action.iconColor} dark:text-opacity-90`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {action.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Upcoming Exams</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Don't miss your important dates</p>
          <div className="space-y-4">
            {upcomingExamsList.length > 0 ? (
              upcomingExamsList.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {exam.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{exam.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatDate(exam.date)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
                      <Clock size={12} /> {exam.startTime}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No upcoming exams</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">Hall tickets will appear here when issued</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Recent Announcements</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Stay updated with latest news</p>
          <div className="space-y-4">
            {recentAnnouncementsList.length > 0 ? (
              recentAnnouncementsList.map((announcement, index) => {
                const categoryColor = getCategoryColor(announcement.category);
                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      categoryColor === "blue"
                        ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-500"
                        : categoryColor === "green"
                        ? "bg-green-50/50 dark:bg-green-900/20 border-green-500"
                        : categoryColor === "purple"
                        ? "bg-purple-50/50 dark:bg-purple-900/20 border-purple-500"
                        : categoryColor === "pink"
                        ? "bg-pink-50/50 dark:bg-pink-900/20 border-pink-500"
                        : categoryColor === "red"
                        ? "bg-red-50/50 dark:bg-red-900/20 border-red-500"
                        : categoryColor === "amber"
                        ? "bg-amber-50/50 dark:bg-amber-900/20 border-amber-500"
                        : categoryColor === "indigo"
                        ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-500"
                        : "bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-500"
                    } backdrop-blur-sm hover:translate-x-1 transition-transform duration-300`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {announcement.title}
                        </p>
                        {announcement.category === "college_announcement" && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            College Announcement
                          </span>
                        )}
                        {announcement.category === "important_update" && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Sparkles size={10} /> Important Update
                          </span>
                        )}
                        {announcement.category === "official_notice" && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                            Official Warning
                          </span>
                        )}
                      </div>
                      {announcement.priority === "high" && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">Urgent</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {getRelativeTime(announcement.createdAt)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        By {announcement.createdBy}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No announcements yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">Check back later for updates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
