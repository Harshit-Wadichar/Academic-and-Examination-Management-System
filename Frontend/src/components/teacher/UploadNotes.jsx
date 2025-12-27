import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useApiMutation, useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/UI/Card';
import Button from '../common/UI/Button';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UploadNotes = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  
  // Initialize with user details if available
  const [formData, setFormData] = useState({
    title: '',
    course: user?.course || '',
    department: user?.department || '',
    semester: user?.semester || '1'
  });
  
  // Update form data if user data loads late
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        course: user.course || prev.course,
        department: user.department || prev.department,
        semester: user.semester || prev.semester
      }));
    }
  }, [user]);

  const { mutate, loading } = useApiMutation();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('course', formData.course);
    data.append('department', formData.department);
    data.append('semester', formData.semester);

    try {
      const result = await mutate('post', '/notes', data);

      if (result.success) {
        toast.success('Notes uploaded successfully!');
        setFile(null);
        setFormData({ ...formData, title: '' });
        document.getElementById('file-upload').value = null;
        // Optional: Redirect back to dashboard or show success state
        navigate('/teacher-dashboard');
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch (error) {
       console.error('Upload Error Details:', error.response?.data);
       toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Upload Material</h1>
        <p className="text-slate-500 dark:text-slate-400">Share course notes and documents with your students.</p>
      </div>

      <Card className="p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl mr-4 text-indigo-600 dark:text-indigo-400">
                <Upload size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Upload New Notes</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Fill in the details below</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              required
              placeholder="e.g., Unit 1 Lecture Notes"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Course 
                    {user?.course && <Lock size={12} className="inline ml-1 text-slate-400" />}
                </label>
                <select 
                    value={formData.course}
                    onChange={e => setFormData({...formData, course: e.target.value})}
                    className={`w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3 ${user?.course ? 'opacity-75 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
                    required
                    disabled={!!user?.course}
                >
                    <option value="">Select</option>
                    <option value="B-Tech">B-Tech</option>
                    <option value="M-Tech">M-Tech</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="BBA">BBA</option>
                    <option value="BCA">BCA</option>
                </select>
            </div>
            <div>
                 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Semester
                    {user?.semester && <Lock size={12} className="inline ml-1 text-slate-400" />}
                 </label>
                <select 
                    value={formData.semester}
                    onChange={e => setFormData({...formData, semester: e.target.value})}
                    className={`w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3 ${user?.semester ? 'opacity-75 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
                    required
                    disabled={!!user?.semester}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Sem {s}</option>
                    ))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Department
                {user?.department && <Lock size={12} className="inline ml-1 text-slate-400" />}
            </label>
            <select 
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              className={`w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3 ${user?.department ? 'opacity-75 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
              required
              disabled={!!user?.department}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Document (PDF)</label>
            <div className="relative group">
                <input 
                id="file-upload"
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-3 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-bold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer
                    bg-slate-50 dark:bg-slate-800/50
                    rounded-xl border border-slate-200 dark:border-slate-700
                    h-14
                "
                />
                {file && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                        <CheckCircle size={14} className="mr-1.5" /> Selected
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-400 mt-2 ml-1">Max size: 10MB • PDF format only</p>
          </div>

          <div className="pt-4 flex gap-4">
               <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/teacher-dashboard')}
                className="w-1/3 py-3 rounded-xl"
               >
                 Cancel
               </Button>
               <Button type="submit" loading={loading} className="flex-1 py-3 text-base rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                 Upload Notes <ArrowRight size={18} />
               </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default UploadNotes;
