const Note = require('../models/Note');
const { USER_ROLES } = require('../config/constants');

// @desc    Upload a new note
// @route   POST /api/notes
// @access  Private (Teacher only)
const uploadNote = async (req, res) => {
  try {
    const { title, course, department, semester } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!title || !course || !department || !semester) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // specific to local uploads
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/notes/${req.file.filename}`;

    const note = await Note.create({
      title,
      course,
      department,
      semester,
      fileUrl: fileUrl,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      data: note
    });
  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// Basic mapping for department names
const DEPT_MAPPING = {
  // Full names
  'Computer Science and Engineering': 'CSE',
  'Information Technology': 'IT',
  'Electronics and Communication Engineering': 'ECE',
  'Electrical and Electronics Engineering': 'EEE',
  'Mechanical Engineering': 'ME',
  'Civil Engineering': 'CE',
  
  // Variations/Short names from user request
  'Computer Science': 'CSE',
  'Electronics': 'ECE',
  'Mechanical': 'ME',
  'Civil': 'CE',
  'Electrical': 'EEE',

  'Computer Application': 'BCA', 
  'Master of Computer Application': 'MCA'
};

// @desc    Get notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { role, course, department, semester } = req.user;
    
    let query = {};

    // If student, filter by their details AND only approved notes
    if (role === USER_ROLES.STUDENT) {
      if (course && department && semester) {
          // Use mapped department if available, otherwise use original
          const searchDept = DEPT_MAPPING[department] || department;
          
          console.log(`Student Query Debug:
            Original Dept: "${department}"
            Mapped Dept: "${searchDept}"
            Course: "${course}"
            Semester: "${semester}"
          `);

          query = {
              course: course,
              department: searchDept,
              semester: semester,
              status: 'approved' // Students only see approved notes
          };
      } else {
           return res.json({ success: true, data: [] });
      }
    } else if (role === USER_ROLES.TEACHER) {
      // Teachers see all their uploaded notes (pending, approved, rejected)
      query = { uploadedBy: req.user.id };
    } else if (role === USER_ROLES.ADMIN) {
      // Admin sees all notes - can optionally filter by status from query params
      const { status } = req.query;
      if (status) {
        query = { status };
      }
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private (Teacher/Admin)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check ownership
    if (req.user.role !== USER_ROLES.ADMIN && note.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve note
// @route   PUT /api/notes/:id/approve
// @access  Private (Admin only)
const approveNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, message: 'Note approved', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reject note
// @route   PUT /api/notes/:id/reject
// @access  Private (Admin only)
const rejectNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, message: 'Note rejected', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  uploadNote,
  getNotes,
  deleteNote,
  approveNote,
  rejectNote
};
