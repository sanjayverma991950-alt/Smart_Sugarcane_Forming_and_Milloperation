const mongoose = require("mongoose");

const crushingSeasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Season name (e.g., 2025-2026) is required"],
      unique: true,
      trim: true,
    },
    tentativeStartDate: {
      type: Date,
      required: true,
    },
    confirmedStartDate: {
      type: Date,
    },
    expectedEndDate: {
      type: Date,
      required: true,
    },
    actualEndDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["planned", "active", "completed", "cancelled"],
      default: "planned",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    updatedReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CrushingSeason", crushingSeasonSchema);
