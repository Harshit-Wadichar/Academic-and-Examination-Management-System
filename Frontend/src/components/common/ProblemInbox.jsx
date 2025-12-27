import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, CheckCircle, Clock, AlertCircle, MessageSquare, Send, Filter } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useApiMutation } from "../../hooks/useApi";
import api from "../../services/api";
import Button from "./UI/Button";
import Card from "./UI/Card";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { toast } from "react-hot-toast";

const ProblemInbox = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState("");
  const { mutate, loading: responding } = useApiMutation();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/problems");
      setProblems(res.data.data || []);
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (problemId, newStatus) => {
    const result = await mutate("patch", `/problems/${problemId}/status`, { status: newStatus });
    if (result.success) {
      toast.success("Status updated");
      fetchProblems();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleRespond = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }
    const result = await mutate("patch", `/problems/${selectedProblem._id}/respond`, { response });
    if (result.success) {
      toast.success("Response sent successfully!");
      setShowResponseModal(false);
      setResponse("");
      setSelectedProblem(null);
      fetchProblems();
    } else {
      toast.error("Failed to send response");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="text-emerald-500" size={18} />;
      case "in_progress":
        return <Clock className="text-amber-500" size={18} />;
      default:
        return <AlertCircle className="text-blue-500" size={18} />;
    }
  };

  const getStatusBadge = (status) => {
      const styles = {
          resolved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
          in_progress: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
          open: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
      };
      
      return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 capitalize ${styles[status] || styles.open}`}>
            {getStatusIcon(status)}
            {status.replace("_", " ")}
        </span>
      );
  };

  const getCategoryBadge = (cat) => {
    const styles = {
        club: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
        seating: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
        default: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${styles[cat] || styles.default}`}>
            {cat}
        </span>
    );
  };

  const openProblems = problems.filter((p) => p.status !== "resolved");
  const resolvedProblems = problems.filter((p) => p.status === "resolved");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-xl shadow-orange-500/20 text-white">
               <Inbox size={28} />
            </div>
            <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Problem Inbox
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
                Manage and track student reports
            </p>
            </div>
        </div>
      </div>

      {/* Stats Cards - More distinct in light mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 shadow-sm dark:shadow-none" noPadding>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Open Issues</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{problems.filter(p => p.status === 'open').length}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                    <AlertCircle size={24} />
                </div>
            </div>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-amber-500 shadow-sm dark:shadow-none" noPadding>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{problems.filter(p => p.status === 'in_progress').length}</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                    <Clock size={24} />
                </div>
            </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500 shadow-sm dark:shadow-none" noPadding>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{resolvedProblems.length}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={24} />
                </div>
            </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Open Problems List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></span>
                    Active Problems
                </h3>
                <span className="text-sm font-semibold text-slate-600 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {openProblems.length} Pending
                </span>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : openProblems.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/50 p-12 text-center border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-3xl">
                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Caught Up!</h4>
                    <p className="text-slate-500 dark:text-slate-400">There are no open problems requiring your attention right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {openProblems.map((problem) => (
                        <motion.div
                            key={problem._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <Card className="bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 group border-l-4 border-l-blue-500 dark:border-l-blue-500 border-y border-r border-slate-200 dark:border-slate-800">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {getCategoryBadge(problem.category)}
                                            {getStatusBadge(problem.status)}
                                            <span className="text-xs text-slate-400 font-medium ml-auto md:ml-2 flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                                <Clock size={12} />
                                                {new Date(problem.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                {problem.description}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                Anonymous Student
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-row md:flex-col gap-3 justify-center md:border-l md:pl-6 md:border-slate-100 dark:md:border-slate-700/50 min-w-[140px]">
                                        {problem.status === "open" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleStatusChange(problem._id, "in_progress")}
                                                className="w-full justify-center whitespace-nowrap bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-slate-800"
                                            >
                                                Mark In Progress
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => {
                                                setSelectedProblem(problem);
                                                setShowResponseModal(true);
                                            }}
                                            icon={<MessageSquare size={14} />}
                                            className="w-full justify-center whitespace-nowrap shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
                                        >
                                            Respond
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
          </div>

          {/* Recently Resolved */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle size={22} className="text-emerald-500" />
                Recently Resolved
            </h3>
            
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-fit shadow-sm">
                {resolvedProblems.length > 0 ? (
                    <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
                        {resolvedProblems.slice(0, 5).map((problem) => (
                        <div key={problem._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default group">
                             <div className="flex items-start justify-between gap-3 mb-2">
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-100 dark:border-emerald-900/30">
                                    Resolved
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {new Date(problem.updatedAt || problem.createdAt).toLocaleDateString()}
                                </span>
                             </div>
                             <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 font-medium">
                                {problem.description}
                             </p>
                             {problem.adminResponse && (
                                 <div className="text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-500 italic border border-slate-100 dark:border-slate-700/50">
                                     <span className="font-semibold text-slate-400 not-italic mr-1">Reply:</span>
                                     {problem.adminResponse}
                                 </div>
                             )}
                        </div>
                        ))}
                        {resolvedProblems.length > 5 && (
                             <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                                 <button className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors">View All History</button>
                             </div>
                        )}
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        <p>No resolved problems yet.</p>
                    </div>
                )}
            </Card>
          </div>
      </div>

      {/* Response Modal */}
      <Modal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        title="Respond to Student"
      >
        {selectedProblem && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem Description</p>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedProblem.description}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={5}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-slate-400 resize-none shadow-sm"
                placeholder="Type your helpful response here..."
              />
              <p className="text-xs text-slate-400 mt-2 text-right">Visible to the student</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowResponseModal(false)}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRespond}
                loading={responding}
                className="flex-1 shadow-lg shadow-primary-500/20"
                icon={<Send size={16} />}
              >
                Send Response
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default ProblemInbox;
