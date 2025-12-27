import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  FileText, 
  Grid, 
  Calendar, 
  Brain, 
  Shield, 
  ChevronRight, 
  Zap,
  Users
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 animate-fade-in-up">
            <Zap size={16} className="mr-2" />
            <span>Next Generation Academic Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Academic & Examination</span>
            <br />
            <span className="text-slate-800 dark:text-slate-100">Management System</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed">
            Streamline your institution's workflow with our comprehensive platform for syllabus tracking, exam scheduling, and intelligent insights.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center"
            >
              Get Started
              <ChevronRight size={20} className="ml-2" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center"
            >
              <Users size={20} className="mr-2" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A powerful suite of tools designed to modernize educational administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen size={32} className="text-blue-500" />}
              title="Syllabus Management"
              description="Access and manage course syllabuswith AI-powered mind maps for structured learning."
              color="bg-blue-500/10"
            />
            <FeatureCard 
              icon={<FileText size={32} className="text-green-500" />}
              title="Hall Ticket Generation"
              description="Instantly generate and download secure hall tickets for upcoming examinations."
              color="bg-green-500/10"
            />
            <FeatureCard 
              icon={<Grid size={32} className="text-purple-500" />}
              title="Seating Arrangement"
              description="Automated, conflict-free seating arrangements for fair and organized exams."
              color="bg-purple-500/10"
            />
            <FeatureCard 
              icon={<Calendar size={32} className="text-yellow-500" />}
              title="Event Management"
              description="Seamlessly organize and manage college events, clubs, and extracurricular activities."
              color="bg-yellow-500/10"
            />
            <FeatureCard 
              icon={<Brain size={32} className="text-red-500" />}
              title="AI-Powered Insights"
              description="Leverage artificial intelligence for personalized learning suggestions and analytics."
              color="bg-red-500/10"
            />
            <FeatureCard 
              icon={<Shield size={32} className="text-indigo-500" />}
              title="Role-Based Access"
              description="Secure, granular access controls ensures data privacy for students and staff."
              color="bg-indigo-500/10"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Academic & Examination Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="group p-8 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default Home;
