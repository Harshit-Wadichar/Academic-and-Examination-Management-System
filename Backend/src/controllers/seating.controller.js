const SeatingArrangement = require("../models/SeatingArrangement");
const seatingAlgorithmService = require("../services/seating-algorithm.service");

exports.createSeatingArrangement = async (req, res) => {
  try {
    const { examId, hall } = req.body;
    const arrangements = await seatingAlgorithmService.generateSeating(
      examId,
      hall
    );
    const seating = new SeatingArrangement({
      exam: examId,
      hall,
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
      .populate("createdBy", "name");
    res.status(200).json({ success: true, data: seatings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentSeating = async (req, res) => {
  try {
    const studentId = req.user.id;
    const seatings = await SeatingArrangement.find({
      "arrangements.student": studentId,
    }).populate({
      path: "exam",
      populate: {
        path: "course",
      },
    });

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
          instructions: seating.instructions,
        };
      })
      .filter((arr) => arr.seatNumber);

    res.status(200).json({ success: true, data: studentArrangements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeatingById = async (req, res) => {
  try {
    const seating = await SeatingArrangement.findById(req.params.id)
      .populate("exam")
      .populate("arrangements.student", "name rollNumber");
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
    const seating = await SeatingArrangement.findByIdAndDelete(req.params.id);
    if (!seating) {
      return res
        .status(404)
        .json({ success: false, message: "Seating arrangement not found" });
    }
    res.status(200).json({
      success: true,
      message: "Seating arrangement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
