const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { initScheduledJobs } = require("./jobs/weatherJob");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rate limiting on sensitive auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many authentication requests, please try again after 15 minutes." },
});
app.use("/api/auth", authLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AgroCane 360 API Server",
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/farmers", require("./routes/farmerRoutes"));
app.use("/api/fields", require("./routes/fieldRoutes"));
app.use("/api/seasons", require("./routes/seasonRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/rates", require("./routes/rateRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));

// Central Error Handler
app.use(errorHandler);

// Initialize background scheduled tasks
initScheduledJobs();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[AgroCane 360 Server] Running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

module.exports = app;
