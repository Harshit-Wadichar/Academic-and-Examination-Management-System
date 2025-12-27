const express = require('express');
const {
  getAllSyllabuses,
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
  getSyllabusByCourseId,
  getSubjectsForTeacher
} = require('../controllers/syllabus.controller');
const auth = require('../middleware/auth.middleware');
const { teacherOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Teacher-specific routes (must come BEFORE /:id to avoid conflicts)
router.get('/teacher/subjects', auth, teacherOnly, getSubjectsForTeacher);

// Public routes (authenticated users - students/teachers)
router.get('/', auth, getAllSyllabuses);
router.get('/course/:courseId', auth, getSyllabusByCourseId);
router.get('/:id', auth, getSyllabus);

// Teacher routes (create/update/delete)
router.post('/', auth, teacherOnly, createSyllabus);
router.put('/:id', auth, teacherOnly, updateSyllabus);
router.delete('/:id', auth, teacherOnly, deleteSyllabus);

module.exports = router;