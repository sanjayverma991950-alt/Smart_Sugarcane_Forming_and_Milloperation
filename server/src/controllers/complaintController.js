const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");

const generateComplaintNumber = async () => {
  const count = await Complaint.countDocuments();
  const year = new Date().getFullYear();
  return `CMP-${year}-${String(count + 1).padStart(4, "0")}`;
};

// @desc    Get complaints (Farmer gets own, Admin gets all)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === "farmer") {
      query.farmer = req.user.id;
    } else {
      if (req.query.status) query.status = req.query.status;
      if (req.query.category) query.category = req.query.category;
    }

    const complaints = await Complaint.find(query)
      .populate("farmer", "name mobile farmerId village")
      .populate("resolvedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Farmer: Submit a complaint or support query
// @route   POST /api/complaints
// @access  Private (Farmer)
const createComplaint = async (req, res, next) => {
  try {
    const { category, subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: "Subject and description are required" });
    }

    const complaintNumber = await generateComplaintNumber();

    const complaint = await Complaint.create({
      complaintNumber,
      farmer: req.user.id,
      category: category || "Other",
      subject,
      description,
      status: "Submitted",
    });

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Review & respond to a complaint
// @route   PATCH /api/admin/complaints/:id
// @access  Private (Admin)
const updateComplaint = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (adminResponse) complaint.adminResponse = adminResponse;

    if (status === "Resolved" || status === "Closed") {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user.id;
    }

    await complaint.save();

    // Notify farmer
    await Notification.create({
      recipient: complaint.farmer,
      title: `Complaint ${complaint.complaintNumber} Updated`,
      message: `Your complaint regarding "${complaint.subject}" has been marked as ${complaint.status}. Response: ${adminResponse || "Reviewed by administrator."}`,
      type: "info",
      relatedEntity: "complaint",
      relatedId: complaint._id,
    });

    res.json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaint,
};
