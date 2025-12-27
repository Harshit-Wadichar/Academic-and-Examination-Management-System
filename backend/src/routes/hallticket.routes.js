const express = require('express');
const { issueHallTicket, getMyHallTickets, getExamHallTickets, revokeHallTicket, getMyTicketForExam, updateHallTicketStatus, getAllHallTickets } = require('../controllers/hallticket.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly, studentOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Student routes
router.get('/me', auth, getMyHallTickets);
router.get('/exam/:examId/me', auth, getMyTicketForExam);

// Admin/Teacher routes
router.post('/issue', auth, issueHallTicket); // Controller handles role check

// Admin routes
router.get('/admin/all', auth, adminOnly, getAllHallTickets);
router.get('/exam/:examId', auth, adminOnly, getExamHallTickets);
router.put('/:id/status', auth, adminOnly, updateHallTicketStatus);
router.patch('/:id/revoke', auth, adminOnly, revokeHallTicket);

module.exports = router;
