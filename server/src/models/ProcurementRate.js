const mongoose = require("mongoose");

const procurementRateSchema = new mongoose.Schema(
  {
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrushingSeason",
      required: true,
    },
    variety: {
      type: String,
      default: "General / Standard",
      trim: true,
    },
    ratePerTonne: {
      type: Number,
      required: true,
      min: [0, "Rate must be positive"],
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "superseded"],
      default: "active",
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

module.exports = mongoose.model("ProcurementRate", procurementRateSchema);
