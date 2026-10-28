const mongoose = require("mongoose");

const weatherAdvisorySchema = new mongoose.Schema(
  {
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
    locationName: {
      type: String,
      required: true,
    },
    latitude: Number,
    longitude: Number,
    forecastSummary: {
      temperature: Number,
      rainfallMm: Number,
      windSpeedKmh: Number,
      weatherCode: Number,
      description: String,
    },
    alertType: {
      type: String,
      enum: ["heavy_rain", "heatwave", "frost", "high_wind", "irrigation_favorable", "normal"],
      default: "normal",
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },
    message: {
      type: String,
      required: true,
    },
    suggestedActions: [
      {
        type: String,
      },
    ],
    deduplicationKey: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WeatherAdvisory", weatherAdvisorySchema);
