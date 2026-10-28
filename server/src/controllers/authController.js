const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "agrocane360_secure_jwt_secret_key_btech_2026",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Generate Farmer ID
const generateFarmerId = async () => {
  const count = await User.countDocuments({ role: "farmer" });
  const year = new Date().getFullYear();
  return `FMR-${year}-${String(count + 1).padStart(4, "0")}`;
};

// @desc    Register a new farmer
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, mobile, email, password, preferredLanguage, village, district, state } = req.body;

    // Check if mobile already exists
    const existingFarmer = await User.findOne({ mobile });
    if (existingFarmer) {
      return res.status(400).json({ message: "A farmer with this mobile number already exists." });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "A user with this email address already exists." });
      }
    }

    const farmerId = await generateFarmerId();

    // Security: always force role = 'farmer' on public registration
    const user = await User.create({
      name,
      mobile,
      email: email || undefined,
      password,
      role: "farmer",
      farmerId,
      preferredLanguage: preferredLanguage || "en",
      village,
      district,
      state: state || "Uttar Pradesh",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Farmer Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: "Please provide mobile number and password" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid mobile number or password" });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "Account has been suspended. Please contact sugar mill support." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid mobile number or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or unauthorized administrative access" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged In User
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

// @desc    Forgot Password - Request Reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Please provide your registered mobile number or email" });
    }

    const trimmed = identifier.trim();
    const user = await User.findOne({
      $or: [{ mobile: trimmed }, { email: trimmed.toLowerCase() }],
    });

    if (!user) {
      return res.status(404).json({ message: "No registered account found with this mobile number or email." });
    }

    // Generate 6-digit verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity
    await user.save();

    res.json({
      success: true,
      message: `Password reset verification OTP generated successfully.`,
      demoOtp: otp, // Displayed in development/testing for seamless evaluation
      identifier: trimmed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ message: "Identifier, OTP code, and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    const trimmed = identifier.trim();
    const user = await User.findOne({
      $or: [{ mobile: trimmed }, { email: trimmed.toLowerCase() }],
      resetPasswordOtp: otp.trim(),
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP verification code. Please request a new OTP." });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
