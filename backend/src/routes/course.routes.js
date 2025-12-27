const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

// Get all courses (accessible to all authenticated users)
router.get("/", authMiddleware, courseController.getAllCourses);

// Get courses by department/semester
router.get("/filter", authMiddleware, courseController.getCoursesByFilter);

// Get a single course by ID
router.get("/:id", authMiddleware, courseController.getCourseById);

// Create a new course (admin/teacher only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  courseController.createCourse
);

// Update a course (admin/teacher only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  courseController.updateCourse
);

// Delete a course (admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  courseController.deleteCourse
);

// Enroll student in course
router.post("/:id/enroll", authMiddleware, courseController.enrollStudent);

// Unenroll student from course
router.post("/:id/unenroll", authMiddleware, courseController.unenrollStudent);

module.exports = router;
