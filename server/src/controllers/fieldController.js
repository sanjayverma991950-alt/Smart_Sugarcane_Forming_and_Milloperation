const Field = require("../models/Field");

// @desc    Get fields (Farmer gets own fields, Admin gets all)
// @route   GET /api/fields
// @access  Private
const getFields = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === "farmer") {
      query.farmer = req.user.id;
    } else if (req.query.farmer) {
      query.farmer = req.query.farmer;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const fields = await Field.find(query)
      .populate("farmer", "name mobile farmerId village")
      .sort({ createdAt: -1 });

    res.json({ success: true, fields });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single field by ID
// @route   GET /api/fields/:id
// @access  Private
const getFieldById = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id).populate(
      "farmer",
      "name mobile farmerId village"
    );

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Authorization: Farmer can only access their own field
    if (req.user.role === "farmer" && field.farmer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden: You do not own this field" });
    }

    res.json({ success: true, field });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new field
// @route   POST /api/fields
// @access  Private (Farmer)
const createField = async (req, res, next) => {
  try {
    const fieldData = {
      ...req.body,
      farmer: req.user.id,
      status: "active",
    };

    const field = await Field.create(fieldData);
    res.status(201).json({ success: true, field });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a field
// @route   PATCH /api/fields/:id
// @access  Private
const updateField = async (req, res, next) => {
  try {
    let field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Farmer ownership check
    if (req.user.role === "farmer" && field.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden: You cannot modify this field" });
    }

    field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, field });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive a field (soft delete)
// @route   DELETE /api/fields/:id
// @access  Private
const archiveField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Farmer ownership check
    if (req.user.role === "farmer" && field.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden: You cannot archive this field" });
    }

    field.status = "archived";
    await field.save();

    res.json({ success: true, message: "Field archived successfully", field });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFields,
  getFieldById,
  createField,
  updateField,
  archiveField,
};
