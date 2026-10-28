const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

// @desc    Get payments (Farmer gets own, Admin gets all)
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === "farmer") {
      query.farmer = req.user.id;
    } else {
      if (req.query.farmer) query.farmer = req.query.farmer;
      if (req.query.status) query.status = req.query.status;
      if (req.query.season) query.season = req.query.season;
    }

    const payments = await Payment.find(query)
      .populate("farmer", "name mobile farmerId village")
      .populate("season", "name")
      .populate("deliveries", "receiptNumber netWeightTonnes acceptedQuantityTonnes totalAmount")
      .populate("recordedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment summary (Total payable, total paid, balance)
// @route   GET /api/payments/summary
// @access  Private
const getPaymentSummary = async (req, res, next) => {
  try {
    const match = {};
    if (req.user.role === "farmer") {
      match.farmer = req.user._id;
    }

    const summary = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalPayable: { $sum: "$netPayable" },
          totalPaid: { $sum: "$amountPaid" },
          outstanding: { $sum: "$balanceDue" },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = summary[0] || {
      totalPayable: 0,
      totalPaid: 0,
      outstanding: 0,
      count: 0,
    };

    res.json({ success: true, summary: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Record payment disbursed to farmer
// @route   POST /api/admin/payments/:id/disburse
// @access  Private (Admin)
const recordPaymentDisbursement = async (req, res, next) => {
  try {
    const { amount, paymentMethod, paymentReference, notes } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    const paidIncrement = Number(amount);
    if (paidIncrement <= 0) {
      return res.status(400).json({ message: "Disbursed amount must be greater than zero" });
    }

    payment.amountPaid = Number((payment.amountPaid + paidIncrement).toFixed(2));
    payment.balanceDue = Math.max(0, Number((payment.netPayable - payment.amountPaid).toFixed(2)));

    if (payment.balanceDue === 0) {
      payment.status = "Paid";
    } else {
      payment.status = "Partially Paid";
    }

    payment.paymentDate = new Date();
    payment.paymentMethod = paymentMethod || payment.paymentMethod;
    payment.paymentReference = paymentReference || payment.paymentReference;
    payment.notes = notes || payment.notes;

    await payment.save();

    // Notify farmer
    await Notification.create({
      recipient: payment.farmer,
      title: `Payment Disbursed: ₹${paidIncrement.toLocaleString("en-IN")}`,
      message: `A payment of ₹${paidIncrement.toLocaleString("en-IN")} has been recorded via ${payment.paymentMethod}. Remaining balance: ₹${payment.balanceDue.toLocaleString("en-IN")}. Ref: ${paymentReference || "N/A"}`,
      type: "payment",
      relatedEntity: "payment",
      relatedId: payment._id,
    });

    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Verify / Update Payment Status
// @route   PATCH /api/admin/payments/:id/verify
// @access  Private (Admin)
const verifyPayment = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (status) payment.status = status;
    if (notes) payment.notes = notes;

    await payment.save();
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentSummary,
  recordPaymentDisbursement,
  verifyPayment,
};
