/*
  Seed script to bootstrap initial data for development/testing.
  - Creates an admin user if not exists
  - Creates a few sample exams (upcoming)
  - Creates a sample syllabus

  Usage:
    NODE_ENV=development node src/scripts/seedData.js
  or
    npm run seed

  Required env:
    MONGODB_URI, JWT_SECRET (JWT not used here but generally required)
*/

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const { USER_ROLES } = require('../config/constants');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Syllabus = require('../models/Syllabus');

(async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured');
    }

    await connectDB();

    // 1) Ensure admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(adminPassword, 12);
      admin = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save
        role: USER_ROLES.ADMIN,
        department: 'Examination'
      });
      console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`Admin user exists: ${adminEmail}`);
    }

    // 2) Sample exams (upcoming)
    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const inFourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

    const sampleExams = [
      {
        title: 'Midterm Mathematics',
        course: 'MATH-101',
        date: inTwoDays,
        startTime: '10:00',
        endTime: '12:00',
        duration: 120,
        totalMarks: 100,
        hall: 'Main Hall - A1',
        instructions: 'Bring your ID card. No calculators allowed.',
        status: 'upcoming',
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Physics Fundamentals',
        course: 'PHYS-102',
        date: inFourDays,
        startTime: '14:00',
        endTime: '16:00',
        duration: 120,
        totalMarks: 100,
        hall: 'Science Block - B2',
        instructions: 'Arrive 15 minutes early.',
        status: 'upcoming',
        createdBy: admin._id,
        isActive: true
      }
    ];

    for (const ex of sampleExams) {
      const exists = await Exam.findOne({ title: ex.title, date: ex.date });
      if (!exists) {
        await Exam.create(ex);
        console.log(`Exam created: ${ex.title}`);
      } else {
        console.log(`Exam exists: ${ex.title}`);
      }
    }

    // 3) Sample syllabus
    const syllabusTitle = 'Mathematics 101 - Introductory Syllabus';
    const syllabusExists = await Syllabus.findOne({ title: syllabusTitle });
    if (!syllabusExists) {
      await Syllabus.create({
        course: 'MATH-101',
        title: syllabusTitle,
        description: 'Foundational topics in Algebra and Calculus.',
        content: 'Algebra basics, Functions, Limits, Derivatives, Integrals',
        topics: [
          { title: 'Algebra Basics', description: 'Variables, equations, factoring', duration: '2 weeks' },
          { title: 'Calculus I', description: 'Limits and derivatives', duration: '3 weeks' }
        ],
        learningOutcomes: [
          'Understand basic algebraic manipulation',
          'Compute derivatives of simple functions'
        ],
        assessmentMethods: [
          { type: 'quiz', weightage: 20, description: 'Weekly quizzes' },
          { type: 'midterm', weightage: 30, description: 'Midterm exam' },
          { type: 'final', weightage: 50, description: 'Final exam' }
        ],
        textbooks: [
          { title: 'Calculus Made Easy', author: 'Thompson', edition: 'Latest', isbn: '0000000000', isRequired: true }
        ],
        references: [
          { title: 'Khan Academy - Calculus', author: 'Khan Academy', url: 'https://khanacademy.org' }
        ],
        academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        createdBy: admin._id,
        isActive: true
      });
      console.log('Sample syllabus created');
    } else {
      console.log('Sample syllabus exists');
    }

    console.log('Seeding completed.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
