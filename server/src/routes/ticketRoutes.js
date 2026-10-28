const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicketRequest,
} = require("../controllers/ticketController");
const { protect, farmerOnly } = require("../middleware/auth");

router.get("/", protect, getTickets);
router.post("/", protect, farmerOnly, createTicketRequest);
router.get("/:id", protect, getTicketById);

module.exports = router;
