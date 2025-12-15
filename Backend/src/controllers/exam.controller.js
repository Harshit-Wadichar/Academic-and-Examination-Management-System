const Exam = require('../models/Exam');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin)
const createExam = async (req, res) => {
  try {
    const { title, course, date, startTime, endTime, duration, totalMarks, hall, instructions } = req.body;

    const exam = await Exam.create({
      title,
      course,
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
    const { title, course, date, startTime, endTime, duration, totalMarks, hall, instructions, status } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { title, course, date, startTime, endTime, duration, totalMarks, hall, instructions, status },
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

module.exports = {
  getAllExams,
  createExam,
  getExam,
  updateExam,
  deleteExam
};