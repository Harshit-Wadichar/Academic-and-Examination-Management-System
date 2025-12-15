const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["club_coordinator"]),
  eventController.createEvent
);
router.get("/", authMiddleware, eventController.getEvents);
router.get("/:id", authMiddleware, eventController.getEventById);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["club_coordinator"]),
  eventController.updateEvent
);
router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(["admin"]),
  eventController.approveEvent
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "club_coordinator"]),
  eventController.deleteEvent
);

module.exports = router;
