import React from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Settings, 
  ArrowRight, 
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  Grid
} from "lucide-react";
import { useApi } from "../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const SeatingManagerDashboard = () => {
  const { data: dashboardData, loading } = useApi("/dashboard/seating-manager");
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
           <p className="text-slate-400 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Halls",
      value: dashboardData?.data?.totalHalls || 0,
      icon: MapPin,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-900",
      trend: "+2 new",
    },
    {
      label: "Upcoming Seatings",
      value: dashboardData?.data?.upcomingSeatings || 0,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-900",
      trend: "Next: tomorrow",
    },
    {
      label: "Recent Plans",
      value: dashboardData?.data?.recentArrangements || 0,
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-900", 
      trend: "Updated just now",
    },
    {
      label: "Capacity Usage",
      value: "85%", // Keeping hardcoded as placeholder if no API data
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-200 dark:border-orange-900",
      trend: "Optimal",
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-900 shadow-2xl shadow-indigo-500/20">
        <div className="absolute right-0 top-0 p-12 opacity-10 transform translate-x-12 -translate-y-12">
           <LayoutDashboard size={300} className="text-white" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-indigo-100 border border-white/10 uppercase tracking-wider">
                    Dashboard
                 </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                 Seating Manager
              </h1>
              <p className="text-indigo-200 text-lg max-w-xl leading-relaxed">
                 Overview of examination halls, active seating plans, and capacity metrics.
              </p>
            </div>
            
            <div className="flex gap-3">
               <button 
                onClick={() => navigate('/seating')}
                className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2 group"
               >
                 Go to Generator
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`group p-6 rounded-2xl bg-white dark:bg-slate-800 border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}
          >
             <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500 ${stat.color}`}>
                <stat.icon size={80} />
             </div>
             
             <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 text-xl shadow-inner`}>
                   <stat.icon size={24} />
                </div>
                
                <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1 uppercase tracking-wide">
                  {stat.label}
                </h3>
                <div className="flex items-end gap-2">
                   <span className="text-3xl font-black text-slate-800 dark:text-white">
                     {stat.value}
                   </span>
                   <span className="mb-1 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded">
                     {stat.trend}
                   </span>
                </div>
             </div>
          </div>
        ))}
      </motion.div>

      {/* Recent Activity / Content */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Arrangements List - Visual Only (Mock Data for Landing) */}
           <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                           <Clock size={20} />
                       </div>
                       <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                   </div>
                   <button onClick={() => navigate('/seating')} className="text-sm text-indigo-600 font-bold hover:text-indigo-700 hover:underline">View All</button>
               </div>
               
               <div className="p-6 space-y-4">
                   {[1, 2].map((_, i) => (
                       <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group cursor-pointer">
                           <div className={`mt-1 p-3 rounded-full ${i === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                               {i === 0 ? <CheckCircle size={18} /> : <Calendar size={18} />}
                           </div>
                           <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-slate-800 dark:text-white text-base">
                                      {i === 0 ? "Mathematics Final Exam" : "Physics Mid-term"}
                                  </h4>
                                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {i === 0 ? "Completed" : "In Progress"}
                                  </span>
                               </div>
                               <p className="text-slate-500 text-sm mt-1">
                                  Hall {i === 0 ? "A (Main Block)" : "B & C (Science Block)"} • {i === 0 ? "120" : "200"} Students
                               </p>
                               <p className="text-xs text-slate-400 mt-2 font-medium">
                                  {i === 0 ? "Generated 2 hours ago" : "Scheduled for tomorrow"}
                               </p>
                           </div>
                           <div className="self-center">
                               <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                           </div>
                       </div>
                   ))}
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-900/30 text-center">
                   <span className="text-xs text-slate-400 font-medium">Displaying recent 2 items</span>
               </div>
           </div>

           {/* Quick Actions Card */}
           <div className="lg:col-span-1">
               <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden h-full">
                   <div className="absolute top-0 right-0 p-8 opacity-20">
                       <Sparkles size={120} />
                   </div>
                   
                   <h3 className="text-xl font-bold mb-2 relative z-10">Quick Actions</h3>
                   <p className="text-indigo-100 text-sm mb-8 relative z-10 opacity-90">
                       Shortcuts to your most used tools.
                   </p>
                   
                   <div className="space-y-3 relative z-10">
                       <button 
                         onClick={() => navigate('/seating')}
                         className="w-full py-4 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all group text-left"
                       >
                           <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                               <Grid size={20} />
                           </div>
                           <div>
                               <span className="block font-bold">New Arrangement</span>
                               <span className="text-xs text-indigo-200">Create seating plan</span>
                           </div>
                           <ArrowRight size={16} className="ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
                       </button>

                        <button 
                          onClick={() => navigate('/halls')}
                          className="w-full py-4 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all group text-left"
                        >
                           <div className="p-2 bg-white rounded-lg text-pink-500 shadow-sm">
                               <MapPin size={20} />
                           </div>
                           <div>
                               <span className="block font-bold">Manage Halls</span>
                               <span className="text-xs text-indigo-200">Add or edit halls</span>
                           </div>
                           <ArrowRight size={16} className="ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
                       </button>
                   </div>
                   
                   <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">SM</div>
                           <div>
                               <p className="font-bold text-sm">Seating Manager</p>
                               <p className="text-xs text-indigo-200">Logged in</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
      </motion.div>
    </motion.div>
  );
};

export default SeatingManagerDashboard;
