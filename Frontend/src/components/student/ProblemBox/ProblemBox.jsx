import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Button from "../../common/UI/Button";
import Card from "../../common/UI/Card";
import { toast } from "react-hot-toast";

const ProblemBox = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [myProblems, setMyProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mutate, loading: submitting } = useApiMutation();

  useEffect(() => {
    fetchMyProblems();
  }, []);

  const fetchMyProblems = async () => {
    try {
      const response = await api.get("/problems");
      setMyProblems(response.data.data || []);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !category) {
      toast.error("Please fill all fields");
      return;
    }

    const result = await mutate("post", "/problems", { description, category });
    if (result.success) {
      toast.success("Problem submitted anonymously!");
      setDescription("");
      setCategory("");
      fetchMyProblems();
    } else {
      toast.error(result.error || "Failed to submit problem");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="text-green-500" size={18} />;
      case "in_progress":
        return <Clock className="text-yellow-500" size={18} />;
      default:
        return <AlertCircle className="text-blue-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "club":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "seating":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center mb-3">
             <MessageSquare className="mr-3 text-indigo-500" size={32} />
             Anonymous Problem Box
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
             Submit your concerns anonymously. Your identity will be kept private.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submit Problem Form */}
        <div className="lg:col-span-5">
           <Card className="p-6 sticky top-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg text-white">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  New Submission
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We value your feedback
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="club">🎭 Club Related</option>
                  <option value="seating">🪑 Seating Arrangement</option>
                  <option value="other">📋 Other / General</option>
                </select>
                <div className="mt-2 text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  {category === "club" ? "→ Will be reviewed by Club Coordinator" :
                   category === "seating" ? "→ Will be reviewed by Seating Manager" :
                   category === "other" ? "→ Will be reviewed by Admin" : 
                   "Select a category to see who reviews it"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Describe your problem *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="Describe your problem in detail... Your name will NOT be shared."
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-slate-500 text-right mt-1">
                  {description.length}/1000
                </p>
              </div>

              <Button
                type="submit"
                loading={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl shadow-lg shadow-purple-500/20"
                icon={<Send size={18} />}
              >
                Submit Anonymously
              </Button>
            </form>
          </Card>
        </div>

        {/* My Submitted Problems */}
        <div className="lg:col-span-7">
          <Card className="p-6 h-full shadow-lg border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center pb-4 border-b border-slate-100 dark:border-slate-700">
              <Clock className="mr-2 text-slate-400" size={20} />
              My History
            </h3>

            {loading ? (
              <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
              </div>
            ) : myProblems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <MessageSquare className="mx-auto mb-4 opacity-50" size={48} />
                <p className="font-medium">No problems submitted yet</p>
                <p className="text-sm mt-1">Your submission history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myProblems.map((problem) => (
                  <motion.div
                    key={problem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${getCategoryColor(problem.category)}`}>
                            {problem.category}
                          </span>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 border ${getStatusColor(problem.status)}`}>
                            {getStatusIcon(problem.status)}
                            {problem.status.replace("_", " ")}
                          </span>
                           <span className="text-xs text-slate-400 ml-auto block sm:hidden">
                            {new Date(problem.createdAt).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <p className="text-base text-gray-700 dark:text-slate-300 leading-relaxed">
                          {problem.description}
                        </p>
                        {problem.response && (
                          <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/50">
                            <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-semibold text-sm">
                                <CheckCircle size={14} /> Admin Response
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-300">
                              {problem.response}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-medium hidden sm:block">
                        {new Date(problem.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemBox;
