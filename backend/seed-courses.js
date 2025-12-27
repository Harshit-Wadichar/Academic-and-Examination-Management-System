const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("./src/models/Course");

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const courses = [
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
        courseCode: "CS301",
        courseName: "Database Management Systems",
        department: "Computer Science",
        semester: 5,
        credits: 4,
        description: "Database design, SQL, and management systems",
      },
      // Semester 6 Computer Science Courses
      {
        courseCode: "CS601",
        courseName: "Software Engineering",
        department: "Computer Science",
        semester: 6,
        credits: 4,
        description: "Software development lifecycle, design patterns, and best practices",
      },
      {
        courseCode: "CS602",
        courseName: "Computer Networks",
        department: "Computer Science",
        semester: 6,
        credits: 4,
        description: "Network protocols, architectures, and communication systems",
      },
      {
        courseCode: "CS603",
        courseName: "Operating Systems",
        department: "Computer Science",
        semester: 6,
        credits: 4,
        description: "Process management, memory management, and file systems",
      },
      {
        courseCode: "CS604",
        courseName: "Machine Learning",
        department: "Computer Science",
        semester: 6,
        credits: 4,
        description: "Supervised and unsupervised learning algorithms and applications",
      },
      {
        courseCode: "CS605",
        courseName: "Web Technologies",
        department: "Computer Science",
        semester: 6,
        credits: 3,
        description: "Modern web development frameworks and technologies",
      },
      {
        courseCode: "IT101",
        courseName: "Information Technology Fundamentals",
        department: "Information Technology",
        semester: 1,
        credits: 3,
        description: "Basic concepts of information technology",
      },
      {
        courseCode: "IT201",
        courseName: "Web Development",
        department: "Information Technology",
        semester: 3,
        credits: 4,
        description: "HTML, CSS, JavaScript, and modern web frameworks",
      },
    ];

    for (const courseData of courses) {
      const existingCourse = await Course.findOne({
        courseCode: courseData.courseCode,
      });
      if (!existingCourse) {
        await Course.create(courseData);
        console.log(`Created course: ${courseData.courseCode}`);
      } else {
        console.log(`Course ${courseData.courseCode} already exists`);
      }
    }

    console.log("Course seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
