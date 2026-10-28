const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/farmerController");
const { protect, farmerOnly } = require("../middleware/auth");

router.get("/me", protect, farmerOnly, getProfile);
router.patch("/me", protect, farmerOnly, updateProfile);

module.exports = router;
