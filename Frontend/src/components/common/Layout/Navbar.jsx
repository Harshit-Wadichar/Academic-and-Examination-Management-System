import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Menu, Search, Settings, ChevronDown, Sun, Moon, FileText, Trophy, BookOpen, GraduationCap, PenTool, Library, Star, Zap, Award, Bookmark } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useApi, useApiMutation } from '../../../hooks/useApi';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../UI/Button';
import Input from '../UI/Input';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const { data: notifData, refetch: refetchNotifs } = useApi('/notifications');

  // Poll for notifications every 30 seconds
  useEffect(() => {
    if (notifData?.data) {
      setNotifications(notifData.data);
      setUnreadCount(notifData.data.filter(n => !n.read).length);
    }
  }, [notifData]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchNotifs();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const { mutate } = useApiMutation(); // Use mutation hook

  const markAllAsRead = async () => {
      try {
        // Optimistic update
        const updated = notifications.map(n => ({...n, read: true}));
        setNotifications(updated);
        setUnreadCount(0);
        
        // API call
        await mutate('put', '/notifications/mark-all-read');
        await refetchNotifs(); // Ensure sync
      } catch (error) {
        console.error("Failed to mark all as read", error);
        refetchNotifs(); // Revert on error
      }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 relative"
    >
      {/* Global Floating Background Icons */}
      {/* Global Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 overflow-hidden">
          {/* Trophy - Left */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 left-[5%] text-purple-600"
          >
            <Trophy size={24} />
          </motion.div>

          {/* Graduation Cap - Left Center */}
          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-8 left-[15%] text-indigo-600"
          >
            <GraduationCap size={28} />
          </motion.div>

          {/* File - Left Bottom */}
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-2 left-[25%] text-blue-600"
          >
            <FileText size={20} />
          </motion.div>

          {/* Pen Tool - Center Left */}
          <motion.div
            animate={{ x: [0, 25, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-3 left-[35%] text-pink-500"
          >
             <PenTool size={22} />
          </motion.div>

          {/* Book Open - Center */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute top-4 left-[45%] text-indigo-600"
          >
            <BookOpen size={32} />
          </motion.div>

          {/* Library - Center Right */}
          <motion.div
             animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-1 right-[40%] text-orange-500"
          >
             <Library size={26} />
          </motion.div>

          {/* Star - Right Center */}
          <motion.div
             animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute top-5 right-[30%] text-yellow-500"
          >
             <Star size={20} />
          </motion.div>

          {/* Settings - Right */}
          <motion.div
            animate={{ y: [0, -40, 0], rotate: [0, 45, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            className="absolute top-3 right-[20%] text-pink-500"
          >
             <Settings size={22} />
          </motion.div>

          {/* Bell - Bottom Right */}
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-3 right-[10%] text-orange-500"
          >
             <Bell size={18} />
          </motion.div>

          {/* Zap - Far Right */}
           <motion.div
            animate={{ scale: [1, 1.4, 1], rotate: [0, -20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 right-[2%] text-purple-600"
          >
             <Zap size={24} />
          </motion.div>
          
           {/* Award - Far Left */}
           <motion.div
             animate={{ rotate: [0, 25, 0], y: [0, 15, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             className="absolute bottom-4 left-[2%] text-green-600"
           >
              <Award size={20} />
           </motion.div>

           {/* Large Background Settings */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 text-slate-200 dark:text-slate-800 opacity-30"
          >
             <Settings size={100} />
          </motion.div>
          
           {/* Large Background Book */}
          <motion.div
            animate={{ rotate: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-16 left-[20%] text-slate-100 dark:text-slate-800 opacity-40"
          >
             <BookOpen size={120} />
          </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left Side: Mobile Menu + Mobile Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="lg:hidden ml-4 font-bold text-xl text-slate-900 dark:text-white">
              AcademicMS
            </Link>
          </div>

          {/* Center: Brand Text with Floating Elements */}
          <div className="hidden lg:flex justify-start mx-8 h-full items-center relative z-20">
            <h1 className="text-3xl font-black tracking-tight drop-shadow-sm flex items-center gap-1">
              <span className="text-purple-600 dark:text-purple-600">Campus</span>
              <span className="text-blue-600 dark:text-blue-600">Mate</span>
            </h1>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 ml-auto relative z-50">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-slate-100 dark:border-slate-800 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button onClick={markAllAsRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-[20rem] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                      ) : (
                        notifications.map((notif) => (
                           <div key={notif._id} className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
                              <p className="text-sm text-slate-800 dark:text-slate-200">{notif.message}</p>
                              <span className="text-xs text-slate-400 mt-1 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                           </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 pl-2"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-800 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500">
                   {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                      <span className="text-white font-medium">{user?.name?.charAt(0)}</span>
                   )}
                </div>
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-slate-100 dark:border-slate-800 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="font-medium text-slate-800 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link to="/profile" className="flex items-center w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <User size={16} className="mr-3" /> Profile
                      </Link>
                      <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                        <LogOut size={16} className="mr-3" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;