const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const CrushingSeason = require("../models/CrushingSeason");

const generateTicketNumber = async () => {
  const count = await Ticket.countDocuments();
  const year = new Date().getFullYear();
  return `TCK-${year}-${String(count + 1).padStart(4, "0")}`;
};

// @desc    Get tickets (Farmer gets own, Admin gets all with filters)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === "farmer") {
      query.farmer = req.user.id;
    } else {
      if (req.query.farmer) query.farmer = req.query.farmer;
      if (req.query.status) query.status = req.query.status;
      if (req.query.season) query.season = req.query.season;
    }

    const tickets = await Ticket.find(query)
      .populate("farmer", "name mobile farmerId village")
      .populate("field", "name village area areaUnit variety")
      .populate("season", "name status")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("farmer", "name mobile farmerId village")
      .populate("field")
      .populate("season")
      .populate("approvedBy", "name");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "farmer" && ticket.farmer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden: You cannot view this ticket" });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Farmer: Submit a new ticket request
// @route   POST /api/tickets
// @access  Private (Farmer)
const createTicketRequest = async (req, res, next) => {
  try {
    const { fieldId, seasonId, allocatedQuantityTonnes, deliverySlot, requestNotes } = req.body;

    if (!seasonId || !allocatedQuantityTonnes) {
      return res.status(400).json({ message: "Season and requested quantity are required" });
    }

    const season = await CrushingSeason.findById(seasonId);
    if (!season || (season.status !== "active" && season.status !== "planned")) {
      return res.status(400).json({ message: "Cannot request ticket for an inactive or completed season" });
    }

    const ticketNumber = await generateTicketNumber();

    // Default expiry is 15 days from validFrom
    const validFrom = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(validFrom.getDate() + 15);

    const ticket = await Ticket.create({
      ticketNumber,
      farmer: req.user.id,
      field: fieldId || undefined,
      season: seasonId,
      issueDate: new Date(),
      validFrom,
      expiryDate,
      allocatedQuantityTonnes: Number(allocatedQuantityTonnes),
      suppliedQuantityTonnes: 0,
      deliverySlot: deliverySlot || "Morning Slot (08:00 - 14:00)",
      status: "Pending Review",
      requestNotes,
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Review ticket (Approve / Reject)
// @route   PATCH /api/admin/tickets/:id/review
// @access  Private (Admin)
const reviewTicket = async (req, res, next) => {
  try {
    const { status, reviewReason, allocatedQuantityTonnes, expiryDate } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Approved or Rejected" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    ticket.reviewReason = reviewReason || "";
    ticket.approvedBy = req.user.id;
    ticket.reviewedAt = new Date();

    if (allocatedQuantityTonnes) {
      ticket.allocatedQuantityTonnes = Number(allocatedQuantityTonnes);
    }
    if (expiryDate) {
      ticket.expiryDate = new Date(expiryDate);
    }

    await ticket.save();

    // Notify farmer
    await Notification.create({
      recipient: ticket.farmer,
      title: `Ticket ${ticket.ticketNumber} ${status}`,
      message:
        status === "Approved"
          ? `Your sugarcane supply ticket for ${ticket.allocatedQuantityTonnes} tonnes has been approved.`
          : `Your ticket request was rejected. Reason: ${reviewReason || "Allocation limits exceeded."}`,
      type: "ticket",
      relatedEntity: "ticket",
      relatedId: ticket._id,
    });

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update ticket status (Released, Completed, Cancelled)
// @route   PATCH /api/admin/tickets/:id/status
// @access  Private (Admin)
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicketRequest,
  reviewTicket,
  updateTicketStatus,
};
