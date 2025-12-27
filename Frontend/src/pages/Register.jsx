import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, BookOpen, Layers, Hash, ArrowRight, GraduationCap, Trophy, FileText, PenTool, Library, Star, Zap, Award, Bell, Settings, AlertCircle, Microscope, Beaker, Calculator, Palette, Globe, Code, Puzzle } from "lucide-react";
import { useApiMutation } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { API_ENDPOINTS } from "../utils/constants";
import Button from "../components/common/UI/Button";
import Input from "../components/common/UI/Input";
import { toast } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rollNumber: "",
    department: "",
    course: "",
    semester: "",
  });

  const { mutate, loading } = useApiMutation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError(''); // Clear previous errors

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      // toast.error(errorMsg);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      setError(errorMsg);
      // toast.error(errorMsg);
      return;
    }

    const { confirmPassword, ...submitData } = formData;

    try {
      const result = await mutate(
        "post",
        API_ENDPOINTS.AUTH.REGISTER,
        submitData
      );

      if (result.success) {
        setError('');
        const loginResult = await login({
          email: formData.email,
          password: formData.password,
        });
        if (loginResult.success) {
          // toast.success("Registration successful! Welcome!");
          navigate("/dashboard");
        } else {
          // toast.success("Registration successful! Please login.");
          navigate("/login");
        }
      } else {
        // Extract specific error message
        const errorMessage = result.error || "Registration failed. Please try again.";
        setError(errorMessage);
        // toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      // toast.error(errorMessage);
    }
  };

  const selectClasses = `
    w-full bg-white dark:bg-slate-800 
    text-slate-900 dark:text-white 
    placeholder-slate-400 
    border-2 border-slate-200 dark:border-slate-700
    rounded-xl py-2.5 pl-10 pr-4 
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
    appearance-none
  `;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-main transition-colors duration-300 py-6">
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
            className="absolute top-[20%] left-[12%] text-indigo-600"
          >
            <GraduationCap size={32} />
          </motion.div>

          {/* File - Left Bottom */}
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[12%] left-[8%] text-blue-600"
          >
            <FileText size={24} />
          </motion.div>

          {/* Pen Tool - Top Right */}
          <motion.div
            animate={{ x: [0, 25, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-[8%] right-[18%] text-pink-500"
          >
             <PenTool size={26} />
          </motion.div>

          {/* Book Open - Top Center */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute top-[3%] left-[48%] text-indigo-600"
          >
            <BookOpen size={36} />
          </motion.div>

          {/* Library - Bottom Right */}
          <motion.div
             animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[18%] right-[12%] text-orange-500"
          >
             <Library size={30} />
          </motion.div>

          {/* Star - Right Center */}
          <motion.div
             animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute top-[45%] right-[8%] text-yellow-500"
          >
             <Star size={24} />
          </motion.div>

          {/* Zap - Top Right Corner */}
           <motion.div
            animate={{ scale: [1, 1.4, 1], rotate: [0, -20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[6%] right-[4%] text-purple-600"
          >
             <Zap size={28} />
          </motion.div>
          
           {/* Award - Bottom Left */}
           <motion.div
             animate={{ rotate: [0, 25, 0], y: [0, 15, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             className="absolute bottom-[8%] left-[6%] text-green-600"
           >
              <Award size={24} />
           </motion.div>

           {/* Globe - Top Right */}
           <motion.div
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-[18%] right-[28%] text-blue-500"
           >
              <Globe size={22} />
           </motion.div>

           {/* Code - Bottom Center Left */}
           <motion.div
             animate={{ scale: [1, 1.1, 1], x: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[22%] left-[32%] text-slate-500 dark:text-slate-400"
           >
              <Code size={26} />
           </motion.div>

           {/* Microscope - Bottom Center Right */}
           <motion.div
             animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
             transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
             className="absolute bottom-[32%] right-[38%] text-teal-500"
           >
              <Microscope size={24} />
           </motion.div>

           {/* Palette - Left Top */}
           <motion.div
             animate={{ rotate: [0, -20, 0], scale: [1, 1.2, 1] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
             className="absolute top-[28%] left-[8%] text-pink-500"
           >
              <Palette size={28} />
           </motion.div>

           {/* Calculator - Right Bottom */}
           <motion.div
             animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
             transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
             className="absolute bottom-[38%] right-[8%] text-orange-500"
           >
              <Calculator size={22} />
           </motion.div>

           {/* Puzzle - Top Left Center */}
           <motion.div
             animate={{ rotate: [0, 45, 0], scale: [1, 0.9, 1] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[14%] left-[28%] text-indigo-500"
           >
              <Puzzle size={20} />
           </motion.div>

           {/* Beaker - Bottom Right Center */}
           <motion.div
             animate={{ rotate: [0, -15, 0], y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
             className="absolute bottom-[10%] right-[35%] text-green-500"
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
        className="w-full max-w-2xl z-10 px-4"
      >
        <div className="glass-card p-5 shadow-2xl">
          <div className="text-center mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-12 h-12 mx-auto flex items-center justify-center mb-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-xl"
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight drop-shadow-sm flex items-center gap-1 justify-center mb-2">
              <span className="text-purple-600 dark:text-purple-600">Campus</span>
              <span className="text-blue-600 dark:text-blue-600">Mate</span>
            </h2>
            <p className="text-text-secondary">Join the academic platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <Input
                label="Full Name"
                id="name"
                name="name"
                icon={User}
                placeholder="Ex. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="Ex. john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                icon={Lock}
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Input
                label="Roll Number"
                id="rollNumber"
                name="rollNumber"
                icon={Hash}
                placeholder="Ex. CS21001"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />

              {/* Course Select */}
              <div className="w-full">
                <label htmlFor="course" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                   Course
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 text-slate-400 h-5 w-5 pointer-events-none" />
                  <select
                    id="course"
                    name="course"
                    required
                    className={selectClasses}
                    value={formData.course}
                    onChange={handleChange}
                  >
                    <option value="" className="text-gray-500">Select Course</option>
                    <option value="B-Tech">B-Tech</option>
                    <option value="M-Tech">M-Tech</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="BBA">BBA</option>
                    <option value="BCA">BCA</option>
                  </select>
                </div>
              </div>

              {/* Department Select */}
              <div className="w-full">
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                   Department
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 text-slate-400 h-5 w-5 pointer-events-none" />
                  <select
                    id="department"
                    name="department"
                    required
                    className={selectClasses}
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="" className="text-gray-500">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>

              {/* Semester Select */}
              <div className="w-full">
                <label htmlFor="semester" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                   Semester
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 text-slate-400 h-5 w-5 pointer-events-none" />
                  <select
                    id="semester"
                    name="semester"
                    required
                    className={selectClasses}
                    value={formData.semester}
                    onChange={handleChange}
                  >
                    <option value="" className="text-gray-500">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem} Semester</option>
                    ))}
                  </select>
                </div>
              </div>
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
              className="w-full py-3 text-lg mt-4 shadow-lg hover:shadow-primary-500/25"
              onClick={handleSubmit}
            >
              Create Account <ArrowRight className="ml-2 w-4 h-4 inline" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in
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

export default Register;
