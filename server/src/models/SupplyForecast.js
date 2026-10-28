const mongoose = require("mongoose");

const supplyForecastSchema = new mongoose.Schema(
  {
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrushingSeason",
      required: true,
      index: true,
    },
    periodType: {
      type: String,
      enum: ["daily", "weekly", "seasonal"],
      default: "seasonal",
    },
    forecastPeriodStart: {
      type: Date,
      required: true,
    },
    forecastPeriodEnd: {
      type: Date,
      required: true,
    },
    predictedQuantityTonnes: {
      type: Number,
      required: true,
    },
    lowerBoundTonnes: {
      type: Number,
      required: true,
    },
    upperBoundTonnes: {
      type: Number,
      required: true,
    },
    modelName: {
      type: String,
      default: "AgroCane Yield & Trend Estimator v1.2",
    },
    inputDataSummary: {
      totalRegisteredFields: Number,
      totalCultivatedAreaAcres: Number,
      historicalDeliveriesCount: Number,
      activeFarmersCount: Number,
    },
    warnings: [
      {
        type: String,
      },
    ],
    actualQuantityTonnes: {
      type: Number,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplyForecast", supplyForecastSchema);
