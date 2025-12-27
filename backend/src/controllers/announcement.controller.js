const Announcement = require("../models/Announcement");

// Create announcement (staff only - goes to pending)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Students cannot create announcements
    if (req.user.role === "student") {
      return res.status(403).json({
        success: false,
        message: "Students cannot create announcements",
      });
    }

    // Admin announcements are auto-approved
    const status = req.user.role === "admin" ? "approved" : "pending";

    const announcement = await Announcement.create({
      title,
      content,
      category: category || "general",
      priority: priority || "normal",
      createdBy: req.user.id,
      status,
      approvedBy: status === "approved" ? req.user.id : undefined,
      approvedAt: status === "approved" ? new Date() : undefined,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      message: status === "approved" 
        ? "Announcement published successfully!" 
        : "Announcement submitted for admin approval",
      data: announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create announcement",
    });
  }
};

// Get all announcements (filtered by role)
exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = {};

    if (userRole === "admin") {
      // Admin sees all announcements
      query = {};
    } else if (userRole === "student") {
      // Students see only approved and active announcements
      query = { 
        status: "approved", 
        isActive: true,
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
        ]
      };
    } else {
      // Other staff see approved ones + their own pending ones
      query = {
        $or: [
          { status: "approved", isActive: true },
          { createdBy: req.user.id }
        ]
      };
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "name role")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch announcements",
    });
  }
};

// Get pending announcements (admin only)
exports.getPendingAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: "pending" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching pending announcements:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending announcements",
    });
  }
};

// Approve announcement (admin only)
exports.approveAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    ).populate("createdBy", "name");

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement approved and published!",
      data: announcement,
    });
  } catch (error) {
    console.error("Error approving announcement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve announcement",
    });
  }
};

// Reject announcement (admin only)
exports.rejectAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectionReason: reason || "No reason provided",
      },
      { new: true }
    ).populate("createdBy", "name");

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement rejected",
      data: announcement,
    });
  } catch (error) {
    console.error("Error rejecting announcement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject announcement",
    });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Only admin or creator can delete
    if (req.user.role !== "admin" && announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this announcement",
      });
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete announcement",
    });
  }
};
