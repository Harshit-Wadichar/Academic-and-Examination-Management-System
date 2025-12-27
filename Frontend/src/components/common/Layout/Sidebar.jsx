import React, { useState, useEffect } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  FileText,
  Home,
  Inbox,
  LogOut,
  MapPin,
  Megaphone,
  Settings,
  Trophy,
  UserCheck,
  Users,
  ClipboardCheck
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { USER_ROLES } from "../../../utils/constants";
import Button from '../UI/Button';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMenuItems = () => {
    // ... (rest of the function is same)
    const commonItems = [
      { path: "/dashboard", icon: Home, label: "Dashboard" },
    ];

    switch (user?.role) {
      case USER_ROLES.STUDENT:
        return [
          ...commonItems,
          { path: "/syllabus", icon: BookOpen, label: "Syllabus" },
          { path: "/notes", icon: FileText, label: "Study Material" },
          { path: "/hall-ticket", icon: FileText, label: "Hall Ticket" },
          { path: "/seating", icon: MapPin, label: "Seating" },
          { path: "/events", icon: Trophy, label: "Events" },
          { path: "/student/clubs", icon: Users, label: "Clubs" },
          { path: "/problem-box", icon: Inbox, label: "Problem Box" },
        ];

      case USER_ROLES.TEACHER:
        return [
          ...commonItems,
          { path: "/teacher/syllabus", icon: BookOpen, label: "Syllabus Management" },
          { path: "/teacher/upload-notes", icon: FileText, label: "Upload Notes" },
          { path: "/exams", icon: Calendar, label: "Exam Management" },
        ];

      case USER_ROLES.ADMIN:
        return [
          ...commonItems,
          { path: "/users", icon: Users, label: "User Management" },
          { path: "/admin/announcements", icon: Megaphone, label: "Announcements" },
          { path: "/exams", icon: Calendar, label: "Exam Management" },
          { path: "/admin/notes", icon: FileText, label: "Notes Management" },
          { path: "/admin/clubs", icon: Trophy, label: "Club Approval" },
          { path: "/events", icon: Trophy, label: "Event Management" },
          { path: "/halls", icon: Settings, label: "Hall Management" },
          { path: "/admin/hall-tickets", icon: ClipboardCheck, label: "HT Approvals" },
          { path: "/problem-inbox", icon: Inbox, label: "Problem Inbox" },
        ];

      case USER_ROLES.SEATING_MANAGER:
        return [
          ...commonItems,
          { path: "/halls", icon: Settings, label: "Hall Management" },
          { path: "/seating", icon: MapPin, label: "Seating Management" },
          { path: "/problem-inbox", icon: Inbox, label: "Problem Inbox" },
        ];

      case USER_ROLES.CLUB_COORDINATOR:
        return [
          ...commonItems,
          { path: "/events", icon: Trophy, label: "Event Management" },
          { path: "/clubs", icon: Users, label: "Club Management" },
          { path: "/club-coordinator/join-requests", icon: UserCheck, label: "Join Requests" },
          { path: "/problem-inbox", icon: Inbox, label: "Problem Inbox" },
        ];

      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  const sidebarVariants = {
    open: isMobile ? { 
      x: 0,
      width: "18rem",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    } : { 
      x: 0,
      width: "18rem",
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: isMobile ? { 
      x: "-100%",
      width: "18rem",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    } : { 
      x: 0,
      width: "0rem",
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed lg:sticky top-0 h-screen z-50
          bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl 
          border-r border-slate-200 dark:border-slate-800 
          shadow-2xl lg:shadow-none
          flex flex-col overflow-hidden
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6">
          <Link to="/" className="flex items-center space-x-0 group">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden group-hover:shadow-primary-500/30 transition-shadow">
              <img src="/logo-two.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight group-hover:text-primary-600 transition-colors">CampusMate</span>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <motion.nav
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <LayoutGroup id="sidebar">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div key={item.path} variants={itemVariants}>
                    <Link
                      to={item.path}
                      onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                      }}
                      className={`
                        relative flex items-center px-4 py-3 mb-1 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden
                        ${isActive 
                          ? 'text-white shadow-lg shadow-primary-500/25' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl z-0"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            mass: 1
                          }}
                        />
                      )}
                      
                      <span className="relative z-10 flex items-center w-full">
                        <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </LayoutGroup>
          </motion.nav>
        </div>

        {/* Footer User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3 mb-3">
             <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden">
                {user?.profilePicture ? (
                   <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                   <span className="text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
                )}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
             </div>
          </div>
          <Button 
             variant="ghost" 
             size="sm" 
             className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
             onClick={logout}
             icon={<LogOut size={16} />}
          >
             Logout
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
