const HallTicket = require('../models/HallTicket');
const Exam = require('../models/Exam');
const User = require('../models/User');

// Issue a hall ticket for a student and an exam (Admin or Teacher)
// POST /api/halltickets/issue
const issueHallTicket = async (req, res) => {
  try {
    const { studentId, examId, hall, seatNumber, notes } = req.body;

    // Role check: Only Admin and Teacher can issue
    if (!['admin', 'teacher'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Access denied. Only Admins and Teachers can issue hall tickets.' });
    }

    if (!studentId || !examId || !hall) {
      return res.status(400).json({ success: false, message: 'studentId, examId and hall are required' });
    }

    const [student, exam] = await Promise.all([
      User.findById(studentId),
      Exam.findById(examId)
    ]);

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    // Validate Semester Logic
    if (exam.semester && student.semester && exam.semester.toString() !== student.semester.toString()) {
         return res.status(400).json({ 
             success: false, 
             message: `Cannot issue ticket. Student is in Semester ${student.semester} but Exam is for Semester ${exam.semester}.` 
         });
    }

    // Determine Approval Status
    const isTeacher = req.user.role === 'teacher';
    const approvalStatus = isTeacher ? 'pending' : 'approved';
    const approvedBy = isTeacher ? undefined : req.user._id;
    const approvedAt = isTeacher ? new Date() : new Date(); // Wait, if pending, approvedAt should be null. If approved, now.
    
    // Correction:
    // If teacher: pending, approvedBy=null, approvedAt=null
    // If admin: approved, approvedBy=adminId, approvedAt=now

    const ticketData = {
        student: studentId,
        exam: examId,
        hall,
        seatNumber,
        notes,
        status: 'issued', // Lifecycle status
        approvalStatus: approvalStatus,
        isActive: true, // Only show if approved? No, isActive controls revocation. Visibility controlled by approvalStatus.
        issuedAt: new Date()
    };
    
    if (!isTeacher) {
        ticketData.approvedBy = req.user._id;
        ticketData.approvedAt = new Date();
    }

    // Create or upsert ticket (unique index on {student, exam})
    const ticket = await HallTicket.findOneAndUpdate(
      { student: studentId, exam: examId },
      ticketData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Create Notification
    // If Admin approved immediately: notify student "Hall Ticket Issued"
    // If Teacher issued (pending): notify student? NO. Student should not know yet.
    // Notify Admin? Maybe.
    // Let's stick to notifying student ONLY if approved.
    
    if (approvalStatus === 'approved') {
        const Notification = require('../models/Notification');
        await Notification.create({
            user: studentId,
            message: `Hall Ticket issued for ${exam.title || 'your exam'}. Seat: ${seatNumber}, Hall: ${hall}.`,
            type: 'success'
        });
    }

    const message = isTeacher 
        ? 'Hall ticket issued and sent for approval' 
        : 'Hall ticket issued and notification sent';

    return res.status(201).json({ success: true, message, data: ticket });
  } catch (error) {
    console.error('issueHallTicket error:', error);
    return res.status(500).json({ success: false, message: 'Failed to issue hall ticket' });
  }
};

// Update Hall Ticket Approval Status (Admin only)
// PUT /api/halltickets/:id/status
const updateHallTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body; // status: 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be approved or rejected.' });
        }

        const ticket = await HallTicket.findById(id).populate('exam').populate('student');
        if (!ticket) return res.status(404).json({ success: false, message: 'Hall ticket not found' });

        ticket.approvalStatus = status;
        
        if (status === 'approved') {
            ticket.approvedBy = req.user._id;
            ticket.approvedAt = new Date();
            ticket.rejectionReason = undefined;

            // Notify Student
             const Notification = require('../models/Notification');
             await Notification.create({
                user: ticket.student._id,
                message: `Your Hall Ticket for ${ticket.exam.title} has been APPROVED. Seat: ${ticket.seatNumber}, Hall: ${ticket.hall}.`,
                type: 'success'
            });

        } else if (status === 'rejected') {
            ticket.rejectionReason = rejectionReason;
            ticket.approvedBy = req.user._id; // Track who rejected
            // approvedAt can serve as "decisionAt" or leave null? 
            // Model says "approvedAt". Let's assume it implies "decisionAt" or just leave it for approval.
            // Let's leave approvedAt null for rejection to distinction.
            
            // Notify Teacher? Use system doesn't seem to track issuer?
            // Actually we don't track who ISSUED it (created info is just timestamps or audit logs usually).
            // We can add `issuedBy` to model if needed, but not requested.
        }

        await ticket.save();

        return res.json({ success: true, message: `Hall ticket ${status}`, data: ticket });

    } catch (error) {
        console.error('updateHallTicketStatus error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update hall ticket status' });
    }
};

// Get hall tickets for current logged-in student
// GET /api/halltickets/me
const getMyHallTickets = async (req, res) => {
  try {
    const tickets = await HallTicket.find({ 
      student: req.user._id || req.user.id, 
      isActive: true,
      approvalStatus: 'approved' // Only show approved tickets to students
    })
      .populate('exam', 'title course date startTime endTime duration totalMarks hall status')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: tickets });
  } catch (error) {
    console.error('getMyHallTickets error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch hall tickets' });
  }
};

// Get all hall tickets (Admin only, with optional filters)
// GET /api/halltickets/admin/all
const getAllHallTickets = async (req, res) => {
    try {
        const { status, examId } = req.query;
        const query = {};
        
        if (status) query.approvalStatus = status;
        if (examId) query.exam = examId;

        const tickets = await HallTicket.find(query)
            .populate('student', 'name email rollNumber department course semester')
            .populate('exam', 'title course date startTime endTime')
            .sort({ createdAt: -1 });

        return res.json({ success: true, data: tickets });
    } catch (error) {
        console.error('getAllHallTickets error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch hall tickets' });
    }
};

// Get all hall tickets for a specific exam (Admin only)
// GET /api/halltickets/exam/:examId
const getExamHallTickets = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const tickets = await HallTicket.find({ exam: examId, isActive: true })
      .populate('student', 'name email rollNumber department course')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: tickets });
  } catch (error) {
    console.error('getExamHallTickets error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch exam hall tickets' });
  }
};

// Revoke a hall ticket (Admin only)
// PATCH /api/halltickets/:id/revoke
const revokeHallTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await HallTicket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Hall ticket not found' });

    ticket.status = 'revoked';
    ticket.isActive = false;
    await ticket.save();

    return res.json({ success: true, message: 'Hall ticket revoked', data: ticket });
  } catch (error) {
    console.error('revokeHallTicket error:', error);
    return res.status(500).json({ success: false, message: 'Failed to revoke hall ticket' });
  }
};

// Get current user's ticket for a specific exam
// GET /api/halltickets/exam/:examId/me
const getMyTicketForExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const ticket = await HallTicket.findOne({
      student: req.user._id || req.user.id,
      exam: examId,
      isActive: true,
      status: 'issued'
    }).populate('exam', 'title course date startTime endTime duration totalMarks hall status');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Hall ticket not issued for this exam' });
    }

    return res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('getMyTicketForExam error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch hall ticket' });
  }
};

module.exports = {
  issueHallTicket,
  getMyHallTickets,
  getExamHallTickets,
  revokeHallTicket,
  getMyTicketForExam,
  getAllHallTickets,
  updateHallTicketStatus,
};
