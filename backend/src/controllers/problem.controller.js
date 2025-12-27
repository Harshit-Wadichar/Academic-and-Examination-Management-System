const Problem = require("../models/Problem");

// Create a new problem (Student submits anonymously)
exports.createProblem = async (req, res) => {
  try {
    const { description, category } = req.body;

    if (!description || !category) {
      return res.status(400).json({
        success: false,
        message: "Description and category are required",
      });
    }

    const problem = await Problem.create({
      description,
      category,
      submittedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Problem submitted successfully. It will be reviewed anonymously.",
      data: problem,
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit problem",
    });
  }
};

// Get problems based on user role
exports.getProblems = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = {};

    // Route problems to appropriate role
    if (userRole === "admin") {
      // Admin sees all problems OR those assigned to admin
      query = { $or: [{ assignedToRole: "admin" }, {}] };
      query = {}; // Admin sees all
    } else if (userRole === "club_coordinator") {
      query = { assignedToRole: "club_coordinator" };
    } else if (userRole === "seating_manager") {
      query = { assignedToRole: "seating_manager" };
    } else if (userRole === "student") {
      // Students see only their own problems
      query = { submittedBy: req.user.id };
    }

    const problems = await Problem.find(query)
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    // For non-students, hide submitter identity (anonymous)
    const anonymizedProblems = problems.map((p) => {
      const problem = p.toObject();
      if (userRole !== "student" && problem.submittedBy) {
        delete problem.submittedBy; // Remove submitter info for anonymity
      }
      return problem;
    });

    res.status(200).json({
      success: true,
      data: anonymizedProblems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch problems",
    });
  }
};

// Update problem status
exports.updateProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const problem = await Problem.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error("Error updating problem status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
};

// Respond to a problem
exports.respondToProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Response is required",
      });
    }

    const problem = await Problem.findByIdAndUpdate(
      id,
      {
        response,
        respondedBy: req.user.id,
        respondedAt: new Date(),
        status: "resolved",
      },
      { new: true }
    ).populate("respondedBy", "name");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Response submitted successfully",
      data: problem,
    });
  } catch (error) {
    console.error("Error responding to problem:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit response",
    });
  }
};

// Get problem statistics
exports.getProblemStats = async (req, res) => {
  try {
    const stats = await Problem.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Problem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching problem stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch stats",
    });
  }
};
