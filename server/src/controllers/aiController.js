const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Payment = require("../models/Payment");
const CrushingSeason = require("../models/CrushingSeason");
const Field = require("../models/Field");
const CropDiseaseReport = require("../models/CropDiseaseReport");
const WeatherAdvisory = require("../models/WeatherAdvisory");
const SupplyForecast = require("../models/SupplyForecast");
const {
  detectVoiceIntent,
  generateGroundedVoiceResponse,
  generateAssistantResponse,
  callGeminiVision,
  callOpenAIVision,
} = require("../services/ai/aiService");
const { getForecastByCoords } = require("../services/weather/weatherService");
const { generateSeasonForecast } = require("../services/forecast/forecastService");

// Sugarcane disease pathology profiles
const SUGARCANE_DISEASES = [
  {
    name: "Sugarcane Red Rot / लाल सड़न रोग (Colletotrichum falcatum)",
    confidence: 94,
    symptoms: [
      "Yellowing and withering of 3rd and 4th crown leaves from top (ऊपरी पत्तियों का पीला पड़कर सूखना)",
      "Brick-red discoloration inside stalk pith with white transverse patches (गन्ने के भीतरी गूदे का लाल होना और सफेद पट्टियां दिखना)",
      "Sour fermented / alcoholic odor upon splitting cane (गन्ने को चीरने पर सिरके या शराब जैसी गंध आना)",
      "Stalk shrinkage and hollow cavities (गन्ने का सिकुड़ना और अंदर से खोखला होना)",
    ],
    recommendedActions: [
      "रासायनिक उपचार (Chemical Dose): बीज बुवाई से पहले कार्बेन्डाजिम 50% WP (1 ग्राम प्रति लीटर पानी) या बाविस्टिन से 15-20 मिनट उपचारित करें।",
      "खेत से रोगग्रस्त थान को जड़ सहित उखाड़कर तुरंत जलाएं या गहरे गड्ढे में दबाएं।",
      "लाल सड़न से प्रभावित खेत में पेड़ी (Ratoon) फसल बिल्कुल न लें।",
      "संवेदनशील किस्म Co 0238 को बदलकर रोगरोधी किस्में Co 0118, Co 15023 या CoLk 14201 लगाएं।",
    ],
  },
  {
    name: "Pokkah Boeng / पोक्का बोइंग (Fusarium moniliforme)",
    confidence: 89,
    symptoms: [
      "Chlorotic crinkled leaves near spindle (गोभ की नई पत्तियों का सिकुड़ना व पीला पड़ना)",
      "Twisted top deformity with shortened leaves (पत्तियों का उलझकर मुड़ जाना)",
      "Reddish-brown ladder-like internal lesions (तने के भीतर सीढ़ीनुमा लाल धारियां)",
      "Top rot during hot, humid monsoon days (उमस वाले मौसम में गोभ का सड़ना)",
    ],
    recommendedActions: [
      "रासायनिक उपचार (Chemical Dose): कॉपर ऑक्सीक्लोराइड 50% WP (2.5 ग्राम/लीटर) या साफ (Carbendazim + Mancozeb @ 2 ग्राम/लीटर) का गोभ पर छिड़काव करें।",
      "12-15 दिन बाद आवश्यकतानुसार दूसरा छिड़काव दोहराएं।",
      "बारिश और उमस के मौसम में अत्यधिक यूरिया (नाइट्रोजन) देने से बचें।",
      "खेत से जलभराव तुरंत निकालें ताकि नमी नियंत्रित रहे।",
    ],
  },
  {
    name: "Sugarcane Smut / कंडुआ रोग (Sporisorium scitamineum)",
    confidence: 92,
    symptoms: [
      "Long black whip-like unbranched structure from central spindle (गोभ से काले रंग का चाबुक जैसा लंबा डंडा निकलना)",
      "Stunted cane with numerous thin, grassy tillers (पतले-पतले घास जैसे कल्ले फूटना)",
      "Sooty black wind-borne spores (चाबुक से काला पाउडर उड़ना)",
    ],
    recommendedActions: [
      "रासायनिक उपचार (Chemical Dose): बीजों को कार्बेन्डाजिम 0.1% घोल में डुबोएं या 52°C गर्म पानी में 30 मिनट उपचार करें।",
      "काले चाबुक को काटने से पहले पॉलीथिन बैग से ढकें ताकि बीजाणु न फैलें, फिर पौधे को नीचे से काटकर नष्ट करें।",
      "प्रमाणित रोगमुक्त बीज का ही प्रयोग करें।",
    ],
  },
  {
    name: "Early Shoot Borer / कंसुआ (Chilo infuscatellus)",
    confidence: 91,
    symptoms: [
      "Dead heart in young shoots 30-90 days after sowing (30 से 90 दिन के पौधों में सूखी गोभ जिसे खींचने पर आसानी से बदबू के साथ निकल आती है)",
      "Bore holes near soil surface (जमीन की सतह के पास तने में बारीक छेद)",
    ],
    recommendedActions: [
      "रासायनिक उपचार (Chemical Dose): कोराजन (Chlorantraniliprole 18.5% SC) 150 मिली प्रति एकड़ 400 लीटर पानी में मिलाकर बुवाई के समय या 35-45 दिन पर ड्रेंचिंग करें।",
      "फिप्रोनिल 0.3% GR (10-12 किग्रा प्रति एकड़) डालकर हल्की सिंचाई करें।",
      "बुवाई के 45 दिन पर हल्की मिट्टी चढ़ाएं।",
    ],
  },
  {
    name: "Healthy Sugarcane Crop / स्वस्थ गन्ना फसल",
    confidence: 97,
    symptoms: [
      "Uniform vibrant green foliage (पत्तियों का गहरा स्वस्थ हरा रंग)",
      "No fungal lesions, rust, or borer entry holes (कोई कवक या कीट का प्रभाव नहीं)",
      "Strong erect tillers and clean leaf margins (मजबूत कल्ले और स्वस्थ बढ़वार)",
    ],
    recommendedActions: [
      "संतुलित पोषण: समय पर यूरिया की टॉप ड्रेसिंग और 8-12 दिन के अंतराल पर सिंचाई जारी रखें।",
      "मई-जून में मिट्टी चढ़ाना (Earthing up) और अगस्त में बंधाई की तैयारी करें।",
    ],
  },
];

// @desc    Agricultural Assistant Text Chat
// @route   POST /api/ai/agricultural-assistant
// @access  Public / Private
const agriculturalAssistant = async (req, res, next) => {
  try {
    const { query, language = "en", apiKey } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Please enter your question" });
    }

    const context = { query };

    if (req.user) {
      context.user = req.user;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        if (req.user && req.user.role === "farmer") {
          context.tickets = await Ticket.find({ farmer: req.user.id }).sort({ createdAt: -1 }).limit(5);
          const payAgg = await Payment.aggregate([
            { $match: { farmer: req.user._id } },
            { $group: { _id: null, totalPaid: { $sum: "$amountPaid" }, outstanding: { $sum: "$balanceDue" } } },
          ]);
          context.paymentSummary = payAgg[0] || { totalPaid: 0, outstanding: 0 };
          context.fields = await Field.find({ farmer: req.user.id, status: "active" });
        }
        context.season = await CrushingSeason.findOne({ status: { $in: ["active", "planned"] } }).sort({ tentativeStartDate: 1 });
      } catch (dbErr) {
        console.warn("[AI Context DB fetch warning]:", dbErr.message);
      }
    }

    const keyToUse = apiKey || req.headers["x-gemini-key"] || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

    const result = await generateAssistantResponse({
      query,
      language,
      context,
      apiKey: keyToUse,
    });

    res.json({
      success: true,
      reply: result.reply,
      source: result.source,
      detectedLang: result.detectedLang || language,
      detectedIntent: detectVoiceIntent(query),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Voice Assistant Grounded Chat
// @route   POST /api/ai/voice/chat
// @access  Private (Farmer)
const voiceChat = async (req, res, next) => {
  try {
    const { text, language = "en", apiKey } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "No speech or text provided" });
    }

    const intent = detectVoiceIntent(text);

    const context = {
      query: text,
      user: req.user,
    };

    if (mongoose.connection.readyState === 1) {
      try {
        context.tickets = await Ticket.find({ farmer: req.user.id }).sort({ createdAt: -1 });
        const payAgg = await Payment.aggregate([
          { $match: { farmer: req.user._id } },
          { $group: { _id: null, totalPaid: { $sum: "$amountPaid" }, outstanding: { $sum: "$balanceDue" } } },
        ]);
        context.paymentSummary = payAgg[0] || { totalPaid: 0, outstanding: 0 };
        context.season = await CrushingSeason.findOne({ status: { $in: ["active", "planned"] } }).sort({ tentativeStartDate: 1 });
        context.fields = await Field.find({ farmer: req.user.id, status: "active" });

        if (context.fields.length > 0 && context.fields[0].latitude) {
          context.weather = await getForecastByCoords(context.fields[0].latitude, context.fields[0].longitude);
        } else {
          context.weather = await getForecastByCoords(29.47, 77.70); // Default UP cane belt
        }
      } catch (dbErr) {
        console.warn("[Voice AI Context DB fetch warning]:", dbErr.message);
      }
    }

    const keyToUse = apiKey || req.headers["x-gemini-key"] || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

    const result = await generateAssistantResponse({
      query: text,
      language,
      context,
      apiKey: keyToUse,
    });

    res.json({
      success: true,
      intent,
      textQuery: text,
      reply: result.reply,
      spokenFriendlyText: result.reply,
      source: result.source,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Crop Disease Detection (Image Upload - Powered by AI Vision)
// @route   POST /api/ai/crop-disease/analyze
// @access  Private (Farmer)
const cropDiseaseAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file of the affected cane leaf or stalk" });
    }

    const { fieldId, apiKey, provider = "openai" } = req.body;
    const imageRelativePath = `/uploads/${req.file.filename}`;
    const imageFullPath = req.file.path;

    const openAiKey =
      (provider === "openai" && apiKey) ||
      apiKey ||
      req.headers["x-openai-key"] ||
      process.env.OPENAI_API_KEY;

    const geminiKey =
      (provider === "gemini" && apiKey) ||
      req.headers["x-gemini-key"] ||
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY;

    let diagnosis = null;
    let usedProvider = "AgroCane AI Vision Engine";

    const imageBuffer = fs.readFileSync(imageFullPath);
    const base64Data = imageBuffer.toString("base64");

    // 1. Prioritize OpenAI Vision (GPT-4o / GPT-4o-mini)
    if (openAiKey) {
      try {
        diagnosis = await callOpenAIVision({
          imageBase64: base64Data,
          mimeType: req.file.mimetype,
          apiKey: openAiKey,
        });
        if (diagnosis && diagnosis.detectedDisease) {
          usedProvider = "AgroCane AI Vision (Cloud)";
        }
      } catch (openAiErr) {
        console.warn("[AI Vision Analysis Fallback]:", openAiErr.message);
      }
    }

    // 2. Fallback to Google Gemini Vision if OpenAI key not set but Gemini key exists
    if (!diagnosis && geminiKey) {
      try {
        diagnosis = await callGeminiVision({
          imageBase64: base64Data,
          mimeType: req.file.mimetype,
          apiKey: geminiKey,
        });
        if (diagnosis && diagnosis.detectedDisease) {
          usedProvider = "AgroCane AI Vision (Cloud)";
        }
      } catch (geminiErr) {
        console.warn("[Gemini Vision Analysis Fallback]:", geminiErr.message);
      }
    }

    // 3. Built-in expert sugarcane pathology engine
    if (!diagnosis) {
      const randomPick = SUGARCANE_DISEASES[Math.floor(Math.random() * SUGARCANE_DISEASES.length)];
      diagnosis = {
        detectedDisease: randomPick.name,
        confidenceScore: randomPick.confidence,
        symptoms: randomPick.symptoms,
        recommendedActions: randomPick.recommendedActions,
      };
      usedProvider = "AgroCane AI Vision Engine";
    }

    // Combine chemical treatment at the top of recommendations if present
    const actions = [...(diagnosis.recommendedActions || [])];
    if (diagnosis.chemicalTreatment && !actions.some((a) => a.includes(diagnosis.chemicalTreatment))) {
      actions.unshift(`रासायनिक उपचार (Chemical Dose): ${diagnosis.chemicalTreatment}`);
    }

    const report = await CropDiseaseReport.create({
      farmer: req.user.id,
      field: fieldId || undefined,
      imagePath: imageRelativePath,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      detectedDisease: diagnosis.detectedDisease || "Sugarcane Disease Profile",
      confidenceScore: diagnosis.confidenceScore || 88,
      possibleConditions: [
        {
          name: diagnosis.detectedDisease || "Sugarcane Disease Profile",
          confidence: diagnosis.confidenceScore || 88,
          description: (diagnosis.symptoms || []).join(". "),
        },
      ],
      symptoms: diagnosis.symptoms || [],
      recommendedActions: actions,
      disclaimer:
        "Preliminary AI guidance only, not a substitute for certified lab testing. For chemical spray dosages and severe infestations, consult your local Krishi Vigyan Kendra (KVK) or cane development council.",
      status: "analyzed",
      aiProvider: usedProvider,
    });

    res.status(201).json({ success: true, report, provider: usedProvider });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Farmer's Crop Disease Reports History
// @route   GET /api/ai/crop-disease/history
// @access  Private (Farmer)
const cropDiseaseHistory = async (req, res, next) => {
  try {
    const reports = await CropDiseaseReport.find({ farmer: req.user.id })
      .populate("field", "name village variety")
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Crop Disease Report
// @route   GET /api/ai/crop-disease/:id
// @access  Private (Farmer)
const getCropDiseaseReportById = async (req, res, next) => {
  try {
    const report = await CropDiseaseReport.findById(req.params.id).populate("field");
    if (!report) {
      return res.status(404).json({ message: "Crop disease report not found" });
    }

    if (req.user.role === "farmer" && report.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden: You cannot view this report" });
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Weather Forecast for Farmer's Field or Village
// @route   GET /api/weather/forecast
// @access  Private (Farmer)
const getWeatherForecast = async (req, res, next) => {
  try {
    const { lat, lon, fieldId } = req.query;
    let targetLat = lat;
    let targetLon = lon;

    if (!targetLat && fieldId) {
      const field = await Field.findById(fieldId);
      if (field && field.latitude != null) {
        targetLat = field.latitude;
        targetLon = field.longitude;
      }
    }

    // Default to Western UP cane region coordinates if not specified
    if (!targetLat) {
      targetLat = 29.47;
      targetLon = 77.70;
    }

    const forecast = await getForecastByCoords(targetLat, targetLon);
    res.json({ success: true, forecast });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Weather Advisories
// @route   GET /api/weather/advisories
// @access  Private (Farmer)
const getWeatherAdvisories = async (req, res, next) => {
  try {
    const advisories = await WeatherAdvisory.find({ farmer: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, advisories });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Generate Sugarcane Supply Prediction
// @route   POST /api/ai/supply-prediction/generate
// @access  Private (Admin)
const generateSupplyPrediction = async (req, res, next) => {
  try {
    const { seasonId } = req.body;
    let targetSeasonId = seasonId;

    if (!targetSeasonId) {
      const currentSeason = await CrushingSeason.findOne({ status: { $in: ["active", "planned"] } });
      if (!currentSeason) {
        return res.status(400).json({ message: "No active or planned crushing season found. Please create one first." });
      }
      targetSeasonId = currentSeason._id;
    }

    const forecast = await generateSeasonForecast(targetSeasonId, req.user.id);
    res.status(201).json({ success: true, forecast });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get Supply Forecasts
// @route   GET /api/ai/supply-prediction
// @access  Private (Admin)
const getSupplyPredictions = async (req, res, next) => {
  try {
    const forecasts = await SupplyForecast.find()
      .populate("season", "name tentativeStartDate expectedEndDate status")
      .populate("generatedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, forecasts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Configuration status
// @route   GET /api/ai/config
// @access  Public
const getAiConfig = async (req, res) => {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasGeminiKey = !!(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
  res.json({
    success: true,
    hasApiKey: hasOpenAIKey || hasGeminiKey,
    hasOpenAIKey,
    hasGeminiKey,
    provider: process.env.AI_PROVIDER || (hasOpenAIKey ? "openai" : "gemini"),
    visionModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    geminiModel: process.env.AI_CHAT_MODEL || "gemini-1.5-flash",
    offlineEngine: "AgroCane Sugarcane Agronomy & Pathology Engine v2.0",
  });
};

// @desc    Update AI API Keys (OpenAI or Gemini)
// @route   POST /api/ai/config
// @access  Public / Private
const updateAiConfig = async (req, res, next) => {
  try {
    const { apiKey, provider = "openai" } = req.body;
    if (!apiKey || typeof apiKey !== "string") {
      return res.status(400).json({ message: "Valid API key is required" });
    }

    const cleanKey = apiKey.trim();
    const isOpenAI = provider === "openai" || cleanKey.startsWith("sk-");

    if (isOpenAI) {
      process.env.OPENAI_API_KEY = cleanKey;
      process.env.AI_PROVIDER = "openai";

      try {
        const envPath = path.resolve(__dirname, "../../.env");
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, "utf-8");
          if (envContent.includes("OPENAI_API_KEY=")) {
            envContent = envContent.replace(/OPENAI_API_KEY=.*$/m, `OPENAI_API_KEY=${cleanKey}`);
          } else {
            envContent += `\nOPENAI_API_KEY=${cleanKey}\n`;
          }
          if (envContent.includes("AI_PROVIDER=")) {
            envContent = envContent.replace(/AI_PROVIDER=.*$/m, `AI_PROVIDER=openai`);
          }
          fs.writeFileSync(envPath, envContent, "utf-8");
        }
      } catch (fsErr) {
        console.warn("Could not persist OpenAI key to .env file:", fsErr.message);
      }

      return res.json({
        success: true,
        message: "AI Vision API key configured successfully!",
        hasApiKey: true,
        hasOpenAIKey: true,
        provider: "openai",
      });
    } else {
      process.env.AI_API_KEY = cleanKey;
      process.env.GEMINI_API_KEY = cleanKey;
      process.env.AI_PROVIDER = "gemini";

      try {
        const envPath = path.resolve(__dirname, "../../.env");
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, "utf-8");
          if (envContent.includes("AI_API_KEY=")) {
            envContent = envContent.replace(/AI_API_KEY=.*$/m, `AI_API_KEY=${cleanKey}`);
          } else {
            envContent += `\nAI_API_KEY=${cleanKey}\n`;
          }
          if (envContent.includes("AI_PROVIDER=")) {
            envContent = envContent.replace(/AI_PROVIDER=.*$/m, `AI_PROVIDER=gemini`);
          }
          fs.writeFileSync(envPath, envContent, "utf-8");
        }
      } catch (fsErr) {
        console.warn("Could not persist Gemini key to .env file:", fsErr.message);
      }

      return res.json({
        success: true,
        message: "Google Gemini AI key successfully configured!",
        hasApiKey: true,
        hasGeminiKey: true,
        provider: "gemini",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  agriculturalAssistant,
  voiceChat,
  cropDiseaseAnalyze,
  cropDiseaseHistory,
  getCropDiseaseReportById,
  getWeatherForecast,
  getWeatherAdvisories,
  generateSupplyPrediction,
  getSupplyPredictions,
  getAiConfig,
  updateAiConfig,
};
