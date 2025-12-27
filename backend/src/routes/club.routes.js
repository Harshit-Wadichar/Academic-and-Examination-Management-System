const express = require("express");
const router = express.Router();
const clubController = require("../controllers/club.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");
const upload = require("../middleware/club-upload.middleware");

// Create club with image upload
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  upload.single("image"),
  clubController.createClub
);

// Get all clubs (filtered by role)
router.get("/", authMiddleware, clubController.getClubs);

// Get pending clubs (admin only)
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(["admin"]),
  clubController.getPendingClubs
);

// Get specific club
router.get("/:id", authMiddleware, clubController.getClubById);

// Update club with image upload
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  upload.single("image"),
  clubController.updateClub
);

// Delete club
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "club_coordinator"]),
  clubController.deleteClub
);

// Admin approve club
router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(["admin"]),
  clubController.approveClub
);

// Admin reject club
router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware(["admin"]),
  clubController.rejectClub
);

// Student send join request
router.post(
  "/:id/join-request",
  authMiddleware,
  roleMiddleware(["student"]),
  clubController.sendJoinRequest
);

// Get join requests for a club (coordinator)
router.get(
  "/:id/join-requests",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  clubController.getJoinRequests
);

// Coordinator approve member
router.put(
  "/:id/approve-member/:userId",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  clubController.approveMember
);

// Coordinator reject member
router.put(
  "/:id/reject-member/:userId",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  clubController.rejectMember
);

// Club News Routes

// Create news for a club (coordinator only)
router.post(
  "/:id/news",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  clubController.createNews
);

// Get news for a club (members only)
router.get(
  "/:id/news",
  authMiddleware,
  clubController.getClubNews
);

// Update news
router.put(
  "/:id/news/:newsId",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  clubController.updateNews
);

// Delete news
router.delete(
  "/:id/news/:newsId",
  authMiddleware,
  roleMiddleware(["club_coordinator", "admin"]),
  clubController.deleteNews
);

module.exports = router;
