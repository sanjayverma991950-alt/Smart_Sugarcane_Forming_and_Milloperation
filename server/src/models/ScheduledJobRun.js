const mongoose = require("mongoose");

const scheduledJobRunSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    finishedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["running", "success", "failed"],
      default: "running",
    },
    recordsProcessed: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScheduledJobRun", scheduledJobRunSchema);
