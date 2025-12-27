const express = require('express');
const { 
  getAllExams, 
  createExam, 
  getExam, 
  updateExam, 
  deleteExam,
  getPendingHallTickets,
  approveHallTicket,
  rejectHallTicket
} = require('../controllers/exam.controller');
const auth = require('../middleware/auth.middleware');
const { teacherOnly, adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Authenticated routes
router.get('/', auth, getAllExams);
router.get('/:id', auth, getExam);

// Teacher only routes (exam management)
router.post('/', auth, teacherOnly, createExam);
router.put('/:id', auth, teacherOnly, updateExam);
router.delete('/:id', auth, teacherOnly, deleteExam);

// Admin routes for hall ticket approval
router.get('/admin/hall-tickets/pending', auth, adminOnly, getPendingHallTickets);
router.put('/admin/hall-ticket/:id/approve', auth, adminOnly, approveHallTicket);
router.put('/admin/hall-ticket/:id/reject', auth, adminOnly, rejectHallTicket);

module.exports = router;