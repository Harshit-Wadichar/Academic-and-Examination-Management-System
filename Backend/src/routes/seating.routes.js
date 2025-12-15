const express = require("express");
const router = express.Router();
const seatingController = require("../controllers/seating.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["seating_manager"]),
  seatingController.createSeatingArrangement
);
router.get("/", authMiddleware, seatingController.getSeatingArrangements);
router.get("/student", authMiddleware, seatingController.getStudentSeating);
router.get("/:id", authMiddleware, seatingController.getSeatingById);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["seating_manager"]),
  seatingController.updateSeatingArrangement
);
router.put(
  "/:id/finalize",
  authMiddleware,
  roleMiddleware(["seating_manager"]),
  seatingController.finalizeSeating
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["seating_manager"]),
  seatingController.deleteSeatingArrangement
);

module.exports = router;
