const ProcurementRate = require("../models/ProcurementRate");

// @desc    Get procurement rates
// @route   GET /api/rates
// @access  Public / Private
const getRates = async (req, res, next) => {
  try {
    const rates = await ProcurementRate.find()
      .populate("season", "name status")
      .sort({ effectiveDate: -1 });
    res.json({ success: true, rates });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Set new procurement rate
// @route   POST /api/admin/rates
// @access  Private (Admin)
const setRate = async (req, res, next) => {
  try {
    const { seasonId, variety, ratePerTonne, effectiveDate } = req.body;

    if (!seasonId || !ratePerTonne) {
      return res.status(400).json({ message: "Season and rate per tonne are required" });
    }

    // Set any previous active rate for this season & variety to superseded
    await ProcurementRate.updateMany(
      { season: seasonId, variety: variety || "General / Standard", status: "active" },
      { status: "superseded" }
    );

    const rate = await ProcurementRate.create({
      season: seasonId,
      variety: variety || "General / Standard",
      ratePerTonne: Number(ratePerTonne),
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      status: "active",
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, rate });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRates,
  setRate,
};
