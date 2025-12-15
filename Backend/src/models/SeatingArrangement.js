const mongoose = require("mongoose");

const seatingArrangementSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    hall: {
      type: String,
      required: true,
    },
    arrangements: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        seatNumber: {
          type: String,
          required: true,
        },
        row: {
          type: Number,
          required: true,
        },
        column: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Finalized"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SeatingArrangement", seatingArrangementSchema);
