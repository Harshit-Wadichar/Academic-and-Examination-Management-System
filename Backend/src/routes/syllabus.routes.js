const express = require('express');
const {
  getAllSyllabuses,
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus
} = require('../controllers/syllabus.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Public routes (authenticated users)
router.get('/', auth, getAllSyllabuses);
router.get('/:id', auth, getSyllabus);

// Admin routes (restrict modifications)
router.post('/', auth, adminOnly, createSyllabus);
router.put('/:id', auth, adminOnly, updateSyllabus);
router.delete('/:id', auth, adminOnly, deleteSyllabus);

module.exports = router;