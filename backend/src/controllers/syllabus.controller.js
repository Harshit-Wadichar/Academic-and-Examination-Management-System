const Syllabus = require("../models/Syllabus");
const Course = require("../models/Course");
const User = require("../models/User");
const { USER_ROLES } = require("../config/constants");

// @desc    Get all syllabuses (role-based filtering)
// @route   GET /api/syllabus
// @access  Private
const getAllSyllabuses = async (req, res) => {
  try {
    const { role, department, semester, course } = req.user;
    let query = { isActive: true };

    // Students and Teachers can only see syllabuses matching their credentials
    if (role === USER_ROLES.STUDENT || role === USER_ROLES.TEACHER) {
      query.department = department;
      query.semester = semester;
      query.courseType = course;
    }
    // Admin no longer has access to syllabuses
    else if (role === USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Admins do not have access to syllabus management",
      });
    }

    const syllabuses = await Syllabus.find(query)
      .populate("createdBy", "name email")
      .populate("subject", "courseName courseCode semester department")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: syllabuses,
    });
  } catch (error) {
    console.error("Error fetching syllabuses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create new syllabus (Teacher only)
// @route   POST /api/syllabus
// @access  Private (Teacher)
const createSyllabus = async (req, res) => {
  try {
    const { subject, title, description, content } = req.body;
    const { department, semester, course: courseType } = req.user;

    // Validate that the subject exists
    const subjectDoc = await Course.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Validate that subject matches teacher's credentials
    if (
      subjectDoc.department !== department ||
      subjectDoc.semester !== semester
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only create syllabuses for subjects in your department and semester",
      });
    }

    const syllabus = await Syllabus.create({
      subject,
      department,
      semester,
      courseType,
      title,
      description,
      content,
      createdBy: req.user.id,
      academicYear: new Date().getFullYear().toString(),
    });

    const populatedSyllabus = await Syllabus.findById(syllabus._id)
      .populate("subject", "courseName courseCode department")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      data: populatedSyllabus,
    });
  } catch (error) {
    console.error("Error creating syllabus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create syllabus",
      error: error.message,
    });
  }
};

// @desc    Get single syllabus
// @route   GET /api/syllabus/:id
// @access  Private
const getSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("subject", "courseName courseCode department");

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    // Check if user has access to this syllabus
    const { role, department, semester, course } = req.user;
    if (role === USER_ROLES.STUDENT || role === USER_ROLES.TEACHER) {
      if (
        syllabus.department !== department ||
        syllabus.semester !== semester ||
        syllabus.courseType !== course
      ) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this syllabus",
        });
      }
    }

    res.json({
      success: true,
      data: syllabus,
    });
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update syllabus
// @route   PUT /api/syllabus/:id
// @access  Private (Creator Teacher only)
const updateSyllabus = async (req, res) => {
  try {
    const { title, description, content, subject } = req.body;

    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    // Check if user is the creator
    if (syllabus.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update syllabuses you created",
      });
    }

    // If subject is being changed, validate it
    if (subject && subject !== syllabus.subject.toString()) {
      const subjectDoc = await Course.findById(subject);
      if (!subjectDoc) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      // Validate that subject matches teacher's credentials
      const { department, semester } = req.user;
      if (
        subjectDoc.department !== department ||
        subjectDoc.semester !== semester
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only assign subjects from your department and semester",
        });
      }
    }

    const updateData = { title, description, content };
    if (subject) updateData.subject = subject;

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("subject", "courseName courseCode department")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      data: updatedSyllabus,
    });
  } catch (error) {
    console.error("Error updating syllabus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update syllabus",
    });
  }
};

// @desc    Delete syllabus
// @route   DELETE /api/syllabus/:id
// @access  Private (Creator Teacher only)
const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    // Check if user is the creator
    console.log('Delete check:', {
      syllabusCreator: syllabus.createdBy.toString(),
      currentUser: req.user.id.toString(),
      match: syllabus.createdBy.toString() === req.user.id.toString()
    });
    
    if (syllabus.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete syllabuses you created",
      });
    }

    // Soft delete
    await Syllabus.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: "Syllabus deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting syllabus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete syllabus",
    });
  }
};

// @desc    Get available subjects for teacher
// @route   GET /api/syllabus/teacher/subjects
// @access  Private (Teacher)
const getSubjectsForTeacher = async (req, res) => {
  try {
    const { department, semester } = req.user;

    const subjects = await Course.find({
      department,
      semester,
      isActive: true,
    }).sort({ courseName: 1 });

    res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
};

// @desc    Get syllabus by course ID (legacy support)
// @route   GET /api/syllabus/course/:courseId
// @access  Private
const getSyllabusByCourseId = async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({
      course: req.params.courseId,
      isActive: true,
    }).populate("createdBy", "name email");

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found for this course",
      });
    }

    res.json({
      success: true,
      data: syllabus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllSyllabuses,
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
  getSubjectsForTeacher,
  getSyllabusByCourseId,
};
