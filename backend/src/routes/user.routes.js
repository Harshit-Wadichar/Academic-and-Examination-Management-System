const express = require('express');
const { getProfile, updateProfile, getAllUsers, updateUser, deleteUser, uploadProfilePicture } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly, roleMiddleware } = require('../middleware/role.middleware');
const { USER_ROLES } = require('../config/constants');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/upload-picture', auth, upload.single('image'), uploadProfilePicture);

// Admin routes
router.get('/', auth, roleMiddleware([USER_ROLES.ADMIN, USER_ROLES.TEACHER]), getAllUsers);
router.put('/:id', auth, adminOnly, updateUser);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;