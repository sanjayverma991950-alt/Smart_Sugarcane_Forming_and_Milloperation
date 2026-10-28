const express = require("express");
const router = express.Router();
const { getDeliveries, getDeliveryById } = require("../controllers/deliveryController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getDeliveries);
router.get("/:id", protect, getDeliveryById);

module.exports = router;
