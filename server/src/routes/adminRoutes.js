const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getReports,
  getAuditLogs,
} = require("../controllers/adminController");
const { getFarmersList, getFarmerById } = require("../controllers/farmerController");
const { createSeason, updateSeason } = require("../controllers/seasonController");
const { reviewTicket, updateTicketStatus } = require("../controllers/ticketController");
const { recordDelivery } = require("../controllers/deliveryController");
const { recordPaymentDisbursement, verifyPayment } = require("../controllers/paymentController");
const { setRate } = require("../controllers/rateController");
const { createAnnouncement } = require("../controllers/announcementController");
const { updateComplaint } = require("../controllers/complaintController");
const { protect, adminOnly } = require("../middleware/auth");

// All routes in this router require Admin authorization
router.use(protect, adminOnly);

// Operational Dashboard & Analytics
router.get("/dashboard", getDashboardStats);
router.get("/reports", getReports);
router.get("/audit-logs", getAuditLogs);

// Farmers Management
router.get("/farmers", getFarmersList);
router.get("/farmers/:id", getFarmerById);

// Crushing Seasons Management
router.post("/seasons", createSeason);
router.patch("/seasons/:id", updateSeason);

// Ticket Management
router.patch("/tickets/:id/review", reviewTicket);
router.patch("/tickets/:id/status", updateTicketStatus);

// Delivery & Weighment
router.post("/deliveries", recordDelivery);

// Payments Management
router.post("/payments/:id/disburse", recordPaymentDisbursement);
router.patch("/payments/:id/verify", verifyPayment);

// Procurement Rates
router.post("/rates", setRate);

// Announcements
router.post("/announcements", createAnnouncement);

// Complaints Resolution
router.patch("/complaints/:id", updateComplaint);

module.exports = router;
