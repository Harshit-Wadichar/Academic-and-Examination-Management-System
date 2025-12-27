const SeatingArrangement = require("../models/SeatingArrangement");
const seatingAlgorithmService = require("../services/seating-algorithm.service");
const pdfService = require("../services/pdf.service");

const HallTicket = require("../models/HallTicket");

exports.createSeatingArrangement = async (req, res) => {
  try {
    const { examId, hallId } = req.body;

    // Check if any hall tickets are issued for this exam
    const ticketCount = await HallTicket.countDocuments({ exam: examId, status: 'issued' });
    
    if (ticketCount === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot generate seating: No hall tickets issued for this exam." 
      });
    }

    const arrangements = await seatingAlgorithmService.generateSeating(
      examId,
      hallId
    );
    const seating = new SeatingArrangement({
      exam: examId,
      hall: hallId,
      arrangements,
      createdBy: req.user.id,
    });
    await seating.save();
    res.status(201).json({ success: true, data: seating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeatingArrangements = async (req, res) => {
  try {
    const seatings = await SeatingArrangement.find()
      .populate("exam")
      .populate("hall", "name capacity")
      .populate("createdBy", "name");
    res.status(200).json({ success: true, data: seatings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeatingById = async (req, res) => {
  try {
    const seating = await SeatingArrangement.findById(req.params.id)
      .populate("exam")
      .populate("hall", "name capacity location")
      .populate("createdBy", "name")
      .populate("arrangements.student", "name rollNumber");

    if (!seating) {
      return res.status(404).json({
        success: false,
        message: "Seating arrangement not found",
      });
    }

    res.status(200).json({ success: true, data: seating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentSeating = async (req, res) => {
  try {
    const studentId = req.user.id;
    const seatings = await SeatingArrangement.find({
      "arrangements.student": studentId,
    })
      .populate({
        path: "exam",
        populate: {
          path: "course",
        },
      })
      .populate("hall", "name capacity location");

    // Filter arrangements for this student
    const studentArrangements = seatings
      .map((seating) => {
        const studentArrangement = seating.arrangements.find(
          (arr) => arr.student.toString() === studentId
        );
        return {
          _id: seating._id,
          exam: seating.exam,
          hall: seating.hall,
          seatNumber: studentArrangement?.seatNumber,
          row: studentArrangement?.row,
          column: studentArrangement?.column,
          class: studentArrangement?.class,
          instructions: seating.instructions,
        };
      })
      .filter((arr) => arr.seatNumber);

    res.status(200).json({ success: true, data: studentArrangements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSeatingArrangement = async (req, res) => {
  try {
    const seating = await SeatingArrangement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!seating) {
      return res
        .status(404)
        .json({ success: false, message: "Seating arrangement not found" });
    }
    res.status(200).json({ success: true, data: seating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.finalizeSeating = async (req, res) => {
  try {
    const seating = await SeatingArrangement.findByIdAndUpdate(
      req.params.id,
      { status: "Finalized" },
      { new: true }
    );
    if (!seating) {
      return res
        .status(404)
        .json({ success: false, message: "Seating arrangement not found" });
    }
    res.status(200).json({ success: true, data: seating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSeatingArrangement = async (req, res) => {
  try {
    console.log("Backend: Received delete request for ID:", req.params.id);
    const seating = await SeatingArrangement.findByIdAndDelete(req.params.id);
    if (!seating) {
      console.log("Backend: Seating not found for ID:", req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Seating arrangement not found" });
    }
    console.log("Backend: Successfully deleted seating:", req.params.id);
    res.status(200).json({
      success: true,
      message: "Seating arrangement deleted successfully",
    });
  } catch (error) {
    console.error("Backend: Error deleting seating:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadSeatingArrangement = async (req, res) => {
  try {
    console.log("BACKEND DOWNLOAD REQUEST ID:", req.params.id); // Debug Log
    const seating = await SeatingArrangement.findById(req.params.id)
      .populate("exam")
      .populate("hall", "name capacity location")
      .populate("arrangements.student", "name rollNumber email");

    if (!seating) {
      console.log("BACKEND: Seating ID not found");
      return res
        .status(404)
        .json({ success: false, message: "Seating arrangement not found" });
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generateSeatingArrangement(seating);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=seating.pdf`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error downloading seating arrangement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to download seating arrangement",
    });
  }
};
