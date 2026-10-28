const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("=== AgroCane 360 API Integration Tests ===");

  try {
    // 1. Health check
    const health = await axios.get("http://localhost:5000/api/health");
    console.log("✓ Health Check:", health.data.status);

    // 2. Farmer Login
    const farmerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      mobile: "9876543210",
      password: "Farmer@1234",
    });
    const farmerToken = farmerLogin.data.token;
    console.log("✓ Farmer Login Successful:", farmerLogin.data.user.name, `(${farmerLogin.data.user.farmerId})`);

    const farmerAuth = { headers: { Authorization: `Bearer ${farmerToken}` } };

    // 3. Admin Login
    const adminLogin = await axios.post(`${BASE_URL}/auth/admin-login`, {
      email: "admin@agrocane.com",
      password: "Admin@1234",
    });
    const adminToken = adminLogin.data.token;
    console.log("✓ Admin Login Successful:", adminLogin.data.user.name);

    const adminAuth = { headers: { Authorization: `Bearer ${adminToken}` } };

    // 4. Farmer Profile
    const profile = await axios.get(`${BASE_URL}/farmers/me`, farmerAuth);
    console.log("✓ Farmer Profile fetched:", profile.data.farmer.name);

    // 5. Fields
    const fields = await axios.get(`${BASE_URL}/fields`, farmerAuth);
    console.log("✓ Farmer Fields count:", fields.data.fields.length);

    // 6. Tickets
    const tickets = await axios.get(`${BASE_URL}/tickets`, farmerAuth);
    console.log("✓ Farmer Tickets count:", tickets.data.tickets.length);

    // 7. Deliveries
    const deliveries = await axios.get(`${BASE_URL}/deliveries`, farmerAuth);
    console.log("✓ Farmer Deliveries count:", deliveries.data.deliveries.length);

    // 8. Payment Summary
    const paymentSum = await axios.get(`${BASE_URL}/payments/summary`, farmerAuth);
    console.log("✓ Payment Summary:", paymentSum.data.summary);

    // 9. AI Agricultural Assistant
    const aiText = await axios.post(`${BASE_URL}/ai/agricultural-assistant`, {
      query: "What fertilizer should I apply for sugarcane?",
      language: "en",
    });
    console.log("✓ AI Text Assistant Response received:", aiText.data.reply.slice(0, 60) + "...");

    // 10. AI Voice Assistant (Grounded query)
    const voiceQuery = await axios.post(
      `${BASE_URL}/ai/voice/chat`,
      { text: "Mera payment kitna pending hai?", language: "hi" },
      farmerAuth
    );
    console.log("✓ Grounded Voice Assistant Response:", voiceQuery.data.reply);

    // 11. Weather Forecast
    const weather = await axios.get(`${BASE_URL}/weather/forecast`, farmerAuth);
    console.log("✓ Live Weather Advisory:", weather.data.forecast.description, `${weather.data.forecast.temperature}°C`);

    // 12. Admin Dashboard Stats
    const adminDash = await axios.get(`${BASE_URL}/admin/dashboard`, adminAuth);
    console.log("✓ Admin Dashboard Stats:", adminDash.data.stats);

    // 13. Admin Supply Forecast Generation
    const forecastGen = await axios.post(`${BASE_URL}/ai/supply-prediction/generate`, {}, adminAuth);
    console.log("✓ AI Supply Forecast Generated:", forecastGen.data.forecast.predictedQuantityTonnes, "Tonnes predicted");

    console.log("\n==========================================");
    console.log("ALL 13 API TEST SUITES PASSED SUCCESSFULLY!");
    console.log("==========================================");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err.response?.data || err.message);
    process.exit(1);
  }
}

// Start server and run tests
const app = require("../server");
setTimeout(runTests, 1200);
