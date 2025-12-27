const User = require("../models/User");
const Exam = require("../models/Exam");
const Hall = require("../models/Hall");
const HallTicket = require("../models/HallTicket");

exports.generateSeating = async (examId, hallId) => {
  try {
    // Get exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Get hall details
    const hall = await Hall.findById(hallId);
    if (!hall) {
      throw new Error("Hall not found");
    }

    // Get all issued hall tickets for this exam
    const hallTickets = await HallTicket.find({
      exam: examId,
      status: "issued",
      isActive: true,
    }).populate("student", "name rollNumber department semester course");

    if (hallTickets.length === 0) {
      throw new Error("No hall tickets issued for this exam. Please issue hall tickets first.");
    }

    console.log(`Found ${hallTickets.length} issued hall tickets for exam ${exam.title}`);

    // Check if students exceed hall capacity
    if (hallTickets.length > hall.capacity) {
      console.warn(`Warning: ${hallTickets.length} students exceed hall capacity of ${hall.capacity}`);
    }

    // Sort hall tickets by student roll number for consistent ordering
    const sortedTickets = hallTickets.sort((a, b) => {
      const rollA = a.student?.rollNumber || "";
      const rollB = b.student?.rollNumber || "";
      return rollA.localeCompare(rollB);
    });

    // Generate seating arrangements sequentially
    const arrangements = [];
    let seatNumber = 1;
    const columnsPerRow = 10; // 10 seats per row

    for (const ticket of sortedTickets) {
      if (seatNumber > hall.capacity) {
        console.warn(`Seat ${seatNumber} exceeds hall capacity, stopping allocation`);
        break;
      }

      const student = ticket.student;
      const row = Math.ceil(seatNumber / columnsPerRow);
      const column = ((seatNumber - 1) % columnsPerRow) + 1;
      const seatLabel = `${String.fromCharCode(64 + row)}${column}`; // A1, A2, ... B1, B2

      arrangements.push({
        student: student._id,
        studentName: student.name,
        studentRollNumber: student.rollNumber || "N/A",
        class: student.course || student.department || `Semester ${student.semester}` || "General",
        seatNumber: seatLabel,
        row,
        column,
      });

      // Update the HallTicket with the assigned seat number
      ticket.seatNumber = seatLabel;
      await ticket.save();

      seatNumber++;
    }

    console.log(`Generated ${arrangements.length} seating arrangements for ${exam.title}`);
    return arrangements;
  } catch (error) {
    console.error("Error generating seating:", error);
    throw error;
  }
};

// Legacy functions kept for compatibility
exports.generateClassSeating = async (students, hallCapacity, startSeatNumber, classKey) => {
  const arrangements = [];
  let seatNumber = startSeatNumber;
  const columnsPerRow = 10;

  const sortedStudents = students.sort((a, b) => {
    if (a.rollNumber && b.rollNumber) {
      return a.rollNumber.localeCompare(b.rollNumber);
    }
    return a.name.localeCompare(b.name);
  });

  for (const student of sortedStudents) {
    if (seatNumber > hallCapacity) break;
    
    const row = Math.ceil(seatNumber / columnsPerRow);
    const column = ((seatNumber - 1) % columnsPerRow) + 1;

    arrangements.push({
      student: student._id,
      studentName: student.name,
      studentRollNumber: student.rollNumber,
      class: classKey,
      seatNumber: `${String.fromCharCode(64 + row)}${column}`,
      row,
      column,
    });

    seatNumber++;
  }

  return {
    arrangements,
    nextSeatNumber: seatNumber,
  };
};

exports.splitStudentsIntoGroups = (students, maxGroupSize) => {
  const groups = [];
  const totalStudents = students.length;

  if (totalStudents <= maxGroupSize) {
    return [students];
  }

  const sortedStudents = students.sort((a, b) => {
    if (a.rollNumber && b.rollNumber) {
      return a.rollNumber.localeCompare(b.rollNumber);
    }
    return a.name.localeCompare(b.name);
  });

  const numGroups = Math.ceil(totalStudents / maxGroupSize);
  for (let i = 0; i < numGroups; i++) {
    const startIndex = i * maxGroupSize;
    const endIndex = Math.min(startIndex + maxGroupSize, totalStudents);
    groups.push(sortedStudents.slice(startIndex, endIndex));
  }

  return groups;
};
