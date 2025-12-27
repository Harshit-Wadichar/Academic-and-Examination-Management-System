import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, GraduationCap, Trophy, FileText, BookOpen, PenTool, Library, Star, Zap, Award, Bell, Settings, AlertCircle, Microscope, Beaker, Calculator, Palette, Globe, Code, Puzzle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/UI/Button';
import Input from '../components/common/UI/Input';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const from = '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);
    setError(''); // Clear previous errors
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // toast.success('Login successful!');
        setError('');
      } else {
        // Extract specific error message
        const errorMessage = result.error || 'Login failed. Please try again.';
        setError(errorMessage);
        // toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-main transition-colors duration-300">
      {/* Floating Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
          {/* Trophy - Left */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[5%] left-[5%] text-purple-600"
          >
            <Trophy size={28} />
          </motion.div>

          {/* Graduation Cap - Left Center */}
          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-[20%] left-[15%] text-indigo-600"
          >
            <GraduationCap size={32} />
          </motion.div>

          {/* File - Left Bottom */}
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[15%] left-[10%] text-blue-600"
          >
            <FileText size={24} />
          </motion.div>

          {/* Pen Tool - Top Right */}
          <motion.div
            animate={{ x: [0, 25, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-[10%] right-[20%] text-pink-500"
          >
             <PenTool size={26} />
          </motion.div>

          {/* Book Open - Top Center */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute top-[5%] left-[45%] text-indigo-600"
          >
            <BookOpen size={36} />
          </motion.div>

          {/* Library - Bottom Right */}
          <motion.div
             animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[20%] right-[15%] text-orange-500"
          >
             <Library size={30} />
          </motion.div>

          {/* Star - Right Center */}
          <motion.div
             animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute top-[50%] right-[10%] text-yellow-500"
          >
             <Star size={24} />
          </motion.div>

          {/* Zap - Top Right Corner */}
           <motion.div
            animate={{ scale: [1, 1.4, 1], rotate: [0, -20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[8%] right-[5%] text-purple-600"
          >
             <Zap size={28} />
          </motion.div>
          
           {/* Award - Bottom Left */}
           <motion.div
             animate={{ rotate: [0, 25, 0], y: [0, 15, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             className="absolute bottom-[10%] left-[8%] text-green-600"
           >
              <Award size={24} />
           </motion.div>

           {/* Globe - Top Right */}
           <motion.div
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-[15%] right-[30%] text-blue-500"
           >
              <Globe size={22} />
           </motion.div>

           {/* Code - Bottom Center Left */}
           <motion.div
             animate={{ scale: [1, 1.1, 1], x: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[25%] left-[35%] text-slate-500 dark:text-slate-400"
           >
              <Code size={26} />
           </motion.div>

           {/* Microscope - Bottom Center Right */}
           <motion.div
             animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
             transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
             className="absolute bottom-[30%] right-[35%] text-teal-500"
           >
              <Microscope size={24} />
           </motion.div>

           {/* Palette - Left Top */}
           <motion.div
             animate={{ rotate: [0, -20, 0], scale: [1, 1.2, 1] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
             className="absolute top-[25%] left-[5%] text-pink-500"
           >
              <Palette size={28} />
           </motion.div>

           {/* Calculator - Right Bottom */}
           <motion.div
             animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
             transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
             className="absolute bottom-[40%] right-[5%] text-orange-500"
           >
              <Calculator size={22} />
           </motion.div>

           {/* Puzzle - Top Left Center */}
           <motion.div
             animate={{ rotate: [0, 45, 0], scale: [1, 0.9, 1] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[12%] left-[30%] text-indigo-500"
           >
              <Puzzle size={20} />
           </motion.div>

           {/* Beaker - Bottom Right Center */}
           <motion.div
             animate={{ rotate: [0, -15, 0], y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
             className="absolute bottom-[8%] right-[40%] text-green-500"
           >
              <Beaker size={24} />
           </motion.div>

           {/* Large Background Settings */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 text-slate-200 dark:text-slate-800 opacity-20"
          >
             <Settings size={120} />
          </motion.div>
          

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="glass-card p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 mx-auto flex items-center justify-center mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-xl"
            >
              <GraduationCap className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight drop-shadow-sm flex items-center gap-1 justify-center mb-2">
              <span className="text-purple-600 dark:text-purple-600">Campus</span>
              <span className="text-blue-600 dark:text-blue-600">Mate</span>
            </h2>
            <p className="text-text-secondary">Sign in to access your dashboard</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="Ex. john@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-text-secondary">Remember me</label>
              </div>
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">Forgot password?</a>
            </div>

            {/* Error Message Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            <Button
              type="button"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="w-full py-3 text-lg shadow-lg hover:shadow-primary-500/25"
              onClick={handleSubmit}
            >
              Sign In <ArrowRight className="ml-2 w-4 h-4 inline" />
            </Button>
            
            <div className="text-center mt-8">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* Footer Copyright */}
      <div className="absolute bottom-4 text-center w-full">
         <p className="text-xs text-text-muted">© {new Date().getFullYear()} CampusMate. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;