import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApi, useApiMutation } from '../hooks/useApi';
import Card from '../components/common/UI/Card';
import Button from '../components/common/UI/Button';
import Modal from '../components/common/UI/Modal';
import { API_ENDPOINTS } from '../utils/constants';
import { toast } from 'react-hot-toast';

const ExamManagement = () => {
  const { user } = useAuth();
  const { data: exams, loading, refetch } = useApi('/exams');
  const { mutate, loading: submitting } = useApiMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForIssue, setSelectedExamForIssue] = useState(null);
  const { data: usersData } = useApi(API_ENDPOINTS.USERS);
  const [ticketsForExam, setTicketsForExam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    totalMarks: '',
    hall: '',
    instructions: '',
    status: 'upcoming'
  });
  
  const [issueForm, setIssueForm] = useState({ studentId: '', hall: '', seatNumber: '', notes: '' });

  const handleCreateExam = async (e) => {
    e.preventDefault();
    const result = await mutate('post', '/exams', formData);
    if (result.success) {
      toast.success('Exam created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '', course: '', date: '', startTime: '', endTime: '',
        duration: '', totalMarks: '', hall: '', instructions: ''
      });
      refetch();
    } else {
      toast.error('Failed to create exam');
    }
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      course: exam.course,
      date: exam.date.split('T')[0],
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      hall: exam.hall,
      instructions: exam.instructions || '',
      status: exam.status || 'upcoming'
    });
    setShowEditModal(true);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const result = await mutate('put', `/exams/${selectedExam._id}`, formData);
    if (result.success) {
      toast.success('Exam updated successfully!');
      setShowEditModal(false);
      setSelectedExam(null);
      setFormData({
        title: '', course: '', date: '', startTime: '', endTime: '',
        duration: '', totalMarks: '', hall: '', instructions: ''
      });
      refetch();
    } else {
      toast.error('Failed to update exam');
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      const result = await mutate('delete', `/exams/${examId}`);
      if (result.success) {
        toast.success('Exam deleted successfully!');
        refetch();
      } else {
        toast.error('Failed to delete exam');
      }
    }
  };

  const handleOpenIssueModal = (exam) => {
    setSelectedExamForIssue(exam);
    setIssueForm({ studentId: '', hall: exam.hall || '', seatNumber: '', notes: '' });
    setShowIssueModal(true);
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueForm.studentId || !selectedExamForIssue?._id || !issueForm.hall) {
      toast.error('Please fill all required fields');
      return;
    }
    const payload = {
      studentId: issueForm.studentId,
      examId: selectedExamForIssue._id,
      hall: issueForm.hall,
      seatNumber: issueForm.seatNumber || undefined,
      notes: issueForm.notes || undefined,
    };
    const res = await mutate('post', `${API_ENDPOINTS.HALL_TICKETS}/issue`, payload);
    if (res.success) {
      toast.success('Hall ticket issued');
      setShowIssueModal(false);
    } else {
      toast.error(res.error || 'Failed to issue hall ticket');
    }
  };

  const handleViewTickets = async (exam) => {
    setSelectedExam(exam);
    const res = await mutate('get', `${API_ENDPOINTS.HALL_TICKETS}/exam/${exam._id}`);
    if (res.success) {
      setTicketsForExam(res.data.data || []);
      setShowTicketsModal(true);
    } else {
      toast.error(res.error || 'Failed to fetch hall tickets');
    }
  };

  const handleRevokeTicket = async (ticketId) => {
    if (!ticketId) return;
    const confirmed = window.confirm('Revoke this hall ticket?');
    if (!confirmed) return;
    const res = await mutate('patch', `${API_ENDPOINTS.HALL_TICKETS}/${ticketId}/revoke`);
    if (res.success) {
      toast.success('Hall ticket revoked');
      setTicketsForExam((prev) => prev.map(t => t._id === ticketId ? { ...t, status: 'revoked' } : t));
    } else {
      toast.error(res.error || 'Failed to revoke hall ticket');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredExams = Array.isArray(exams) ? exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Exam Management</h1>
          <p className="text-slate-600">Schedule and manage examinations</p>
        </div>
        {user?.role === 'admin' && (
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<Plus size={16} />}
            className="btn-primary"
          >
            Create Exam
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Exams List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-3xl"></div>
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
              <div className="glass-card p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{exam.title}</h3>
                      <p className="text-sm text-slate-600">{exam.course}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                    {exam.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar size={16} className="mr-2" />
                    {new Date(exam.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock size={16} className="mr-2" />
                    {exam.startTime} - {exam.endTime}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin size={16} className="mr-2" />
                    {exam.hall}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users size={16} className="mr-2" />
                    {exam.totalMarks} Marks
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditExam(exam)}
                      icon={<Edit size={14} />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteExam(exam._id)}
                      icon={<Trash2 size={14} />}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenIssueModal(exam)}
                    >
                      Issue Ticket
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewTickets(exam)}
                    >
                      View Tickets
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredExams.length === 0 && !loading && (
        <div className="glass-card p-8">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No exams found</h3>
            <p className="text-slate-600">
              {user?.role === 'admin' ? 'Create your first exam to get started.' : 'No exams scheduled yet.'}
            </p>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {user?.role === 'admin' && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Exam"
          size="lg"
        >
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Exam Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Mathematics Final Exam"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="180"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hall</label>
                <input
                  type="text"
                  name="hall"
                  value={formData.hall}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Hall A"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Enter exam instructions..."
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button type="submit" loading={submitting} className="flex-1 btn-primary">
                Create Exam
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Exam Modal */}
      {user?.role === 'admin' && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Exam"
          size="lg"
        >
          <form onSubmit={handleUpdateExam} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Exam Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Mathematics Final Exam"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="180"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hall</label>
                <input
                  type="text"
                  name="hall"
                  value={formData.hall}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Hall A"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Enter exam instructions..."
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button type="submit" loading={submitting} className="flex-1 btn-primary">
                Update Exam
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Issue Hall Ticket Modal (Admin) */}
      {user?.role === 'admin' && (
        <Modal
          isOpen={showIssueModal}
          onClose={() => setShowIssueModal(false)}
          title={`Issue Hall Ticket${selectedExamForIssue ? `: ${selectedExamForIssue.title}` : ''}`}
          size="md"
        >
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Student</label>
              <select
                value={issueForm.studentId}
                onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select student</option>
                {Array.isArray(usersData) && usersData
                  .filter(u => u.role === 'student')
                  .map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hall</label>
                <input
                  type="text"
                  value={issueForm.hall}
                  onChange={(e) => setIssueForm({ ...issueForm, hall: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Hall A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Seat Number (optional)</label>
                <input
                  type="text"
                  value={issueForm.seatNumber}
                  onChange={(e) => setIssueForm({ ...issueForm, seatNumber: e.target.value })}
                  className="input-field"
                  placeholder="A-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
              <textarea
                value={issueForm.notes}
                onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Any special note"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button type="submit" className="flex-1 btn-primary">Issue</Button>
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowIssueModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Tickets Modal (Admin) */}
      {user?.role === 'admin' && (
        <Modal
          isOpen={showTicketsModal}
          onClose={() => setShowTicketsModal(false)}
          title={`Issued Tickets${selectedExam ? `: ${selectedExam.title}` : ''}`}
          size="lg"
        >
          {ticketsForExam.length === 0 ? (
            <p className="text-slate-600">No tickets issued for this exam.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Hall</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Seat</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {ticketsForExam.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-sm text-slate-800">{t.student?.name}</td>
                      <td className="px-4 py-2 text-sm text-slate-800">{t.student?.email}</td>
                      <td className="px-4 py-2 text-sm text-slate-800">{t.hall}</td>
                      <td className="px-4 py-2 text-sm text-slate-800">{t.seatNumber || '-'}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {t.status === 'issued' ? (
                          <Button size="sm" variant="outline" onClick={() => handleRevokeTicket(t._id)} className="text-rose-600 hover:text-rose-700">Revoke</Button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}
    </motion.div>
  );
};

export default ExamManagement;