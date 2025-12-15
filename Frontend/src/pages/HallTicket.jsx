import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Clock, MapPin, User, Hash, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApi, useApiMutation } from '../hooks/useApi';
import { API_ENDPOINTS } from '../utils/constants';
import Card from '../components/common/UI/Card';
import Button from '../components/common/UI/Button';
import { toast } from 'react-hot-toast';

const HallTicket = () => {
  const { user } = useAuth();
  const { data: exams, loading } = useApi(API_ENDPOINTS.EXAMS);
  const { data: myTickets, loading: myTicketsLoading, refetch: refetchTickets } = useApi(`${API_ENDPOINTS.HALL_TICKETS}/me`);
  const { mutate: mutateApi, loading: issuing } = useApiMutation();
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const hallTicketRef = useRef(null);

  const upcomingExams = Array.isArray(exams) ? exams.filter(exam => 
    exam.status === 'upcoming' || exam.status === 'ongoing'
  ) : [];

  const generateHallTicket = async (exam) => {
    // Check if required info is provided
    if (!user.rollNumber || !user.course) {
      toast.error('Please complete your profile with Roll Number and Course before generating hall ticket');
      return;
    }

    // Student must have issued ticket to preview/download
    try {
      const res = await mutateApi('get', `${API_ENDPOINTS.HALL_TICKETS}/exam/${exam._id}/me`);
      if (!res.success) {
        toast.error(res.error || 'Your hall ticket is not issued yet for this exam');
        return;
      }
    } catch (e) {
      toast.error('Your hall ticket is not issued yet for this exam');
      return;
    }

    setSelectedExam(exam);

    // If user is admin, optionally ensure a record for self (not typical in prod)
    if (user.role === 'admin') {
      const payload = {
        studentId: user.id || user._id,
        examId: exam._id,
        hall: exam.hall,
        seatNumber: undefined
      };
      const res = await mutateApi('post', `${API_ENDPOINTS.HALL_TICKETS}/issue`, payload);
      if (res.success) {
        refetchTickets();
      }
    }
  };

  const handlePreview = (ticket) => {
    setSelectedExam(ticket.exam);
    setSelectedTicket(ticket);
  };

  const handleDownload = (ticket) => {
    setSelectedExam(ticket.exam);
    setSelectedTicket(ticket);
    setTimeout(() => {
      downloadHallTicket();
    }, 100);
  };

  const downloadHallTicket = async () => {
    if (!selectedExam || !hallTicketRef.current) return;

    try {
      // Dynamic import for better performance
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // High-quality canvas capture with white background
      const canvas = await html2canvas(hallTicketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      // A4 calculations with margins
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 10; // mm
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // First page
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);

      // Additional pages if content overflows
      while (heightLeft > 0) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }

      pdf.save(`hall-ticket-${selectedExam.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      toast.success('Hall ticket downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient">Hall Ticket</h1>
        <p className="text-slate-600">Download your examination hall tickets</p>
      </div>

      {/* Profile Completion Warning */}
      {(!user.rollNumber || !user.course) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Complete Your Profile</h3>
              <p className="text-sm text-amber-700">
                Please add your Roll Number and Course in your profile to generate hall tickets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Student Info */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-slate-600">Name</p>
              <p className="font-semibold text-slate-800">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Hash className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-slate-600">Roll Number</p>
              <p className="font-semibold text-slate-800">{user.rollNumber || 'AMS' + (user._id || user.id || Date.now().toString()).slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-slate-600">Course</p>
              <p className="font-semibold text-slate-800">{user.course || user.department || 'Not Specified'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Exams */}
      {false && (<div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Available Hall Tickets</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-3xl"></div>
              </div>
            ))}
          </div>
        ) : upcomingExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingExams.map((exam, index) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass-card p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{exam.title}</h3>
                        <p className="text-sm text-slate-600">{exam.course}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      exam.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {exam.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
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
                  </div>

                  <Button
                    onClick={() => generateHallTicket(exam)}
                    icon={<Download size={16} />}
                    className="w-full btn-primary"
                    disabled={!user.rollNumber || !user.course}
                  >
                    {!user.rollNumber || !user.course ? 'Complete Profile First' : 'Generate Hall Ticket'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Hall Tickets Available</h3>
              <p className="text-slate-600">No upcoming exams found. Hall tickets will be available once exams are scheduled.</p>
            </div>
          </div>
        )}
      </div>)}

      {/* My Hall Tickets */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">My Hall Tickets</h2>
        {myTicketsLoading ? (
          <p className="text-slate-600">Loading...</p>
        ) : Array.isArray(myTickets?.data) && myTickets.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Exam</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Hall</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {myTickets.data.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-sm text-slate-800">{t.exam?.title}</td>
                    <td className="px-4 py-2 text-sm text-slate-800">{t.exam?.course}</td>
                    <td className="px-4 py-2 text-sm text-slate-800">{t.exam ? new Date(t.exam.date).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 text-sm text-slate-800">{t.exam ? `${t.exam.startTime} - ${t.exam.endTime}` : '-'}</td>
                    <td className="px-4 py-2 text-sm text-slate-800">{t.exam?.hall || t.hall}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {t.status === 'issued' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handlePreview(t)}>Preview</Button>
                          <Button size="sm" className="btn-primary" onClick={() => handleDownload(t)}>Download</Button>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600">No hall tickets found.</p>
        )}
      </div>

      {/* Hall Ticket Preview */}
      {selectedExam && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Hall Ticket Preview</h2>
            <Button
              onClick={downloadHallTicket}
              icon={<Download size={16} />}
              className="btn-primary"
            >
              Download
            </Button>
          </div>

          <div
            ref={hallTicketRef}
            className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg"
            style={{ width: '794px', margin: '0 auto' }}
          >
            {/* Watermark */}
            <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center" style={{ opacity: 0.05 }}>
              <div className="text-8xl font-extrabold tracking-widest">AMS</div>
            </div>

            <div className="p-8 relative">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 border-2 border-slate-300 rounded-md flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-700">AMS</span>
                  </div>
                  <div className="text-center">
                    <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">ACADEMIC MANAGEMENT SYSTEM</h1>
                    <p className="text-sm text-slate-600">Institution Name, City • Phone: 000-000-0000 • Email: info@example.com</p>
                  </div>
                </div>
                <div className="w-20 h-24 border-2 border-slate-300 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-500">Photo</span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="mt-6">
                <div className="w-full border-t-4 border-slate-800" />
                <div className="text-center py-2">
                  <span className="text-lg font-bold tracking-widest text-slate-800">HALL TICKET</span>
                </div>
                <div className="w-full border-b-2 border-slate-300" />
              </div>

              {/* Student Details */}
              <div className="mt-6 border border-slate-300 rounded-md">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                  <h3 className="font-semibold text-slate-800">Student Details</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Name</span>
                      <span className="font-medium text-slate-900">{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Roll Number</span>
                      <span className="font-medium text-slate-900">{user.rollNumber || 'AMS' + (user._id || user.id || Date.now().toString()).slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Department</span>
                      <span className="font-medium text-slate-900">{user.department || 'Not Specified'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Course</span>
                      <span className="font-medium text-slate-900">{user.course || 'Not Specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Semester</span>
                      <span className="font-medium text-slate-900">{user.semester || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hall Ticket ID</span>
                      <span className="font-medium text-slate-900">{`HT-${(user._id || user.id || 'USER').toString().slice(-4)}-${(selectedExam._id || 'EXAM').toString().slice(-4)}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Details */}
              <div className="mt-6 border border-slate-300 rounded-md">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                  <h3 className="font-semibold text-slate-800">Examination Details</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exam</span>
                      <span className="font-medium text-slate-900">{selectedExam.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subject</span>
                      <span className="font-medium text-slate-900">{selectedExam.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date</span>
                      <span className="font-medium text-slate-900">{new Date(selectedExam.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time</span>
                      <span className="font-medium text-slate-900">{selectedExam.startTime} - {selectedExam.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-medium text-slate-900">{selectedExam.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hall</span>
                      <span className="font-medium text-slate-900">{selectedTicket?.hall || selectedExam.hall}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Seat Number</span>
                      <span className="font-medium text-slate-900">{selectedTicket?.seatNumber || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 border border-slate-300 rounded-md">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                  <h3 className="font-semibold text-slate-800">Important Instructions</h3>
                </div>
                <div className="p-4 text-sm text-slate-700 space-y-2">
                  {selectedExam.instructions ? (
                    <p className="leading-relaxed">{selectedExam.instructions}</p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Reach the examination hall at least 15 minutes before the scheduled time.</li>
                      <li>Carry a valid student ID card along with this hall ticket.</li>
                      <li>Electronic gadgets and study materials are strictly prohibited.</li>
                      <li>Follow the instructions of the invigilator during the exam.</li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-between items-end">
                <div className="text-xs text-slate-500">Generated on: {new Date().toLocaleString()}</div>
                <div className="flex items-center space-x-12">
                  <div className="text-center">
                    <div className="w-40 border-t-2 border-slate-400" />
                    <span className="text-xs text-slate-600">Student Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="w-40 border-t-2 border-slate-400" />
                    <span className="text-xs text-slate-600">Controller of Examinations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HallTicket;