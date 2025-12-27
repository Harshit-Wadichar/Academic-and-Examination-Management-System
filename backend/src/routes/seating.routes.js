const express = require("express");
const router = express.Router();
const seatingController = require("../controllers/seating.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["seating_manager", "admin"]),
  seatingController.createSeatingArrangement
);

// Get all seating arrangements
router.get("/", authMiddleware, seatingController.getSeatingArrangements);

// Get student's seating
router.get("/student", authMiddleware, seatingController.getStudentSeating);

// Specific routes MUST come before generic /:id route
router.get(
  "/:id/download",
  authMiddleware,
  roleMiddleware(["seating_manager", "admin"]),
  seatingController.downloadSeatingArrangement
);

router.patch(
  "/:id/finalize",
  authMiddleware,
  roleMiddleware(["seating_manager", "admin"]),
  seatingController.finalizeSeating
);

// Generic routes come after specific ones
router.get("/:id", authMiddleware, seatingController.getSeatingById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["seating_manager", "admin"]),
  seatingController.updateSeatingArrangement
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["seating_manager", "admin"]),
  seatingController.deleteSeatingArrangement
);

module.exports = router;
