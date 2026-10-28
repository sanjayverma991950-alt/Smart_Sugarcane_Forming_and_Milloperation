const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/User");
const Field = require("../models/Field");
const CrushingSeason = require("../models/CrushingSeason");
const ProcurementRate = require("../models/ProcurementRate");
const Ticket = require("../models/Ticket");
const Delivery = require("../models/Delivery");
const Payment = require("../models/Payment");
const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/agrocane360";
    await mongoose.connect(mongoUri);
    console.log("[Seed] Connected to MongoDB...");

    // Clean existing records
    await Promise.all([
      User.deleteMany({}),
      Field.deleteMany({}),
      CrushingSeason.deleteMany({}),
      ProcurementRate.deleteMany({}),
      Ticket.deleteMany({}),
      Delivery.deleteMany({}),
      Payment.deleteMany({}),
      Announcement.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("[Seed] Cleared existing demo data.");

    // 1. Create Default Admin
    const admin = await User.create({
      name: "Mill Operations Director",
      email: "admin@agrocane.com",
      password: "Admin@1234",
      role: "admin",
      status: "active",
    });
    console.log("[Seed] Created Admin: admin@agrocane.com (password: Admin@1234)");

    // 2. Create Sample Farmers
    const farmer1 = await User.create({
      name: "Ramesh Kumar Sharma",
      mobile: "9876543210",
      email: "ramesh.farmer@example.com",
      password: "Farmer@1234",
      role: "farmer",
      farmerId: "FMR-2026-0001",
      preferredLanguage: "hi",
      village: "Kalyanpur",
      district: "Meerut",
      state: "Uttar Pradesh",
      address: "House 12, Main Bazar, Kalyanpur",
      status: "active",
    });

    const farmer2 = await User.create({
      name: "Suresh Singh",
      mobile: "9876543211",
      email: "suresh.farmer@example.com",
      password: "Farmer@1234",
      role: "farmer",
      farmerId: "FMR-2026-0002",
      preferredLanguage: "en",
      village: "Daurala",
      district: "Meerut",
      state: "Uttar Pradesh",
      address: "Daurala Sugar Mill Road",
      status: "active",
    });
    console.log("[Seed] Created Farmers: 9876543210 and 9876543211 (password: Farmer@1234)");

    // 3. Create Active Crushing Season
    const season = await CrushingSeason.create({
      name: "2025-2026",
      tentativeStartDate: new Date("2025-10-25"),
      confirmedStartDate: new Date("2025-11-01"),
      expectedEndDate: new Date("2026-04-30"),
      status: "active",
      notes: "Annual Sugarcane Crushing Season 2025-2026 for Meerut Central Mill.",
    });
    console.log("[Seed] Created Active Crushing Season: 2025-2026");

    // 4. Create Procurement Rate
    const rate = await ProcurementRate.create({
      season: season._id,
      variety: "General / Standard",
      ratePerTonne: 3700,
      effectiveDate: new Date("2025-10-01"),
      status: "active",
      createdBy: admin._id,
    });
    console.log("[Seed] Created Procurement Rate: ₹3,700/tonne");

    // 5. Create Sample Fields for Farmer 1
    const field1 = await Field.create({
      farmer: farmer1._id,
      name: "Plot A - North Tubewell",
      village: "Kalyanpur",
      area: 3.5,
      areaUnit: "acre",
      variety: "Co 0238",
      cropType: "plant",
      plantingDate: new Date("2025-02-15"),
      expectedHarvestDate: new Date("2026-01-20"),
      expectedProductionTonnes: 110,
      soilType: "loam",
      irrigationMethod: "furrow",
      latitude: 29.47,
      longitude: 77.70,
      notes: "High yield plot with good soil moisture.",
      status: "active",
    });

    const field2 = await Field.create({
      farmer: farmer1._id,
      name: "Plot B - River Belt",
      village: "Kalyanpur",
      area: 2.0,
      areaUnit: "acre",
      variety: "Co 0118",
      cropType: "ratoon",
      plantingDate: new Date("2024-11-10"),
      expectedHarvestDate: new Date("2025-12-15"),
      expectedProductionTonnes: 60,
      soilType: "sandy",
      irrigationMethod: "drip",
      latitude: 29.49,
      longitude: 77.72,
      notes: "Drip irrigation installed with fertigation unit.",
      status: "active",
    });
    console.log("[Seed] Created 2 Farmer Fields.");

    // 6. Create Tickets
    const ticket1 = await Ticket.create({
      ticketNumber: "TCK-2026-0001",
      farmer: farmer1._id,
      field: field1._id,
      season: season._id,
      issueDate: new Date(),
      validFrom: new Date(),
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      allocatedQuantityTonnes: 30,
      suppliedQuantityTonnes: 10.5,
      deliverySlot: "Morning Slot (08:00 - 14:00)",
      status: "Partially Supplied",
      approvedBy: admin._id,
      reviewedAt: new Date(),
    });

    const ticket2 = await Ticket.create({
      ticketNumber: "TCK-2026-0002",
      farmer: farmer1._id,
      field: field2._id,
      season: season._id,
      issueDate: new Date(),
      validFrom: new Date(),
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      allocatedQuantityTonnes: 25,
      suppliedQuantityTonnes: 0,
      deliverySlot: "Evening Slot (14:00 - 20:00)",
      status: "Pending Review",
    });
    console.log("[Seed] Created 2 Tickets.");

    // 7. Create Delivery
    const delivery = await Delivery.create({
      receiptNumber: "DLV-2026-0001",
      ticket: ticket1._id,
      farmer: farmer1._id,
      season: season._id,
      deliveryDate: new Date(),
      vehicleNumber: "UP 15 AB 4589",
      grossWeightTonnes: 14.8,
      tareWeightTonnes: 4.3,
      netWeightTonnes: 10.5,
      acceptedQuantityTonnes: 10.5,
      ratePerTonne: 3700,
      deductions: 0,
      totalAmount: 38850,
      qualityNotes: "Good sugar sucrose content, clean cane, trash under 1%.",
      status: "verified",
      recordedBy: admin._id,
    });
    console.log("[Seed] Created Delivery: DLV-2026-0001");

    // 8. Create Payment Record
    await Payment.create({
      paymentNumber: "PAY-2026-0001",
      farmer: farmer1._id,
      season: season._id,
      ticket: ticket1._id,
      deliveries: [delivery._id],
      grossAmount: 38850,
      deductions: 0,
      netPayable: 38850,
      amountPaid: 25000,
      balanceDue: 13850,
      status: "Partially Paid",
      paymentDate: new Date(),
      paymentReference: "NEFT-SBI-8923411",
      paymentMethod: "NEFT",
      notes: "First installment disbursed against weighment DLV-2026-0001.",
      recordedBy: admin._id,
    });
    console.log("[Seed] Created Payment: PAY-2026-0001 (Paid ₹25,000, Balance ₹13,850)");

    // 9. Create Announcements
    await Announcement.create({
      title: "Crushing Season 2025-2026 Official Opening",
      message: "The sugar mill crushing operations will begin on 1st November. Farmers are advised to clean binding trash and harvest mature cane.",
      priority: "high",
      category: "season",
      targetRole: "all",
      createdBy: admin._id,
    });

    await Announcement.create({
      title: "State Approved Cane Advisory Price Announced",
      message: "Standard sugarcane procurement rate has been fixed at ₹3,700 per tonne for the current crushing cycle.",
      priority: "medium",
      category: "rates",
      targetRole: "farmer",
      createdBy: admin._id,
    });

    // 10. Create In-App Notifications for Farmer
    await Notification.create({
      recipient: farmer1._id,
      title: "Payment Disbursed: ₹25,000",
      message: "An amount of ₹25,000 has been credited to your bank account via NEFT (Ref: NEFT-SBI-8923411).",
      type: "payment",
      relatedEntity: "payment",
      isRead: false,
    });

    await Notification.create({
      recipient: farmer1._id,
      title: "Weighment DLV-2026-0001 Verified",
      message: "Your delivery of 10.5 tonnes has been verified at weighbridge #2.",
      type: "delivery",
      relatedEntity: "delivery",
      isRead: true,
    });

    console.log("[Seed] Database Seeded Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("[Seed Error]", err);
    process.exit(1);
  }
};

seedDatabase();
