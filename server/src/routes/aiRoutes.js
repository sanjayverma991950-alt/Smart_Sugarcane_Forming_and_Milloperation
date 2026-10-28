const express = require("express");
const router = express.Router();
const {
  agriculturalAssistant,
  voiceChat,
  cropDiseaseAnalyze,
  cropDiseaseHistory,
  getCropDiseaseReportById,
  generateSupplyPrediction,
  getSupplyPredictions,
  getAiConfig,
  updateAiConfig,
} = require("../controllers/aiController");
const { protect, farmerOnly, adminOnly, optionalProtect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// AI Status & Configuration
router.get("/config", getAiConfig);
router.post("/config", updateAiConfig);

// Text Agricultural Assistant (Public/Farmer with optional token for account records)
router.post("/agricultural-assistant", optionalProtect, agriculturalAssistant);

// Voice Assistant (Farmer only, authenticated to access their real data)
router.post("/voice/chat", protect, farmerOnly, voiceChat);

// Crop Disease Detection (Farmer only)
router.post(
  "/crop-disease/analyze",
  protect,
  farmerOnly,
  upload.single("image"),
  cropDiseaseAnalyze
);
router.get("/crop-disease/history", protect, farmerOnly, cropDiseaseHistory);
router.get("/crop-disease/:id", protect, getCropDiseaseReportById);

// AI Sugarcane Supply Prediction (Admin only)
router.post("/supply-prediction/generate", protect, adminOnly, generateSupplyPrediction);
router.get("/supply-prediction", protect, adminOnly, getSupplyPredictions);

module.exports = router;
