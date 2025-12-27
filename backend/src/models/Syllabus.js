const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Subject is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8
  },
  courseType: {
    type: String,
    required: [true, 'Course type is required'],
    trim: true
  },
  course: {
    type: String,
    trim: true
    // Deprecated: kept for backward compatibility
  },
  title: {
    type: String,
    required: [true, 'Syllabus title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Syllabus content is required']
  },
  topics: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      trim: true
    }
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  assessmentMethods: [{
    type: {
      type: String,
      enum: ['assignment', 'quiz', 'midterm', 'final', 'project', 'presentation'],
      required: true
    },
    weightage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    description: {
      type: String,
      trim: true
    }
  }],
  textbooks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    edition: {
      type: String,
      trim: true
    },
    isbn: {
      type: String,
      trim: true
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  references: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    }
  }],
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
syllabusSchema.index({ department: 1, semester: 1, courseType: 1 });
syllabusSchema.index({ subject: 1 });
syllabusSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Syllabus', syllabusSchema);