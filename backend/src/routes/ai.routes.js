const express = require("express");
const router = express.Router();
const aiServiceController = require("../controllers/ai-service.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/generate-mindmap",
  authMiddleware,
  aiServiceController.generateMindMap
);
router.post(
  "/get-suggestions",
  authMiddleware,
  aiServiceController.getSuggestions
);

module.exports = router;
