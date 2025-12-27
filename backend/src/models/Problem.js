const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ["club", "seating", "other"],
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Problems are routed to specific roles based on category
    assignedToRole: {
      type: String,
      enum: ["club_coordinator", "seating_manager", "admin"],
    },
    response: {
      type: String,
      trim: true,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-assign role based on category before saving
problemSchema.pre("save", function (next) {
  if (this.isNew) {
    switch (this.category) {
      case "club":
        this.assignedToRole = "club_coordinator";
        break;
      case "seating":
        this.assignedToRole = "seating_manager";
        break;
      default:
        this.assignedToRole = "admin";
    }
  }
  next();
});

// Index for efficient queries
problemSchema.index({ category: 1, status: 1 });
problemSchema.index({ assignedToRole: 1, status: 1 });
problemSchema.index({ submittedBy: 1 });

module.exports = mongoose.model("Problem", problemSchema);
