const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problem.controller");
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

// Student can create problems
router.post("/", problemController.createProblem);

// Get problems (filtered by role)
router.get("/", problemController.getProblems);

// Get problem statistics (admin only)
router.get("/stats", roleCheck(["admin"]), problemController.getProblemStats);

// Update problem status (staff only)
router.patch(
  "/:id/status",
  roleCheck(["admin", "club_coordinator", "seating_manager"]),
  problemController.updateProblemStatus
);

// Respond to problem (staff only)
router.patch(
  "/:id/respond",
  roleCheck(["admin", "club_coordinator", "seating_manager"]),
  problemController.respondToProblem
);

module.exports = router;
