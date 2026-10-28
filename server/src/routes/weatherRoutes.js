const express = require("express");
const router = express.Router();
const { getWeatherForecast, getWeatherAdvisories } = require("../controllers/aiController");
const { protect, farmerOnly } = require("../middleware/auth");

router.get("/forecast", protect, getWeatherForecast);
router.get("/advisories", protect, farmerOnly, getWeatherAdvisories);

module.exports = router;
