import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  X,
  Search,
  Filter
} from "lucide-react";
import { useApi, useApiMutation } from "../../../hooks/useApi";
import Button from "../../common/UI/Button";
import Card from "../../common/UI/Card";
import Modal from "../../common/UI/Modal";
import Input from "../../common/UI/Input";
import { toast } from "react-hot-toast";

const CATEGORIES = [
  { value: "college_announcement", label: "College Announcement", icon: Megaphone, color: "blue" },
  { value: "important_update", label: "Important College Update", icon: AlertTriangle, color: "amber" },
  { value: "official_notice", label: "Official College Notice", icon: FileText, color: "indigo" },
  { value: "gneral", label: "General", icon: Info, color: "slate" },
  { value: "exam", label: "Exam", icon: FileText, color: "red" },
  { value: "event", label: "Event", icon: Calendar, color: "purple" },
  { value: "club", label: "Club", icon: Users, color: "pink" },
];

const PRIORITIES = [
  { value: "normal", label: "Normal", color: "blue" },
  { value: "high", label: "High", color: "red" },
  { value: "low", label: "Low", color: "slate" },
];

const AdminAnnouncements = () => {
  const { data: announcementsData, loading, refetch } = useApi("/announcements");
  const { mutate, loading: submitting } = useApiMutation();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "college_announcement",
    priority: "normal",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await mutate("post", "/announcements", formData);
    if (result.success) {
      toast.success("Announcement published successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        content: "",
        category: "college_announcement",
        priority: "normal",
      });
      refetch();
    } else {
      toast.error(result.message || "Failed to publish announcement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      const result = await mutate("delete", `/announcements/${id}`);
      if (result.success) {
        toast.success("Announcement deleted");
        refetch();
      } else {
        toast.error("Failed to delete announcement");
      }
    }
  };

  const announcements = announcementsData?.data || [];

  const filteredAnnouncements = announcements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryConfig = (catValue) => {
    return CATEGORIES.find(c => c.value === catValue) || CATEGORIES[3]; // Default to general
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <Megaphone className="text-blue-500" />
            Announcements
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Broadcast updates to students and staff
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus size={20} />}>
          New Announcement
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search announcements..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={20} className="text-slate-400 shrink-0" />
                <button 
                    onClick={() => setFilterCategory("all")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === "all" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                >
                    All
                </button>
                {CATEGORIES.slice(0, 3).map(cat => (
                    <button 
                        key={cat.value}
                        onClick={() => setFilterCategory(cat.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === cat.value ? `bg-${cat.color}-100 text-${cat.color}-700 ring-2 ring-${cat.color}-500 ring-offset-2` : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
      </Card>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
             <div className="text-center py-12">
                 <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
             </div>
        ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => {
                const config = getCategoryConfig(announcement.category);
                const Icon = config.icon;
                return (
                    <motion.div 
                        key={announcement._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-5 border-l-4 hover:shadow-md transition-all group"
                        style={{ borderLeftColor: `var(--color-${config.color}-500)` }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-${config.color}-100 text-${config.color}-600 dark:bg-${config.color}-900/30 dark:text-${config.color}-400`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                            {announcement.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                            announcement.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {announcement.priority}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${config.color}-50 text-${config.color}-700 dark:bg-${config.color}-900/30 dark:text-${config.color}-300`}>
                                            {config.label}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                        {announcement.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                        <span>Posted by {announcement.createdBy?.name || "Admin"}</span>
                                        <span>•</span>
                                        <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDelete(announcement._id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Announcement"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                );
            })
        ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No announcements found</h3>
                <p className="text-slate-500">Create a new announcement to get started</p>
            </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Announcement"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Headline"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Annual Sports Day 2025"
                required
            />
            
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Content
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Enter the main announcement text..."
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {PRIORITIES.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" loading={submitting} className="flex-1">
                    Publish Announcement
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncements;
