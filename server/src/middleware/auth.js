const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "agrocane360_secure_jwt_secret_key_btech_2026"
      );

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found or account removed" });
      }

      if (user.status === "suspended") {
        return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("[Auth Middleware Error]", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Mill Administrator access required" });
  }
};

const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === "farmer") {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Farmer access required" });
  }
};

const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "agrocane360_secure_jwt_secret_key_btech_2026"
      );
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.status !== "suspended") {
        req.user = user;
      }
    } catch (error) {
      // Token invalid or expired, continue without req.user
    }
  }
  next();
};

module.exports = { protect, adminOnly, farmerOnly, optionalProtect };
