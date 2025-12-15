const express = require('express');
const { issueHallTicket, getMyHallTickets, getExamHallTickets, revokeHallTicket, getMyTicketForExam } = require('../controllers/hallticket.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly, studentOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Student routes
router.get('/me', auth, getMyHallTickets);
router.get('/exam/:examId/me', auth, getMyTicketForExam);

// Admin routes
router.post('/issue', auth, adminOnly, issueHallTicket);
router.get('/exam/:examId', auth, adminOnly, getExamHallTickets);
router.patch('/:id/revoke', auth, adminOnly, revokeHallTicket);

module.exports = router;
