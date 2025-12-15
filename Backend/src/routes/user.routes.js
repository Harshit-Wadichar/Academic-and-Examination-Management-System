const express = require('express');
const { getProfile, updateProfile, getAllUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin routes
router.get('/', auth, adminOnly, getAllUsers);
router.put('/:id', auth, adminOnly, updateUser);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;