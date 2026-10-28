const express = require("express");
const router = express.Router();
const { getPayments, getPaymentSummary } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getPayments);
router.get("/summary", protect, getPaymentSummary);

module.exports = router;
