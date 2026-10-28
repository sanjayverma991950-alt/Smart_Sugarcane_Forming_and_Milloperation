const User = require("../models/User");
const Field = require("../models/Field");
const Ticket = require("../models/Ticket");
const Delivery = require("../models/Delivery");
const Payment = require("../models/Payment");

// @desc    Get Current Farmer Profile
// @route   GET /api/farmers/me
// @access  Private (Farmer)
const getProfile = async (req, res, next) => {
  try {
    const farmer = await User.findById(req.user.id);
    res.json({ success: true, farmer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Permitted Farmer Profile Details
// @route   PATCH /api/farmers/me
// @access  Private (Farmer)
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, village, district, state, address, preferredLanguage } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (village !== undefined) updates.village = village;
    if (district !== undefined) updates.district = district;
    if (state !== undefined) updates.state = state;
    if (address !== undefined) updates.address = address;
    if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;

    const farmer = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, farmer });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all registered farmers
// @route   GET /api/admin/farmers
// @access  Private (Admin)
const getFarmersList = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const query = { role: "farmer" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const farmers = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      farmers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get single farmer full details and statistics
// @route   GET /api/admin/farmers/:id
// @access  Private (Admin)
const getFarmerById = async (req, res, next) => {
  try {
    const farmer = await User.findOne({ _id: req.params.id, role: "farmer" });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const fields = await Field.find({ farmer: farmer._id });
    const tickets = await Ticket.find({ farmer: farmer._id }).populate("season field");
    const deliveries = await Delivery.find({ farmer: farmer._id }).populate("season ticket");
    const payments = await Payment.find({ farmer: farmer._id }).populate("season");

    res.json({
      success: true,
      farmer,
      fields,
      tickets,
      deliveries,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getFarmersList,
  getFarmerById,
};
