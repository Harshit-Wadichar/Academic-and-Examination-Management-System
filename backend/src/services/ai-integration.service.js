const axios = require("axios");

exports.generateMindMap = async (syllabusText, daysRemaining = null, examDate = null) => {
  try {
    // TODO: Integrate with Python AI service
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/generate-mindmap`,
      {
        syllabus_text: syllabusText,
        days_remaining: daysRemaining,
        exam_date: examDate
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating mind map:", error);
    // Fallback: simple text processing
    return exports.simpleMindMapGeneration(syllabusText);
  }
};

const User = require("../models/User");
const HallTicket = require("../models/HallTicket");
const Exam = require("../models/Exam");
const Syllabus = require("../models/Syllabus");
const Course = require("../models/Course");

exports.getSuggestions = async (studentId) => {
  try {
    // 1. Fetch Student Data
    const student = await User.findById(studentId);
    if (!student) throw new Error("Student not found");

    // 2. Fetch Active Hall Tickets & Exams
    const hallTickets = await HallTicket.find({ 
        student: studentId, 
        status: "issued", 
        isActive: true 
    }).populate('exam');

    const upcomingExams = [];
    const syllabusFocusAreas = [];
    const today = new Date();

    for (const ticket of hallTickets) {
        if (!ticket.exam) continue;
        
        const examDate = new Date(ticket.exam.date);
        if (examDate >= today) {
             const diffTime = Math.abs(examDate - today);
             const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
             
             upcomingExams.push({
                 course: ticket.exam.course,
                 date: ticket.exam.date,
                 days_remaining: daysRemaining,
                 total_marks: ticket.exam.totalMarks
             });

             // 3. Fetch Syllabus for this exam's course
             // We try to find a syllabus matching the course name
             const syllabus = await Syllabus.findOne({ 
                 course: ticket.exam.course,
                 isActive: true 
             });

             if (syllabus) {
                 syllabusFocusAreas.push({
                     course: ticket.exam.course,
                     topics: syllabus.topics ? syllabus.topics.map(t => t.title) : [],
                     content_summary: syllabus.description || "Review all units."
                 });
             }
        }
    }

    // Prepare payload for Python AI
    const payload = {
        student_id: studentId,
        department: student.department || "General",
        current_semester: student.semester || 1,
        upcoming_exams: upcomingExams,
        syllabus_focus_areas: syllabusFocusAreas,
        // Mocking grades/attendance for now as they might be in a separate collection or not fully implemented
        grades: [], 
        attendance: 85 // Default good attendance
    };

    // TODO: Integrate with Python AI service
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/get-suggestions`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error getting suggestions:", error.message);
    if (error.response) {
        console.error("Python Service Response:", error.response.data);
    }
    // Fallback: simple suggestions
    return this.simpleSuggestions({ grades: [], attendance: 85 });
  }
};

exports.simpleMindMapGeneration = (text) => {
  // Simple implementation: split text into topics
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  const topics = lines.slice(0, 20); // Limit to 20 nodes to prevent overcrowding

  const nodes = [
    {
       id: "root",
       label: "Syllabus Overview",
       level: 0,
       content: "Central Topic",
       type: "input"
    },
    ...topics.map((topic, index) => ({
      id: `node-${index + 1}`,
      label: topic.trim().substring(0, 50) + (topic.length > 50 ? "..." : ""),
      level: 1,
      content: topic,
      type: "default",
    }))
  ];

  const edges = topics.map((_, index) => ({
    id: `edge-${index}`,
    source: "root",
    target: `node-${index + 1}`,
    type: "smoothstep",
    animated: true,
  }));

  return {
    mindmap: {
      nodes,
      edges,
    },
    analysis: {
      complexity: { complexity_level: "medium" },
      suggestions: ["Review these topics systematically.", "Focus on key concepts."],
    },
  };
};

exports.simpleSuggestions = (data) => {
  // Simple implementation: basic advice based on grades
  const gradeMap = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0 };
  
  let scores = [];
  if (data.grades && data.grades.length > 0) {
      if (typeof data.grades[0] === 'object') {
          scores = data.grades.map(g => gradeMap[g.grade] || 5);
      } else {
          scores = data.grades; // Assume numbers if not objects
      }
  }
  
  const avgGrade = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

  if (avgGrade >= 8.5) {
    return ["Excellent performance! Keep it up.", "Consider advanced topics."];
  } else if (avgGrade >= 7.0) {
    return ["Good performance.", "Focus on weak areas to improve further."];
  } else {
    return ["Consider seeking additional help in challenging subjects.", "Create a daily study schedule."];
  }
};
