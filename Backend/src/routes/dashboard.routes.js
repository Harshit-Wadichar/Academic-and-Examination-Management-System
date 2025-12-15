const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth.middleware");

// Student dashboard
router.get("/student", auth, dashboardController.getStudentDashboard);

// Admin dashboard
router.get("/admin", auth, dashboardController.getAdminDashboard);

// Seating Manager dashboard
router.get(
  "/seating-manager",
  auth,
  dashboardController.getSeatingManagerDashboard
);

// Club Coordinator dashboard
router.get(
  "/club-coordinator",
  auth,
  dashboardController.getClubCoordinatorDashboard
);

module.exports = router;
