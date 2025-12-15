const express = require('express');
const { getAllExams, createExam, getExam, updateExam, deleteExam } = require('../controllers/exam.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Public routes (authenticated users)
router.get('/', auth, getAllExams);
router.get('/:id', auth, getExam);

// Admin only routes
router.post('/', auth, adminOnly, createExam);
router.put('/:id', auth, adminOnly, updateExam);
router.delete('/:id', auth, adminOnly, deleteExam);

module.exports = router;