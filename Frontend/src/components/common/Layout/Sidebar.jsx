import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Calendar, 
  Users, 
  MapPin, 
  Trophy,
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { USER_ROLES } from '../../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' }
    ];

    switch (user?.role) {
      case USER_ROLES.STUDENT:
        return [
          ...commonItems,
          { path: '/syllabus', icon: BookOpen, label: 'Syllabus' },
          { path: '/hall-ticket', icon: FileText, label: 'Hall Ticket' },
          { path: '/seating', icon: MapPin, label: 'Seating' },
          { path: '/events', icon: Trophy, label: 'Events' }
        ];
      
      case USER_ROLES.ADMIN:
        return [
          ...commonItems,
          { path: '/users', icon: Users, label: 'User Management' },
          { path: '/syllabus', icon: BookOpen, label: 'Syllabus Management' },
          { path: '/exams', icon: Calendar, label: 'Exam Management' }
        ];
      
      case USER_ROLES.SEATING_MANAGER:
        return [
          ...commonItems,
          { path: '/seating', icon: MapPin, label: 'Seating Management' },
          { path: '/halls', icon: Settings, label: 'Hall Management' }
        ];
      
      case USER_ROLES.CLUB_COORDINATOR:
        return [
          ...commonItems,
          { path: '/events', icon: Trophy, label: 'Event Management' },
          { path: '/clubs', icon: Users, label: 'Club Management' }
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-xl"></div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 relative z-10"
            >
              <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-indigo-600 font-bold text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl tracking-tight">AcademicMS</span>
                <span className="text-white/70 text-xs font-medium">Management System</span>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col pt-6 pb-6 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-xl shadow-indigo-500/25' 
                          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:shadow-lg hover:shadow-slate-200/50'
                        }
                      `}
                    >
                      <Icon 
                        className={`mr-4 h-5 w-5 transition-all duration-300 ${
                          isActive ? 'text-white drop-shadow-sm' : 'text-slate-400 group-hover:text-indigo-500'
                        } ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                      />
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 bg-white/80 rounded-full shadow-sm"
                        />
                      )}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="px-4 mt-auto">
              <div className="bg-gradient-to-r from-slate-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize truncate font-medium">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;