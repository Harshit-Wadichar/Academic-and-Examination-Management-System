import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, LayoutDashboard, BookOpen, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useApi, useApiMutation } from '../../hooks/useApi';
import Card from '../common/UI/Card';
import Button from '../common/UI/Button';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const { mutate, loading } = useApiMutation();
  const { data: notesData, refetch } = useApi('/notes');

  const handleDelete = async (id) => {
      if(window.confirm('Are you sure you want to delete this note?')) {
          const result = await mutate('delete', `/notes/${id}`);
          if(result.success) {
              toast.success('Note deleted');
              refetch();
          }
      }
  }

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

  const stats = [
    {
      label: "Total Uploads",
      value: notesData?.data?.length || 0,
      icon: Upload,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-900",
    },
    {
      label: "Pending Approval",
      value: notesData?.data?.filter(n => n.status === 'pending')?.length || 0,
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-900",
    },
    {
      label: "Approved",
      value: notesData?.data?.filter(n => n.status === 'approved')?.length || 0,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-900",
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
                 Teacher Portal
              </h1>
              <p className="text-indigo-200 text-lg max-w-xl leading-relaxed">
                 Upload and manage course materials for your students.
              </p>
            </div>
            
            <div className="flex gap-3">
               <button 
                onClick={() => navigate('/exams')}
                className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2 group"
               >
                 Manage Exams
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
             </div>
          </div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form Link Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border-slate-200/60 dark:border-slate-700/60">
            <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg mr-3 text-indigo-600 dark:text-indigo-400">
                  <Upload size={22} />
              </div>
              Teacher Actions
            </h2>
            
            <div className="space-y-4">
                {/* Upload Material Section Removed */}

                 <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">Manage Syllabus</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Update and track syllabus progress for your courses.
                    </p>
                    <Button 
                        variant="outline"
                        onClick={() => navigate('/teacher/syllabus')}
                        className="w-full py-2.5 rounded-lg"
                    >
                        Go to Syllabus <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
          </Card>
        </div>

        {/* Notes List */}
        <div className="lg:col-span-8">
          <Card className="p-6 h-full shadow-lg border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <FileText size={22} className="mr-2 text-indigo-500" /> 
                    Uploaded Material
                </h2>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-semibold">
                    {notesData?.data?.length || 0} Files
                </span>
            </div>
            
            {notesData?.data?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                        <Upload size={32} className="text-indigo-300" />
                    </div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No notes uploaded yet</p>
                    <p className="text-sm mt-1">Upload your first course material to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notesData?.data?.map(note => (
                        <div key={note._id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-md transition-all duration-300">
                            <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{note.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700">
                                            {note.course}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700">
                                            {note.department}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700">
                                            Sem {note.semester}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                <div className="text-sm">
                                    <span className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
                                        note.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                        note.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                                        'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                    }`}>
                                        {note.status === 'approved' ? (
                                            <><CheckCircle size={12} className="mr-1.5" /> Approved</>
                                        ) : note.status === 'rejected' ? (
                                            <><AlertCircle size={12} className="mr-1.5" /> Rejected</>
                                        ) : (
                                            <><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span> Pending</>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 pl-4 border-l border-slate-100 dark:border-slate-700">
                                    <a 
                                        href={note.fileUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                        title="View PDF"
                                    >
                                        <Upload size={18} className="rotate-90" />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(note._id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Note"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard;
