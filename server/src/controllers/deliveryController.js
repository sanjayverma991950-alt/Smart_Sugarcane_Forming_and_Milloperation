const Delivery = require("../models/Delivery");
const Ticket = require("../models/Ticket");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

const generateDeliveryReceipt = async () => {
  const count = await Delivery.countDocuments();
  const year = new Date().getFullYear();
  return `DLV-${year}-${String(count + 1).padStart(4, "0")}`;
};

// @desc    Get deliveries (Farmer gets own, Admin gets all)
// @route   GET /api/deliveries
// @access  Private
const getDeliveries = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === "farmer") {
      query.farmer = req.user.id;
    } else {
      if (req.query.farmer) query.farmer = req.query.farmer;
      if (req.query.ticket) query.ticket = req.query.ticket;
    }

    const deliveries = await Delivery.find(query)
      .populate("farmer", "name mobile farmerId village")
      .populate("ticket", "ticketNumber allocatedQuantityTonnes suppliedQuantityTonnes")
      .populate("season", "name")
      .populate("recordedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, deliveries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
const getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("farmer", "name mobile farmerId village")
      .populate("ticket")
      .populate("season")
      .populate("recordedBy", "name");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery record not found" });
    }

    if (req.user.role === "farmer" && delivery.farmer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden: You cannot view this delivery record" });
    }

    res.json({ success: true, delivery });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Record verified weighment & delivery
// @route   POST /api/admin/deliveries
// @access  Private (Admin)
const recordDelivery = async (req, res, next) => {
  try {
    const {
      ticketId,
      vehicleNumber,
      grossWeightTonnes,
      tareWeightTonnes,
      ratePerTonne,
      deductions = 0,
      qualityNotes,
    } = req.body;

    const gross = Number(grossWeightTonnes);
    const tare = Number(tareWeightTonnes);
    const rate = Number(ratePerTonne);
    const ded = Number(deductions);

    if (gross <= tare) {
      return res.status(400).json({ message: "Gross weight must be strictly greater than tare weight" });
    }

    const netWeight = Number((gross - tare).toFixed(3));
    const acceptedQuantity = Math.max(0, Number((netWeight - ded).toFixed(3)));
    const totalAmount = Math.round(acceptedQuantity * rate);

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Associated ticket not found" });
    }

    const receiptNumber = await generateDeliveryReceipt();

    const delivery = await Delivery.create({
      receiptNumber,
      ticket: ticket._id,
      farmer: ticket.farmer,
      season: ticket.season,
      deliveryDate: new Date(),
      vehicleNumber: vehicleNumber || "NA",
      grossWeightTonnes: gross,
      tareWeightTonnes: tare,
      netWeightTonnes: netWeight,
      acceptedQuantityTonnes: acceptedQuantity,
      ratePerTonne: rate,
      deductions: ded,
      totalAmount,
      qualityNotes,
      status: "verified",
      recordedBy: req.user.id,
    });

    // Update ticket supplied quantity & status
    ticket.suppliedQuantityTonnes = Number(
      (ticket.suppliedQuantityTonnes + acceptedQuantity).toFixed(3)
    );
    if (ticket.suppliedQuantityTonnes >= ticket.allocatedQuantityTonnes) {
      ticket.status = "Completed";
    } else {
      ticket.status = "Partially Supplied";
    }
    await ticket.save();

    // Auto-create/update payment calculation for this farmer & season
    let payment = await Payment.findOne({
      farmer: ticket.farmer,
      season: ticket.season,
      status: { $in: ["Calculated", "Awaiting Approval", "Partially Paid", "Approved"] },
    });

    if (payment) {
      payment.deliveries.push(delivery._id);
      payment.grossAmount += totalAmount;
      payment.netPayable += totalAmount;
      payment.balanceDue += totalAmount;
      await payment.save();
    } else {
      const paymentCount = await Payment.countDocuments();
      const payNumber = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(4, "0")}`;
      await Payment.create({
        paymentNumber: payNumber,
        farmer: ticket.farmer,
        season: ticket.season,
        ticket: ticket._id,
        deliveries: [delivery._id],
        grossAmount: totalAmount,
        deductions: 0,
        netPayable: totalAmount,
        amountPaid: 0,
        balanceDue: totalAmount,
        status: "Calculated",
        recordedBy: req.user.id,
      });
    }

    // Send notification to farmer
    await Notification.create({
      recipient: ticket.farmer,
      title: `Weighment Recorded: ${receiptNumber}`,
      message: `Verified net sugarcane: ${acceptedQuantity} tonnes. Amount payable: ₹${totalAmount.toLocaleString("en-IN")}.`,
      type: "delivery",
      relatedEntity: "delivery",
      relatedId: delivery._id,
    });

    res.status(201).json({ success: true, delivery });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeliveries,
  getDeliveryById,
  recordDelivery,
};
