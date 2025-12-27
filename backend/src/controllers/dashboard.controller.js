const User = require("../models/User");
const Exam = require("../models/Exam");
const Course = require("../models/Course");
const HallTicket = require("../models/HallTicket");
const Event = require("../models/Event");
const SeatingArrangement = require("../models/SeatingArrangement");
const Syllabus = require("../models/Syllabus");
const Announcement = require("../models/Announcement");
const Club = require("../models/Club");
const Note = require("../models/Note");
const Problem = require("../models/Problem");

// Get student dashboard data
exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's enrolled courses
    const user = await User.findById(userId).populate("enrolledCourses");
    const enrolledCourses = user.enrolledCourses || [];

    // Get hall tickets for user with issued status
    const hallTickets = await HallTicket.find({ 
      student: userId,
      status: "issued",
      isActive: true
    })
      .populate("exam")
      .sort({ createdAt: -1 });

    // Filter hall tickets for upcoming exams only
    const upcomingHallTickets = hallTickets.filter(ticket => {
      if (!ticket.exam) return false;
      const examDate = new Date(ticket.exam.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return examDate >= today && ticket.exam.isActive;
    });

    // Get upcoming exams from hall tickets
    const upcomingExams = upcomingHallTickets
      .map(ticket => ticket.exam)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    // Get recent events
    const recentEvents = await Event.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(3);

    // Get recent approved announcements
    const recentAnnouncements = await Announcement.find({
      status: "approved",
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .limit(5);

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
        recentAnnouncements: recentAnnouncements.length,
        syllabusProgress,
        upcomingExamsList: upcomingExams.map((exam) => ({
          id: exam._id,
          title: exam.title,
          course: exam.course,
          date: exam.date,
          startTime: exam.startTime,
          endTime: exam.endTime,
          hall: exam.hall,
          duration: exam.duration,
        })),
        recentEventsList: recentEvents.map((event) => ({
          id: event._id,
          title: event.title,
          date: event.date,
          type: event.type,
        })),
        recentAnnouncementsList: recentAnnouncements.map((announcement) => ({
          id: announcement._id,
          title: announcement.title,
          content: announcement.content,
          category: announcement.category,
          priority: announcement.priority,
          createdBy: announcement.createdBy?.name || "Unknown",
          createdByRole: announcement.createdBy?.role || "Unknown",
          createdAt: announcement.createdAt,
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

    // Get recent activities
    const recentActivities = [];

    // Recent user registrations
    const newUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name email role createdAt");

    newUsers.forEach((user) => {
      recentActivities.push({
        type: "user_registration",
        message: `New ${user.role} registered`,
        details: `${user.name} - ${user.email}`,
        timestamp: user.createdAt,
      });
    });

    // Recent exams created
    const recentExams = await Exam.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title course createdAt");

    recentExams.forEach((exam) => {
      recentActivities.push({
        type: "exam_created",
        message: "Exam schedule created",
        details: `${exam.title} - ${exam.course || "Unknown Course"}`,
        timestamp: exam.createdAt,
      });
    });

    // Recent events created
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title date createdAt");

    recentEvents.forEach((event) => {
      recentActivities.push({
        type: "event_created",
        message: "Event created",
        details: `${event.title} - ${new Date(
          event.date
        ).toLocaleDateString()}`,
        timestamp: event.createdAt,
      });
    });

    // Sort activities by timestamp
    recentActivities.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    const topActivities = recentActivities.slice(0, 5);

    // Get system stats
    const totalUsers = await User.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalHallTickets = await HallTicket.countDocuments();

    // Get Pending Actions Counts
    const pendingClubs = await Club.countDocuments({ status: "Pending" });
    const pendingEvents = await Event.countDocuments({ status: "Pending" });
    const pendingNotes = await Note.countDocuments({ status: "pending" });
    const openProblems = await Problem.countDocuments({ status: "open" });

    res.json({
      success: true,
      data: {
        totalStudents,
        activeCourses,
        upcomingExams,
        totalEvents,
        systemUsage: "85%", // Mock data
        recentUsers,
        recentActivities: topActivities,
        pendingActions: {
          clubs: pendingClubs,
          events: pendingEvents,
          notes: pendingNotes,
          problems: openProblems
        },
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
