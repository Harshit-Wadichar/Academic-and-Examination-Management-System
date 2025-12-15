const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Routes without validation
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;