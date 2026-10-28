const express = require("express");
const router = express.Router();
const { getComplaints, createComplaint } = require("../controllers/complaintController");
const { protect, farmerOnly } = require("../middleware/auth");

router.get("/", protect, getComplaints);
router.post("/", protect, farmerOnly, createComplaint);

module.exports = router;
