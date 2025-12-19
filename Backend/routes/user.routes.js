const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private (all authenticated users)
 */
router.get('/me', authMiddleware, userController.getProfile);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (admin only)
 */
router.get('/', 
    authMiddleware, 
    roleMiddleware(['admin']), 
    userController.getAllUsers
);

module.exports = router;