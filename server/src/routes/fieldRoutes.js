const express = require("express");
const router = express.Router();
const {
  getFields,
  getFieldById,
  createField,
  updateField,
  archiveField,
} = require("../controllers/fieldController");
const { protect, farmerOnly } = require("../middleware/auth");

router.get("/", protect, getFields);
router.post("/", protect, farmerOnly, createField);
router.get("/:id", protect, getFieldById);
router.patch("/:id", protect, updateField);
router.delete("/:id", protect, archiveField);

module.exports = router;
