const HallTicket = require('../models/HallTicket');
const Exam = require('../models/Exam');
const User = require('../models/User');

// Issue a hall ticket for a student and an exam (Admin only)
// POST /api/halltickets/issue
const issueHallTicket = async (req, res) => {
  try {
    const { studentId, examId, hall, seatNumber, notes } = req.body;

    if (!studentId || !examId || !hall) {
      return res.status(400).json({ success: false, message: 'studentId, examId and hall are required' });
    }

    const [student, exam] = await Promise.all([
      User.findById(studentId),
      Exam.findById(examId)
    ]);

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    // Create or upsert ticket (unique index on {student, exam})
    const ticket = await HallTicket.findOneAndUpdate(
      { student: studentId, exam: examId },
      {
        student: studentId,
        exam: examId,
        hall,
        seatNumber,
        notes,
        status: 'issued',
        isActive: true,
        issuedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ success: true, message: 'Hall ticket issued', data: ticket });
  } catch (error) {
    console.error('issueHallTicket error:', error);
    return res.status(500).json({ success: false, message: 'Failed to issue hall ticket' });
  }
};

// Get hall tickets for current logged-in student
// GET /api/halltickets/me
const getMyHallTickets = async (req, res) => {
  try {
    const tickets = await HallTicket.find({ student: req.user._id || req.user.id, isActive: true })
      .populate('exam', 'title course date startTime endTime duration totalMarks hall status')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: tickets });
  } catch (error) {
    console.error('getMyHallTickets error:', error);
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
};
