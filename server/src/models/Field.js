const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Field name or ID is required"],
      trim: true,
    },
    village: {
      type: String,
      required: [true, "Village / location is required"],
      trim: true,
    },
    area: {
      type: Number,
      required: [true, "Area is required"],
      min: [0.01, "Area must be greater than 0"],
    },
    areaUnit: {
      type: String,
      enum: ["acre", "hectare"],
      default: "acre",
    },
    variety: {
      type: String,
      trim: true,
      default: "",
    },
    cropType: {
      type: String,
      enum: ["plant", "ratoon"],
      default: "plant",
    },
    plantingDate: {
      type: Date,
    },
    expectedHarvestDate: {
      type: Date,
    },
    actualHarvestDate: {
      type: Date,
    },
    expectedProductionTonnes: {
      type: Number,
      min: [0, "Expected production cannot be negative"],
    },
    soilType: {
      type: String,
      enum: ["", "loam", "clay", "sandy", "silt", "other"],
      default: "",
    },
    irrigationMethod: {
      type: String,
      enum: ["", "flood", "furrow", "drip", "sprinkler", "rainfed"],
      default: "",
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Field", fieldSchema);
