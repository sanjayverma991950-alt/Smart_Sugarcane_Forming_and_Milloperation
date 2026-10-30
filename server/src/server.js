const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { initScheduledJobs } = require("./jobs/weatherJob");

// Connect to MongoDB
connectDB();

const app = express();

// Dynamic CORS configuration to support local development, LAN devices, and cloud deployments
const envClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, native apps, server-to-server)
    if (!origin) return callback(null, true);

    // Match origins specified in CLIENT_URL
    if (envClientUrls.includes(origin)) return callback(null, true);

    // Allow localhost and 127.0.0.1 on any port (Vite default 5173, fallback 5174, etc.)
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow local network IPs for mobile testing on same Wi-Fi
    if (
      /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(
        origin
      )
    ) {
      return callback(null, true);
    }

    // Allow common frontend hosting platforms (Render, Vercel, Netlify, Cloudflare Pages, GitHub Pages)
    if (
      /^https:\/\/[\w-]+(\.[\w-]+)*\.(vercel\.app|netlify\.app|onrender\.com|pages\.dev|github\.io)$/.test(
        origin
      )
    ) {
      return callback(null, true);
    }

    // Default fallback: allow and reflect origin with credentials
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve built frontend statically if present
const clientDistPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

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

// Root API info endpoint
app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    service: "AgroCane 360 API Server",
    health: "/api/health",
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

// Catch-all for SPA routing if client build exists, or root status message
if (fs.existsSync(clientDistPath)) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      service: "AgroCane 360 API Server",
      health: "/api/health",
    });
  });
}

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
