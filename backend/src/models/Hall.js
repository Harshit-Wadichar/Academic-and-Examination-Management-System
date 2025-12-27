const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hall name is required"],
      trim: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, "Hall capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    location: {
      type: String,
      required: [true, "Hall location is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
hallSchema.index({ location: 1 });
hallSchema.index({ isActive: 1 });

module.exports = mongoose.model("Hall", hallSchema);
