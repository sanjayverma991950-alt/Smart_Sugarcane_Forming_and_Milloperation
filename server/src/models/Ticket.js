const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrushingSeason",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    allocatedQuantityTonnes: {
      type: Number,
      required: true,
      min: [0.1, "Allocated quantity must be greater than 0"],
    },
    suppliedQuantityTonnes: {
      type: Number,
      default: 0,
      min: [0, "Supplied quantity cannot be negative"],
    },
    deliverySlot: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending Review",
        "Approved",
        "Released",
        "Partially Supplied",
        "Completed",
        "Expired",
        "Rejected",
        "Cancelled",
      ],
      default: "Pending Review",
      index: true,
    },
    requestNotes: {
      type: String,
      trim: true,
    },
    reviewReason: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
