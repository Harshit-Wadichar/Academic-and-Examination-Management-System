const Course = require("../models/Course");
const User = require("../models/User");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate("instructor", "name email")
      .sort({ semester: 1, courseCode: 1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get courses by filter
// @route   GET /api/courses/filter
// @access  Private
const getCoursesByFilter = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = { isActive: true };

    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort({ semester: 1, courseCode: 1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Admin/Teacher)
const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      department,
      semester,
      credits,
      description,
      prerequisites,
    } = req.body;

    const course = await Course.create({
      courseCode,
      courseName,
      department,
      semester,
      credits,
      description,
      prerequisites,
      instructor: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Course code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Teacher)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollStudent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user.enrolledCourses.includes(req.params.id)) {
      user.enrolledCourses.push(req.params.id);
      await user.save();
    }

    res.json({
      success: true,
      message: "Enrolled in course successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
};

// @desc    Unenroll student from course
// @route   POST /api/courses/:id/unenroll
// @access  Private
const unenrollStudent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.enrolledCourses = user.enrolledCourses.filter(
      (courseId) => courseId.toString() !== req.params.id
    );
    await user.save();

    res.json({
      success: true,
      message: "Unenrolled from course successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unenroll from course",
    });
  }
};

module.exports = {
  getAllCourses,
  getCoursesByFilter,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  unenrollStudent,
};
