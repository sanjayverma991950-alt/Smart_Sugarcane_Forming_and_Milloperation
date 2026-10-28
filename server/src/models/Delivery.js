const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrushingSeason",
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    grossWeightTonnes: {
      type: Number,
      required: true,
      min: 0,
    },
    tareWeightTonnes: {
      type: Number,
      required: true,
      min: 0,
    },
    netWeightTonnes: {
      type: Number,
      required: true,
      min: 0,
    },
    acceptedQuantityTonnes: {
      type: Number,
      required: true,
      min: 0,
    },
    ratePerTonne: {
      type: Number,
      required: true,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    qualityNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["verified", "pending", "rejected"],
      default: "verified",
      index: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);
