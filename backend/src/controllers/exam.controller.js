const Exam = require('../models/Exam');
const { USER_ROLES } = require('../config/constants');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getAllExams = async (req, res) => {
  try {
    const { role, department, semester, course } = req.user;
    let query = { isActive: true };

    // Teachers see only exams matching their credentials
    if (role === USER_ROLES.TEACHER) {
      // query.course = course; // Removed strict subject check
      query.semester = semester;
    }

    const exams = await Exam.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: exams
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Helper to check for conflicts
const checkHallConflict = async (hall, date, startTime, endTime, excludeExamId = null) => {
    // Parse times to minutes for comparison
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Find overlapping exams
    // Same Hall, Same Date, Active
    const query = {
        hall,
        date: new Date(date), // Ensure date match
        isActive: true,
        status: { $ne: 'completed' } // existing conflicts matter only if exam is not over actually
    };
    
    // In update scenario, exclude self
    if (excludeExamId) {
        query._id = { $ne: excludeExamId };
    }

    const conflicts = await Exam.find(query);

    for (const exam of conflicts) {
        const existingStart = timeToMinutes(exam.startTime);
        const existingEnd = timeToMinutes(exam.endTime);

        // Check Overlap: (StartA < EndB) and (EndA > StartB)
        if (newStart < existingEnd && newEnd > existingStart) {
            return true; // Conflict found
        }
    }
    return false;
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Teacher)
const createExam = async (req, res) => {
  try {
    const { title, course, semester, date, startTime, endTime, duration, totalMarks, hall, instructions } = req.body;
    const { role } = req.user;

    // Only Admin can create exams
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create exams'
      });
    }

    // Check Hall Availability
    if (await checkHallConflict(hall, date, startTime, endTime)) {
        return res.status(400).json({
            success: false,
            message: `Hall ${hall} is already booked for this time slot on ${new Date(date).toLocaleDateString()}`
        });
    }

    const exam = await Exam.create({
      title,
      course,
      semester,
      date,
      startTime,
      endTime,
      duration,
      totalMarks,
      hall,
      instructions,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create exam'
    });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.json({
      success: true,
      exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private (Admin)
const updateExam = async (req, res) => {
  try {
    const { title, course, semester, date, startTime, endTime, duration, totalMarks, hall, instructions, status } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check Hall Availability (if hall or time changed)
    if (hall && date && startTime && endTime) {
        if (await checkHallConflict(hall, date, startTime, endTime, req.params.id)) {
            return res.status(400).json({
                success: false,
                message: `Hall ${hall} is already booked for this time slot`
            });
        }
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { title, course, semester, date, startTime, endTime, duration, totalMarks, hall, instructions, status },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Exam updated successfully',
      exam: updatedExam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update exam'
    });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Soft delete
    await Exam.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete exam'
    });
  }
};

// @desc    Get pending hall tickets for admin approval
// @route   GET /api/exams/admin/hall-tickets/pending
// @access  Private (Admin)
const getPendingHallTickets = async (req, res) => {
  try {
    const HallTicket = require('../models/HallTicket');
    
    const pendingTickets = await HallTicket.find({ approvalStatus: 'pending', isActive: true })
      .populate('student', 'name email rollNumber department semester course')
      .populate('exam', 'title course semester date')
      .populate({
        path: 'exam',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .sort({ issuedAt: -1 });

    res.json({
      success: true,
      data: pendingTickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending hall tickets'
    });
  }
};

// @desc    Approve hall ticket
// @route   PUT /api/exams/admin/hall-ticket/:id/approve
// @access  Private (Admin)
const approveHallTicket = async (req, res) => {
  try {
    const HallTicket = require('../models/HallTicket');
    
    const ticket = await HallTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Hall ticket not found'
      });
    }

    ticket.approvalStatus = 'approved';
    ticket.approvedBy = req.user.id;
    ticket.approvedAt = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: 'Hall ticket approved successfully',
      data: ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve hall ticket'
    });
  }
};

// @desc    Reject hall ticket
// @route   PUT /api/exams/admin/hall-ticket/:id/reject
// @access  Private (Admin)
const rejectHallTicket = async (req, res) => {
  try {
    const HallTicket = require('../models/HallTicket');
    const { reason } = req.body;
    
    const ticket = await HallTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Hall ticket not found'
      });
    }

    ticket.approvalStatus = 'rejected';
    ticket.approvedBy = req.user.id;
    ticket.approvedAt = new Date();
    ticket.rejectionReason = reason || 'No reason provided';
    await ticket.save();

    res.json({
      success: true,
      message: 'Hall ticket rejected',
      data: ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject hall ticket'
    });
  }
};

module.exports = {
  getAllExams,
  createExam,
  getExam,
  updateExam,
  deleteExam,
  getPendingHallTickets,
  approveHallTicket,
  rejectHallTicket
};