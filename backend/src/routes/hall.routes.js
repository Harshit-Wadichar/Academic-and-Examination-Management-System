const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hall.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');

// Get all halls (accessible to all authenticated users)
router.get('/', authMiddleware, hallController.getAllHalls);

// Get a single hall by ID (accessible to all authenticated users)
router.get('/:id', authMiddleware, hallController.getHallById);

// Create a new hall (seating_manager only)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['seating_manager', 'admin']),
  hallController.createHall
);

// Update a hall (seating_manager only)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['seating_manager', 'admin']),
  hallController.updateHall
);

// Delete a hall (seating_manager only)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['seating_manager', 'admin']),
  hallController.deleteHall
);

module.exports = router;

