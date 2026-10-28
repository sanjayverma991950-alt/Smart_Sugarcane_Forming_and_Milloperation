const mongoose = require("mongoose");

const cropDiseaseReportSchema = new mongoose.Schema(
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
    imagePath: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
    detectedDisease: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    possibleConditions: [
      {
        name: String,
        confidence: Number,
        description: String,
      },
    ],
    symptoms: [
      {
        type: String,
      },
    ],
    recommendedActions: [
      {
        type: String,
      },
    ],
    disclaimer: {
      type: String,
      default:
        "Preliminary AI guidance only, not a confirmed diagnosis. For chemical treatments or severe infestations, please consult your local Krishi Vigyan Kendra (KVK) or agricultural extension officer.",
    },
    status: {
      type: String,
      enum: ["analyzed", "failed"],
      default: "analyzed",
    },
    aiProvider: {
      type: String,
      default: "AgroCane AI Vision Engine",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CropDiseaseReport", cropDiseaseReportSchema);
