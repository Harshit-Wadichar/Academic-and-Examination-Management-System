import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  User
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApi, useApiMutation } from "../hooks/useApi";
import api from "../services/api";
import Card from "../components/common/UI/Card";
import Button from "../components/common/UI/Button";
import Modal from "../components/common/UI/Modal";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../utils/constants";

const SEMESTER_SUBJECTS = {
  1: ["Engineering Mathematics-I", "Engineering Physics", "Basics of Civil & Mech", "Engineering Mechanics", "Basic Electronics"],
  2: ["Engineering Mathematics-II", "Engineering Chemistry", "Computer Programming", "Engineering Drawing", "Environmental Studies"],
  3: ["Data Structures", "Digital Logic Design", "Discrete Mathematics", "Object Oriented Programming", "Electronic Devices"],
  4: ["Algorithms", "Operating Systems", "Computer Organization", "Database Management Systems", "Theory of Computation"],
  5: ["Computer Networks", "Software Engineering", "Web Technologies", "Microprocessors", "Formal Languages"],
  6: ["Compiler Design", "Cloud Computing", "Artificial Intelligence", "Computer Graphics", "Information Security"],
  7: ["Machine Learning", "Big Data Analytics", "Internet of Things", "Mobile Computing", "Network Security"],
  8: ["Project Work", "Distributed Systems", "Natural Language Processing", "Human Computer Interaction", "Professional Ethics"]
};

const ExamManagement = () => {
  const { user } = useAuth();
  const { data: exams, loading, refetch } = useApi("/exams");
  const { data: hallsData } = useApi("/halls");
  const { mutate, loading: submitting } = useApiMutation();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForIssue, setSelectedExamForIssue] = useState(null);
  const [ticketsForExam, setTicketsForExam] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    title: "",
    course: "", // Now represents Subject
    semester: "", 
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    totalMarks: "",
    hall: "",
    instructions: "",
    status: "upcoming",
  });

  const [issueForm, setIssueForm] = useState({
    studentId: "",
    hall: "",
    seatNumber: "",
    notes: "",
  });

  const calculateDuration = (start, end) => {
    if (!start || !end) return "";
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    
    const startDate = new Date(0, 0, 0, startHours, startMinutes);
    const endDate = new Date(0, 0, 0, endHours, endMinutes);
    
    let diff = (endDate - startDate) / (1000 * 60);
    return diff;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Auto calculate duration
    if (name === "startTime" || name === "endTime") {
       const start = name === "startTime" ? value : formData.startTime;
       const end = name === "endTime" ? value : formData.endTime;
       
       if (start && end) {
           const duration = calculateDuration(start, end);
           if (duration !== "" && duration <= 0) {
               toast.error("End time must be after Start time");
               newFormData.duration = "";
           } else if (duration > 0) {
               newFormData.duration = duration;
           }
       }
    }

    setFormData(newFormData);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    const result = await mutate("post", "/exams", formData);
    if (result.success) {
      toast.success("Exam created successfully!");
      setShowCreateModal(false);
      resetForm();
      refetch();
    } else {
      toast.error(result.error || "Failed to create exam");
    }
  };

  const resetForm = () => {
    setFormData({
        title: "",
        course: "",
        semester: "",
        date: "",
        startTime: "",
        endTime: "",
        duration: "",
        totalMarks: "",
        hall: "",
        instructions: "",
        status: "upcoming"
      });
  }

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      course: exam.course,
      semester: exam.semester || "",
      date: exam.date.split("T")[0],
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      hall: exam.hall,
      instructions: exam.instructions || "",
      status: exam.status || "upcoming",
    });
    setShowEditModal(true);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const result = await mutate("put", `/exams/${selectedExam._id}`, formData);
    if (result.success) {
      toast.success("Exam updated successfully!");
      setShowEditModal(false);
      setSelectedExam(null);
      resetForm();
      refetch();
    } else {
      toast.error(result.error || "Failed to update exam");
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      const result = await mutate("delete", `/exams/${examId}`);
      if (result.success) {
        toast.success("Exam deleted successfully!");
        refetch();
      } else {
        toast.error("Failed to delete exam");
      }
    }
  };

  const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
          const response = await api.get("/users");
          const students = (response.data.data || []).filter(u => u.role === "student");
          setAllStudents(students);
      } catch (err) {
          console.error("Failed to fetch students", err);
          toast.error("Failed to load student list");
      } finally {
          setLoadingStudents(false);
      }
  };

  const handleOpenIssueModal = (exam) => {
    setSelectedExamForIssue(exam);
    setIssueForm({
      studentId: "",
      hall: exam.hall || "",
      seatNumber: "",
      notes: "",
    });
    fetchStudents(); // Load students when modal opens
    setShowIssueModal(true);
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueForm.studentId || !selectedExamForIssue?._id || !issueForm.hall) {
      toast.error("Please fill all required fields");
      return;
    }
    const payload = {
      studentId: issueForm.studentId,
      examId: selectedExamForIssue._id,
      hall: issueForm.hall,
      seatNumber: issueForm.seatNumber || undefined,
      notes: issueForm.notes || undefined,
    };
    const res = await mutate(
      "post",
      `${API_ENDPOINTS.HALL_TICKETS}/issue`,
      payload
    );
    if (res.success) {
      toast.success(res.message || "Hall ticket issued");
      setShowIssueModal(false);
    } else {
      toast.error(res.error || "Failed to issue hall ticket");
    }
  };

  const handleViewTickets = async (exam) => {
    setSelectedExam(exam);
    const res = await mutate(
      "get",
      `${API_ENDPOINTS.HALL_TICKETS}/exam/${exam._id}`
    );
    if (res.success) {
      setTicketsForExam(res.data.data || []);
      setShowTicketsModal(true);
    } else {
      toast.error(res.error || "Failed to fetch hall tickets");
    }
  };

  const filteredExams = Array.isArray(exams?.data)
    ? exams.data.filter((exam) => {
        const matchesSearch =
          exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "ongoing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-slate-700";
    }
  };

  // Filter students compatible with the exam (by semester if available)
  const compatibleStudents = allStudents.filter(student => {
     if (!selectedExamForIssue?.semester) return true; // Show all if exam has no semester logic
     return student.semester === undefined || String(student.semester) === String(selectedExamForIssue.semester);
  });

  const inputClass = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400";
  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8 max-w-7xl mx-auto min-h-screen"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] opacity-20"></div>
           <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Exam Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage exams
          </p>
        </div>
        {user?.role === "admin" && (
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<Plus size={18} />}
            className="shadow-lg shadow-primary-500/20"
          >
            Create Exam
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card variant="glass" className="border border-white/20 dark:border-slate-700 p-2" noPadding>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 text-lg"
            />
          </div>
          <div className="md:border-l md:border-slate-200 dark:md:border-slate-700/50 md:pl-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Exams List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/40 dark:border-slate-700 flex flex-col justify-between group">
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Calendar size={24} />
                        </div>
                        <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusBadgeClass(
                            exam.status
                            )}`}
                        >
                            {exam.status}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                        {exam.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                        {exam.course}
                    </p>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                            <div className="w-8 flex justify-center"><Calendar size={18} className="text-slate-400" /></div>
                            {new Date(exam.date).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                             <div className="w-8 flex justify-center"><Clock size={18} className="text-slate-400" /></div>
                            {exam.startTime} - {exam.endTime} ({exam.duration}m)
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                             <div className="w-8 flex justify-center"><MapPin size={18} className="text-slate-400" /></div>
                            {exam.hall}
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                             <div className="w-8 flex justify-center"><Users size={18} className="text-slate-400" /></div>
                            Total Marks: {exam.totalMarks}
                        </div>
                    </div>
                </div>

                {['admin', 'teacher'].includes(user?.role) && (
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    {user?.role === "admin" && (
                        <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEditExam(exam)}
                              icon={<Edit size={14} />}
                              className="bg-white dark:bg-transparent"
                            >
                              Edit
                            </Button>
                             <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewTickets(exam)}
                              className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              Tickets
                            </Button>
                        </>
                    )}
                     <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenIssueModal(exam)}
                      className={`col-span-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/20 ${user?.role !== 'admin' ? 'col-span-2 w-full' : ''}`}
                    >
                      Issue Ticket
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredExams.length === 0 && !loading && (
        <Card>
           <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No exams found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {user?.role === "admin"
                ? "Schedule your first exam to get students started."
                : "No exams are currently scheduled."}
            </p>
             {user?.role === "admin" && (
                <Button onClick={() => setShowCreateModal(true)} className="mt-6">
                    Schedule Exam
                </Button>
            )}
          </div>
        </Card>
      )}

      {/* Create/Edit Exam Modal */}
      {user?.role === "admin" && (
        <Modal
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
          }}
          title={showEditModal ? "Edit Exam" : "Schedule New Exam"}
          size="lg"
        >
          <form onSubmit={showEditModal ? handleUpdateExam : handleCreateExam} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2">
                <label className={labelClass}>Exam Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. End Semester Examination 2024"
                />
              </div>

               <div>
                <label className={labelClass}>Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={(e) => {
                      setFormData({ ...formData, semester: e.target.value, course: "" });
                  }}
                  required
                  className={inputClass}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Subject</label>
                <select
                  name="course" 
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className={`${inputClass} disabled:opacity-50`}
                  disabled={!formData.semester}
                >
                  <option value="">
                    {formData.semester ? "Select Subject" : "Select Semester first"}
                  </option>
                  {formData.semester && SEMESTER_SUBJECTS[formData.semester]?.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {showEditModal && (
                   <div>
                    <label className={labelClass}>
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className={inputClass}
                    >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                    </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Duration (mins)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. 180"
                />
              </div>

              <div>
                <label className={labelClass}>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. 100"
                />
              </div>

              <div>
                <label className={labelClass}>Hall</label>
                <select
                  name="hall"
                  value={formData.hall}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                   <option value="">Select Hall</option>
                   {hallsData?.data?.map((hall) => (
                       <option key={hall._id} value={hall.name}>
                           {hall.name} (Cap: {hall.capacity})
                       </option>
                   ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Enter special instructions for candidates..."
              />
            </div>

            <div className="flex space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
               <Button
                type="button"
                variant="secondary"
                onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                className="flex-1 shadow-lg shadow-primary-500/20"
              >
                {showEditModal ? "Update Exam" : "Schedule Exam"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Issue Ticket Modal */}
      {['admin', 'teacher'].includes(user?.role) && (
        <Modal
          isOpen={showIssueModal}
          onClose={() => setShowIssueModal(false)}
          title="Issue Hall Ticket"
        >
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">
                Exam: {selectedExamForIssue?.title}
              </h4>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Hall: {selectedExamForIssue?.hall}
              </p>
              {selectedExamForIssue?.semester && (
                   <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Filtering students for Semester {selectedExamForIssue?.semester}
                  </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className={labelClass}>
                        Select Student
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={issueForm.studentId}
                            onChange={(e) => {
                                const student = allStudents.find(s => s._id === e.target.value);
                                setIssueForm({ 
                                    ...issueForm, 
                                    studentId: e.target.value,
                                    // Auto-fill roll number helper logic if needed, though we display it separately
                                });
                            }}
                            className={`${inputClass} pl-10`}
                            required
                            disabled={loadingStudents}
                        >
                            <option value="">
                                {loadingStudents ? "Loading students..." : "Select a student..."}
                            </option>
                            {compatibleStudents.map(student => (
                                <option key={student._id} value={student._id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                     {compatibleStudents.length === 0 && !loadingStudents && (
                        <p className="text-xs text-red-500 mt-1">No eligible students found for this semester.</p>
                    )}
                </div>

                <div>
                     <label className={labelClass}>
                        Student Roll No.
                    </label>
                    <input
                        type="text"
                        value={allStudents.find(s => s._id === issueForm.studentId)?.rollNumber || "N/A"}
                        readOnly
                        className={`${inputClass} bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed`}
                    />
                </div>

                <div>
                     <label className={labelClass}>
                        Hall Name
                    </label>
                    <input
                        type="text"
                        value={issueForm.hall}
                        readOnly
                        className={`${inputClass} bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed`}
                    />
                </div>
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={issueForm.notes}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, notes: e.target.value })
                }
                rows={2}
                className={inputClass}
                placeholder="Any special remarks..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowIssueModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!issueForm.studentId}>Issue Ticket</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Tickets Modal */}
      {user?.role === "admin" && (
        <Modal
          isOpen={showTicketsModal}
          onClose={() => setShowTicketsModal(false)}
          title={`Hall Tickets: ${selectedExam?.title}`}
          size="lg"
        >
          <div className="space-y-4">
            {ticketsForExam.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No tickets issued for this exam yet.
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-500 dark:text-slate-400 uppercase text-xs sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Student ID</th>
                      <th className="px-4 py-3">Hall</th>
                      <th className="px-4 py-3">Seat</th>
                      <th className="px-4 py-3">Issued Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {ticketsForExam.map((ticket, i) => (
                      <tr key={ticket._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {ticket.student?.rollNumber || ticket.studentId}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {ticket.hall}
                        </td>
                         <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono">
                          {ticket.seatNumber}
                        </td>
                         <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
             <div className="flex justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowTicketsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default ExamManagement;
