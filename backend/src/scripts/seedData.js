/*
  Seed script to bootstrap initial data for development/testing.
  - Creates users for all roles: Admin, Student, Seating Manager, Club Coordinator
  - Creates sample courses
  - Creates a few sample exams
  - Creates a sample syllabus

  Usage:
    NODE_ENV=development node src/scripts/seedData.js
  or
    npm run seed

  Required env:
    MONGODB_URI
*/

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const { USER_ROLES } = require('../config/constants');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Syllabus = require('../models/Syllabus');
const Course = require('../models/Course');

const USERS_TO_SEED = [
  {
    name: 'System Administrator',
    email: 'admin@example.com',
    password: 'Admin@12345',
    role: USER_ROLES.ADMIN,
    department: 'Examination'
  },
  {
    name: 'John Student',
    email: 'student@example.com',
    password: 'Student@12345',
    role: USER_ROLES.STUDENT,
    rollNumber: 'CS2023001',
    department: 'Computer Science',
    semester: 3,
    phone: '1234567890'
  },
  {
    name: 'Sarah Seating',
    email: 'seating@example.com',
    password: 'Seating@12345',
    role: USER_ROLES.SEATING_MANAGER,
    department: 'Administration'
  },
  {
    name: 'Mike Club',
    email: 'club@example.com',
    password: 'Club@12345',
    role: USER_ROLES.CLUB_COORDINATOR,
    department: 'Student Affairs'
  }
];

const COURSES_TO_SEED = [
  {
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    department: "Computer Science",
    semester: 1,
    credits: 4,
    description: "Basic concepts of computer science and programming",
  },
  {
    courseCode: "CS201",
    courseName: "Data Structures and Algorithms",
    department: "Computer Science",
    semester: 3,
    credits: 4,
    description: "Fundamental data structures and algorithm design",
  },
  {
    courseCode: "MATH-101",
    courseName: "Mathematics 101",
    department: "Mathematics",
    semester: 1,
    credits: 3,
    description: "Algebra and Calculus basics",
  }
];

(async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured');
    }

    await connectDB();
    console.log('Connected to MongoDB');

    // 1) Seed Users
    for (const u of USERS_TO_SEED) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        // Manually hash if creating via create (or rely on pre-save if logic handles it)
        // The model has pre-save hook, so passing plain password works if it's considered 'modified'
        await User.create(u);
        console.log(`Created user: ${u.email} (${u.role})`);
      } else {
        console.log(`User exists: ${u.email}`);
      }
    }

    // 2) Seed Courses
    const createdCourses = [];
    for (const c of COURSES_TO_SEED) {
      let course = await Course.findOne({ courseCode: c.courseCode });
      if (!course) {
        course = await Course.create(c);
        console.log(`Created course: ${c.courseCode}`);
      } else {
        console.log(`Course exists: ${c.courseCode}`);
      }
      createdCourses.push(course);
    }

    // Enroll student in CS201
    const studentUser = await User.findOne({ email: 'student@example.com' });
    const cs201 = createdCourses.find(c => c.courseCode === 'CS201');
    if (studentUser && cs201 && !studentUser.enrolledCourses.includes(cs201._id)) {
      studentUser.enrolledCourses.push(cs201._id);
      await studentUser.save();
      console.log('Enrolled student in CS201');
    }

    // 3) Seed Exams
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    // Find MATH-101 course
    const mathCourse = createdCourses.find(c => c.courseCode === 'MATH-101');

    if (mathCourse) {
      const sampleExam = {
        title: 'Midterm Mathematics',
        course: mathCourse._id, // Use ID reference
        date: inTwoDays,
        startTime: '10:00',
        endTime: '12:00',
        duration: 120,
        totalMarks: 100,
        hall: 'Main Hall - A1',
        instructions: 'Bring your ID card.',
        status: 'upcoming',
        createdBy: adminUser._id,
        isActive: true
      };

      const examExists = await Exam.findOne({ title: sampleExam.title });
      if (!examExists) {
        await Exam.create(sampleExam);
        console.log(`Exam created: ${sampleExam.title}`);
      } else {
        console.log(`Exam exists: ${sampleExam.title}`);
      }
    }

    console.log('Seeding completed successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
