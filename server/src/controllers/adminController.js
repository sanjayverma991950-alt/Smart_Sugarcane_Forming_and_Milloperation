const User = require("../models/User");
const Field = require("../models/Field");
const Ticket = require("../models/Ticket");
const Delivery = require("../models/Delivery");
const Payment = require("../models/Payment");
const CrushingSeason = require("../models/CrushingSeason");
const Complaint = require("../models/Complaint");
const AuditLog = require("../models/AuditLog");

// @desc    Admin Dashboard Overview Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalFarmers = await User.countDocuments({ role: "farmer" });
    const activeFarmers = await User.countDocuments({ role: "farmer", status: "active" });

    const activeFields = await Field.find({ status: "active" });
    const totalFields = activeFields.length;
    const totalCultivatedAreaAcres = activeFields.reduce((sum, f) => {
      const area = f.areaUnit === "hectare" ? f.area * 2.47105 : f.area;
      return sum + area;
    }, 0);

    const activeSeason = await CrushingSeason.findOne({ status: "active" });

    const pendingTickets = await Ticket.countDocuments({ status: "Pending Review" });
    const approvedTickets = await Ticket.countDocuments({
      status: { $in: ["Approved", "Released", "Partially Supplied"] },
    });

    const deliveriesAggregate = await Delivery.aggregate([
      { $match: { status: "verified" } },
      {
        $group: {
          _id: null,
          totalSuppliedTonnes: { $sum: "$acceptedQuantityTonnes" },
          totalDeliveries: { $sum: 1 },
        },
      },
    ]);

    const totalSuppliedTonnes = deliveriesAggregate[0]?.totalSuppliedTonnes || 0;

    const paymentsAggregate = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPayable: { $sum: "$netPayable" },
          totalPaid: { $sum: "$amountPaid" },
          outstanding: { $sum: "$balanceDue" },
        },
      },
    ]);

    const financialSummary = paymentsAggregate[0] || {
      totalPayable: 0,
      totalPaid: 0,
      outstanding: 0,
    };

    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ["Submitted", "Under Review"] },
    });

    const recentDeliveries = await Delivery.find()
      .populate("farmer", "name mobile farmerId")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTickets = await Ticket.find()
      .populate("farmer", "name mobile farmerId")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalFarmers,
        activeFarmers,
        totalFields,
        totalCultivatedAreaAcres: Number(totalCultivatedAreaAcres.toFixed(2)),
        activeSeason: activeSeason ? activeSeason.name : "None",
        pendingTickets,
        approvedTickets,
        totalSuppliedTonnes: Number(totalSuppliedTonnes.toFixed(2)),
        ...financialSummary,
        pendingComplaints,
      },
      recentDeliveries,
      recentTickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Financial & Operations Reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res, next) => {
  try {
    // Procurement trend by day
    const procurementTrend = await Delivery.aggregate([
      { $match: { status: "verified" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveryDate" } },
          totalTonnes: { $sum: "$acceptedQuantityTonnes" },
          totalAmount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Variety distribution in fields
    const varietyBreakdown = await Field.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$variety",
          count: { $sum: 1 },
          totalArea: { $sum: "$area" },
        },
      },
    ]);

    // Payment status breakdown
    const paymentStatusBreakdown = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$netPayable" },
        },
      },
    ]);

    res.json({
      success: true,
      procurementTrend: procurementTrend.map((p) => ({
        date: p._id,
        tonnes: Number(p.totalTonnes.toFixed(2)),
        amount: p.totalAmount,
        deliveriesCount: p.count,
      })),
      varietyBreakdown: varietyBreakdown.map((v) => ({
        variety: v._id || "Unspecified",
        count: v.count,
        area: Number(v.totalArea.toFixed(2)),
      })),
      paymentStatusBreakdown: paymentStatusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
        totalAmount: s.totalAmount,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getReports,
  getAuditLogs,
};
