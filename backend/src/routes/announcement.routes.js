const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const auth = require("../middleware/auth.middleware");

// Helper middleware for role check
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    next();
  };
};

// All routes require authentication
router.use(auth);

// Get all announcements (filtered by role)
router.get("/", announcementController.getAnnouncements);

// Get pending announcements (admin only)
router.get("/pending", roleCheck(["admin"]), announcementController.getPendingAnnouncements);

// Create announcement (all staff except students)
router.post("/", roleCheck(["admin", "seating_manager", "club_coordinator"]), announcementController.createAnnouncement);

// Approve announcement (admin only)
router.patch("/:id/approve", roleCheck(["admin"]), announcementController.approveAnnouncement);

// Reject announcement (admin only)
router.patch("/:id/reject", roleCheck(["admin"]), announcementController.rejectAnnouncement);

// Delete announcement
router.delete("/:id", announcementController.deleteAnnouncement);

module.exports = router;
