const express = require("express");
const router = express.Router();
const { getSeasons, getCurrentSeason } = require("../controllers/seasonController");

router.get("/", getSeasons);
router.get("/current", getCurrentSeason);

module.exports = router;
