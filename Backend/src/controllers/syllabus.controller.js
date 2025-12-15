const Syllabus = require('../models/Syllabus');

// @desc    Get all syllabuses
// @route   GET /api/syllabus
// @access  Private
const getAllSyllabuses = async (req, res) => {
  try {
    const syllabuses = await Syllabus.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(syllabuses);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new syllabus
// @route   POST /api/syllabus
// @access  Private (Admin/Teacher)
const createSyllabus = async (req, res) => {
  try {
    const { title, course, description, content } = req.body;

    const syllabus = await Syllabus.create({
      title,
      course,
      description,
      content,
      createdBy: req.user.id,
      academicYear: new Date().getFullYear().toString()
    });

    res.status(201).json({
      success: true,
      message: 'Syllabus created successfully',
      syllabus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create syllabus'
    });
  }
};

// @desc    Get single syllabus
// @route   GET /api/syllabus/:id
// @access  Private
const getSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }

    res.json({
      success: true,
      syllabus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update syllabus
// @route   PUT /api/syllabus/:id
// @access  Private (Admin/Creator)
const updateSyllabus = async (req, res) => {
  try {
    const { title, course, description, content } = req.body;

    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }

    // Check if user is creator or admin
    if (syllabus.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this syllabus'
      });
    }

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      { title, course, description, content },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Syllabus updated successfully',
      syllabus: updatedSyllabus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update syllabus'
    });
  }
};

// @desc    Delete syllabus
// @route   DELETE /api/syllabus/:id
// @access  Private (Admin/Creator)
const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }

    // Check if user is creator or admin
    if (syllabus.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this syllabus'
      });
    }

    // Soft delete
    await Syllabus.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Syllabus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete syllabus'
    });
  }
};

module.exports = {
  getAllSyllabuses,
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus
};