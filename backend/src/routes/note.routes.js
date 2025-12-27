const express = require('express');
const { uploadNote, getNotes, deleteNote, approveNote, rejectNote } = require('../controllers/note.controller');
const auth = require('../middleware/auth.middleware');
const noteUpload = require('../middleware/note-upload.middleware');
const { teacherOnly, adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// Routes
router.post('/', auth, teacherOnly, noteUpload.single('file'), uploadNote);
router.get('/', auth, getNotes);
router.put('/:id/approve', auth, adminOnly, approveNote);
router.put('/:id/reject', auth, adminOnly, rejectNote);
router.delete('/:id', auth, deleteNote);

module.exports = router;
