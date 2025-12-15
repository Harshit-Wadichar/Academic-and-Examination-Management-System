const mongoose = require('mongoose');

const hallTicketSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true,
    },
    hall: {
      type: String,
      required: true,
      trim: true,
    },
    seatNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['issued', 'revoked'],
      default: 'issued',
      index: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

hallTicketSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('HallTicket', hallTicketSchema);
