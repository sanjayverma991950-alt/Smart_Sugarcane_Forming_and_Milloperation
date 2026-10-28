const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Public / Private
const getAnnouncements = async (req, res, next) => {
  try {
    const query = {};
    if (req.user && req.user.role === "farmer") {
      query.targetRole = { $in: ["all", "farmer"] };
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "name")
      .sort({ publishedAt: -1 })
      .limit(30);

    res.json({ success: true, announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create an announcement
// @route   POST /api/admin/announcements
// @access  Private (Admin)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, targetRole = "all", priority = "medium", category = "general", expiresAt } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      targetRole,
      priority,
      category,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: req.user.id,
    });

    // Notify farmers if priority is high or urgent
    if (["high", "urgent"].includes(priority)) {
      const farmers = await User.find({ role: "farmer", status: "active" }).select("_id");
      const notifications = farmers.map((f) => ({
        recipient: f._id,
        title: `Mill Announcement: ${title}`,
        message,
        type: category === "weather" ? "weather" : "info",
        relatedEntity: "announcement",
        relatedId: announcement._id,
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
};
