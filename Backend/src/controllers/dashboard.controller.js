const User = require("../models/User");
const Exam = require("../models/Exam");
const Course = require("../models/Course");
const HallTicket = require("../models/HallTicket");
const Event = require("../models/Event");
const SeatingArrangement = require("../models/SeatingArrangement");
const Syllabus = require("../models/Syllabus");

// Get student dashboard data
exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's enrolled courses
    const user = await User.findById(userId).populate("courses");
    const enrolledCourses = user.courses || [];

    // Get upcoming exams for enrolled courses
    const upcomingExams = await Exam.find({
      course: { $in: enrolledCourses.map((c) => c._id) },
      date: { $gte: new Date() },
      status: "upcoming",
    })
      .populate("course")
      .limit(5);

    // Get hall tickets for user
    const hallTickets = await HallTicket.find({ student: userId })
      .populate("exam")
      .sort({ createdAt: -1 });

    // Get recent events
    const recentEvents = await Event.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(3);

    // Get syllabus progress (mock data for now)
    const syllabusProgress = enrolledCourses.map((course) => ({
      courseName: course.name,
      progress: Math.floor(Math.random() * 100), // Mock progress
    }));

    res.json({
      success: true,
      data: {
        enrolledCourses: enrolledCourses.length,
        upcomingExams: upcomingExams.length,
        hallTickets: hallTickets.length,
        recentEvents: recentEvents.length,
        syllabusProgress,
        upcomingExams: upcomingExams.map((exam) => ({
          id: exam._id,
          title: exam.title,
          course: exam.course.name,
          date: exam.date,
          time: exam.startTime,
        })),
        recentEvents: recentEvents.map((event) => ({
          id: event._id,
          title: event.title,
          date: event.date,
          type: event.type,
        })),
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard data",
    });
  }
};

// Get admin dashboard data
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get total students
    const totalStudents = await User.countDocuments({ role: "student" });

    // Get total courses
    const activeCourses = await Course.countDocuments();

    // Get upcoming exams
    const upcomingExams = await Exam.countDocuments({
      date: { $gte: new Date() },
      status: "upcoming",
    });

    // Get total events
    const totalEvents = await Event.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");

    // Get system stats
    const totalUsers = await User.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalHallTickets = await HallTicket.countDocuments();

    res.json({
      success: true,
      data: {
        totalStudents,
        activeCourses,
        upcomingExams,
        totalEvents,
        systemUsage: "85%", // Mock data
        recentUsers,
        stats: {
          totalUsers,
          totalExams,
          totalHallTickets,
          totalEvents,
        },
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
    });
  }
};

// Get seating manager dashboard data
exports.getSeatingManagerDashboard = async (req, res) => {
  try {
    // Get total halls
    const totalHalls = (await SeatingArrangement.distinct("hall").length) || 0;

    // Get upcoming exams with seating
    const upcomingSeatings = await SeatingArrangement.find({
      exam: {
        $in: await Exam.find({
          date: { $gte: new Date() },
        }).distinct("_id"),
      },
    })
      .populate("exam")
      .countDocuments();

    // Get recent seating arrangements
    const recentArrangements = await SeatingArrangement.find()
      .populate("exam")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalHalls,
        upcomingSeatings,
        recentArrangements: recentArrangements.length,
        arrangements: recentArrangements.map((arr) => ({
          id: arr._id,
          examTitle: arr.exam?.title || "Unknown Exam",
          hall: arr.hall,
          createdAt: arr.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Seating manager dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seating manager dashboard data",
    });
  }
};

// Get club coordinator dashboard data
exports.getClubCoordinatorDashboard = async (req, res) => {
  try {
    // Get total events
    const totalEvents = await Event.countDocuments();

    // Get upcoming events
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
    });

    // Get recent events
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        recentEvents: recentEvents.length,
        events: recentEvents.map((event) => ({
          id: event._id,
          title: event.title,
          date: event.date,
          type: event.type,
          status: event.status,
        })),
      },
    });
  } catch (error) {
    console.error("Club coordinator dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch club coordinator dashboard data",
    });
  }
};
