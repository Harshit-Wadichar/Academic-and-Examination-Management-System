const User = require("../models/User");
const Exam = require("../models/Exam");

exports.generateSeating = async (examId, hall) => {
  try {
    // Get exam details
    const exam = await Exam.findById(examId).populate("course");
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Get students enrolled in the course
    const students = await User.find({
      role: "student",
      courses: exam.course._id,
    });

    // TODO: Implement actual seating algorithm
    // For now, simple random assignment
    const arrangements = [];
    const seatsPerRow = 10; // Assume 10 seats per row
    let seatNumber = 1;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const row = Math.floor((seatNumber - 1) / seatsPerRow) + 1;
      const column = ((seatNumber - 1) % seatsPerRow) + 1;

      arrangements.push({
        student: student._id,
        seatNumber: seatNumber.toString(),
        row,
        column,
      });

      seatNumber++;
    }

    return arrangements;
  } catch (error) {
    console.error("Error generating seating:", error);
    throw error;
  }
};

exports.optimizeSeating = (arrangements) => {
  // TODO: Implement optimization algorithm
  // For now, return as is
  return arrangements;
};
