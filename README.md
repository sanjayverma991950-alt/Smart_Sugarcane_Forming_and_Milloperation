# AgroCane 360 🌾
### AI-Driven Sugarcane Farming and Sugar Mill Operations Platform (MERN Stack)

AgroCane 360 is a full-stack web application designed for sugarcane farmers and sugar mill administrations. It streamlines cane acreage tracking, supply ticket requests and approvals, weighbridge weighments, transparent payment ledgers, and integrates 4 AI automation features:
1. **AI Sugarcane Crop Disease Detection** (Pathology identification with safety guidance)
2. **AI Weather & Irrigation Advisory** (Live Open-Meteo forecasts with watering schedules)
3. **AI Sugarcane Supply Prediction** (Yield estimation and expected vs. actual supply analytics)
4. **AI Bilingual Voice Assistant** (Speech recognition & voice synthesis with verified database grounding)

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Hook Form, Context API
- **Backend:** Node.js, Express.js, RESTful API architecture, JWT authentication, bcryptjs, Multer
- **Database:** MongoDB, Mongoose schemas & models, indexes, timestamps
- **APIs & Services:** Open-Meteo API for live weather, Web Speech API (SpeechRecognition & SpeechSynthesis)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/agrocane360`) or a MongoDB Atlas URI

### 2. Install Dependencies
Run in project root:
```bash
# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 3. Seed Demo Database
Populate test admin, farmers, crushing season, procurement rate, fields, tickets, weighments, and payments:
```bash
npm run seed
```

### 4. Start the Application
Open two separate terminal windows:

**Terminal 1 — Backend Server:**
```bash
npm run server
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
npm run client
# Runs on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

### Farmer Portal:
- **URL:** [http://localhost:5173/login](http://localhost:5173/login)
- **Mobile Number:** `9876543210`
- **Password:** `Farmer@1234`
- *(Alternate Farmer: `9876543211` / `Farmer@1234`)*

### Sugar Mill Admin Portal:
- **URL:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Email:** `admin@agrocane.com`
- **Password:** `Admin@1234`

---

## 📂 Project Architecture

```
ArgoCane360/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI (Loader, StatusBadge, ConfirmModal, etc.)
│   │   ├── context/             # AuthContext (JWT & session state)
│   │   ├── layouts/             # PublicLayout & DashboardLayout (Sidebar & Nav)
│   │   ├── pages/
│   │   │   ├── admin/           # Admin Portal (Dashboard, Farmers, Tickets, Deliveries,
│   │   │   │                    # Payments, Rates, Supply Forecast, Reports, Announcements)
│   │   │   ├── farmer/          # Farmer Portal (Dashboard, Profile, Fields, Tickets,
│   │   │   │                    # Deliveries, Payments, AI Assistant, Voice, Crop Disease, Weather)
│   │   │   └── Home.jsx, Login.jsx, Register.jsx, AdminLogin.jsx
│   │   └── services/            # Axios API client (api.js)
│   └── package.json
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection (db.js)
│   │   ├── controllers/         # REST Controllers for all business logic
│   │   ├── middleware/          # JWT auth, role validation, file upload, error handling
│   │   ├── models/              # Mongoose Schemas (User, Field, Ticket, Delivery, Payment, etc.)
│   │   ├── routes/              # Express API Route endpoints
│   │   ├── services/            # AI knowledge engine, Open-Meteo weather, Supply forecast
│   │   ├── jobs/                # Scheduled cron scanner for weather alerts
│   │   ├── scripts/             # Database seed & automated integration test scripts
│   │   └── server.js            # Express app entry point
│   ├── uploads/                 # Storage directory for crop disease images
│   └── package.json
└── README.md
```

---

## 🌐 API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new farmer (Farmer role enforced)
- `POST /api/auth/login` — Farmer login with 10-digit mobile number
- `POST /api/auth/admin-login` — Sugar mill administrator login with email
- `POST /api/auth/forgot-password` — Request password reset OTP using registered mobile or email
- `POST /api/auth/reset-password` — Verify OTP and set a new password
- `GET /api/auth/me` — Get current authenticated user profile
- `POST /api/auth/logout` — Logout user session

### Farmer Profile & Fields
- `GET /api/farmers/me` — Retrieve farmer profile details
- `PATCH /api/farmers/me` — Update farmer details (village, district, preferred language)
- `GET /api/fields` — List registered agricultural plots
- `POST /api/fields` — Register a new field (acre/hectare, variety, coordinates)
- `GET /api/fields/:id` — View specific field details
- `PATCH /api/fields/:id` — Update field information
- `DELETE /api/fields/:id` — Archive field record safely

### Crushing Seasons & Tickets
- `GET /api/seasons/current` — Get active sugar mill crushing season
- `GET /api/tickets` — View supply tickets (farmer sees own, admin sees all)
- `POST /api/tickets` — Farmer requests a new supply ticket
- `PATCH /api/admin/tickets/:id/review` — Admin approves or rejects ticket request

### Weighments & Payments
- `GET /api/deliveries` — Certified weighbridge receipts
- `POST /api/admin/deliveries` — Admin records weighment (gross/tare/net calculation)
- `GET /api/payments/summary` — Aggregate balance due, total paid, and net payable
- `POST /api/admin/payments/:id/disburse` — Admin records payment installment/voucher

### AI & Weather Endpoints
- `POST /api/ai/agricultural-assistant` — Agronomy advisory chat (English/Hindi)
- `POST /api/ai/voice/chat` — Grounded voice query returning verified database figures
- `POST /api/ai/crop-disease/analyze` — Leaf photograph upload & pathology detection
- `GET /api/ai/crop-disease/history` — Farmer's diagnostic analysis history
- `GET /api/weather/forecast` — Live weather observation and irrigation scheduling
- `POST /api/ai/supply-prediction/generate` — Admin statistical supply forecasting

---

## 🧪 Verification & Testing

To run the automated end-to-end integration test suite against the backend:
```bash
node server/src/scripts/test-api.js
```
All 13 test suites verify authentication, permissions, field isolation, ticket workflows, weighment arithmetic, payment summaries, and AI grounded responses.

---

## 🔒 Security & Data Integrity

- **Role-Based Access Control:** Farmer access is strictly isolated to their own records. Admin endpoints enforce `role === 'admin'`.
- **Password Security:** Salted hashing via `bcryptjs`.
- **Payload Sanitization:** Password hashes are stripped from all API outputs.
- **Upload Safety:** Image uploads are restricted to `.jpg`, `.png`, `.webp` up to 5MB with sanitized filenames.
