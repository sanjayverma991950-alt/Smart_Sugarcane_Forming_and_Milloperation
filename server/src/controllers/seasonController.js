const CrushingSeason = require("../models/CrushingSeason");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Get all crushing seasons
// @route   GET /api/seasons
// @access  Public / Private
const getSeasons = async (req, res, next) => {
  try {
    const seasons = await CrushingSeason.find().sort({ createdAt: -1 });
    res.json({ success: true, seasons });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently active crushing season
// @route   GET /api/seasons/current
// @access  Public / Private
const getCurrentSeason = async (req, res, next) => {
  try {
    let season = await CrushingSeason.findOne({ status: "active" });
    if (!season) {
      season = await CrushingSeason.findOne({ status: "planned" }).sort({ tentativeStartDate: 1 });
    }
    res.json({ success: true, season });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create crushing season
// @route   POST /api/admin/seasons
// @access  Private (Admin)
const createSeason = async (req, res, next) => {
  try {
    const { name, tentativeStartDate, confirmedStartDate, expectedEndDate, status, notes } = req.body;

    const season = await CrushingSeason.create({
      name,
      tentativeStartDate,
      confirmedStartDate,
      expectedEndDate,
      status: status || "planned",
      notes,
    });

    res.status(201).json({ success: true, season });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update crushing season
// @route   PATCH /api/admin/seasons/:id
// @access  Private (Admin)
const updateSeason = async (req, res, next) => {
  try {
    const { tentativeStartDate, confirmedStartDate, expectedEndDate, status, notes, updatedReason } = req.body;

    const season = await CrushingSeason.findById(req.params.id);
    if (!season) {
      return res.status(404).json({ message: "Crushing season not found" });
    }

    const datesChanged =
      (confirmedStartDate && new Date(confirmedStartDate).getTime() !== new Date(season.confirmedStartDate || 0).getTime()) ||
      (status && status !== season.status);

    season.tentativeStartDate = tentativeStartDate || season.tentativeStartDate;
    season.confirmedStartDate = confirmedStartDate || season.confirmedStartDate;
    season.expectedEndDate = expectedEndDate || season.expectedEndDate;
    if (status) season.status = status;
    if (notes) season.notes = notes;
    if (updatedReason) season.updatedReason = updatedReason;

    await season.save();

    // If dates or status changed, notify active farmers
    if (datesChanged) {
      const farmers = await User.find({ role: "farmer", status: "active" }).select("_id");
      const notifications = farmers.map((f) => ({
        recipient: f._id,
        title: `Crushing Season Update: ${season.name}`,
        message: `Season dates or status have been updated to ${season.status}. ${updatedReason || ""}`,
        type: "season",
        relatedEntity: "season",
        relatedId: season._id,
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.json({ success: true, season });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSeasons,
  getCurrentSeason,
  createSeason,
  updateSeason,
};
