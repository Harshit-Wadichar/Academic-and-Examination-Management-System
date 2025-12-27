import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Users, CheckCircle } from 'lucide-react';
import { useApi, useApiMutation } from '../hooks/useApi';
import api from '../services/api';
import Card from '../components/common/UI/Card';
import Button from '../components/common/UI/Button';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const CourseCatalog = () => {
  const { user, login } = useAuth(); // login function might be needed to update user state if it holds enrolledCourses
  const { data: coursesData, loading, refetch } = useApi('/courses');
  const { mutate, loading: enrolling } = useApiMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(null);

  const courses = coursesData?.data || [];

  const handleEnroll = async (courseId) => {
    setEnrollLoading(courseId);
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      if (response.data.success) {
        toast.success('Successfully enrolled!');
        // Ideally we should update the user context here to reflect new enrollment 
        // For now, we force a window reload or rely on refetching if dashboard checks backend
         window.location.reload(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrollLoading(null);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEnrolled = (courseId) => {
    return user?.enrolledCourses?.includes(courseId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] opacity-20"></div>
           <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Course Catalog</h1>
          <p className="text-slate-600 dark:text-slate-400">Browse and enroll in available courses</p>
        </div>
        
        <div className="relative w-full md:w-96 glass rounded-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="glass-card h-full flex flex-col p-6 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors border border-white/20 dark:border-slate-700">
                <div className="p-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider">
                      {course.department}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {course.courseCode}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{course.courseName}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Clock size={16} className="mr-2 text-teal-500 dark:text-teal-400" />
                      <span>{course.credits} Credits</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Users size={16} className="mr-2 text-teal-500 dark:text-teal-400" />
                      <span>Semester {course.semester}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    {isEnrolled(course._id) ? (
                      <Button variant="outline" className="w-full cursor-default hover:bg-white dark:hover:bg-transparent text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
                        <CheckCircle size={16} className="mr-2" />
                        Enrolled
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(course._id)}
                        loading={enrollLoading === course._id}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30"
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </motion.div>
  );
};

export default CourseCatalog;
