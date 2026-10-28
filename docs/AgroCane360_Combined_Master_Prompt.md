# COMBINED MASTER PROJECT PROMPT: AgroCane 360

## AI-Driven Sugarcane Farming and Sugar Mill Operations Platform
### Base Platform (Part 1) + AI Automation Extension (Part 2)

Act as a senior full-stack MERN developer, UI/UX designer, database architect, and AI integration engineer. Help me build a complete, professional, responsive, and functional web application named **AgroCane 360** using the MERN stack.

This is a real-world, final-year B.Tech Computer Science project intended to help sugarcane farmers manage their fields, receive sugar mill updates, generate and track sugarcane supply tickets, monitor payments, and receive AI-assisted agricultural guidance. Sugar mill administrators should be able to manage farmers, fields, supply tickets, crushing seasons, procurement, payments, and business analytics.

I am a student learning web development, so build this project step by step and explain the important code in simple English. Do not generate the entire project in one enormous response.

**How this document is organized**
- **Part 1** – the base AgroCane 360 platform (Sections 1–23).
- **Part 2** – four AI automation features added on top of the base platform (Sections 24–33).
- **Part 3** – combined implementation rules, implementation order, and the first response required (Sections 34–36).

**Important rule for Part 2:** The base platform may already exist in my project. If it exists, do NOT rebuild it from scratch and do NOT overwrite working features. Inspect the existing structure first, then integrate the new features into it with proper frontend, backend, database, authentication, and authorization. If a base module does not exist yet, build it first following Part 1.

---

# PART 1 — BASE PLATFORM

## 1. Technology Stack

### Frontend
- React.js with Vite
- JavaScript
- React Router DOM
- Axios for API requests
- Tailwind CSS for responsive styling
- Lucide React for icons
- Recharts for charts and analytics
- React Hook Form where appropriate
- Context API for authentication and shared state

### Backend
- Node.js
- Express.js
- RESTful API architecture
- JWT-based authentication
- bcrypt for password hashing
- Role-based authorization middleware
- Server-side input validation
- Centralized error handling

### Database
- MongoDB Atlas
- Mongoose schemas and models
- Proper relationships through MongoDB ObjectIds
- Database indexes and validation
- Created-at and updated-at timestamps

### Development and Deployment
- Visual Studio Code
- Git and GitHub
- Environment variables using `.env`
- Frontend deployment on Vercel
- Backend deployment on Render
- MongoDB Atlas for the production database

Use compatible, currently supported package versions. Never put secrets, database credentials, JWT secrets, or private AI API keys inside the React frontend.

*(Additional packages required by Part 2 are listed in Section 25.)*

---

## 2. Project Architecture

Create a well-organized full-stack application with:

- Public landing page
- Farmer registration and login
- Farmer dashboard
- Admin login
- Admin dashboard
- Protected routes
- Backend REST API
- MongoDB database
- AI assistance module
- Notifications module
- Analytics and reporting module

Keep the frontend and backend in separate folders:

`agrocane-360/`
- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend
- `README.md` — installation and project documentation
- `.gitignore`

Organize the frontend into reusable components, layouts, pages, hooks, services, and utilities. Organize the backend into routes, controllers, models, middleware, services, validators, and configuration.

Use a maintainable architecture instead of placing all code in one file.

*(Part 2 adds `jobs/` and `uploads/` on the server and new service modules; see Section 25.)*

---

## 3. User Roles and Authentication

Create two separate portals.

### Farmer Portal
Farmers can:
- Register and log in.
- View only their own profile, fields, tickets, deliveries, payments, and notifications.
- Update permitted profile information.
- Manage their own agricultural records.
- Submit requests and complaints.
- Receive mill announcements and agricultural guidance.

### Admin Portal
Administrators can:
- Log in through a separate admin login interface.
- Manage farmers and farmer accounts.
- Review and approve or reject ticket requests.
- Configure crushing seasons.
- Manage verified delivery and weighment records.
- Maintain approved procurement rates and payment records.
- Publish announcements.
- View reports and operational analytics.

Implement role-based access control on the server, not just by hiding frontend buttons. A farmer must never be able to access another farmer's records by changing a URL or API identifier.

Use secure password hashing, token expiration, input validation, rate limiting for sensitive endpoints, and secure production cookie or token handling. Provide logout and appropriate unauthorized-access handling. Do not expose password hashes or sensitive information through API responses.

Public registration must never allow a user to assign themselves the admin role. Create the initial administrator through a secure setup process or a protected seed script.

---

## 4. Public Landing Page

Design a professional homepage for AgroCane 360.

Include:
- Modern navbar with logo and navigation links
- Hero section explaining the platform
- Farmer and sugar mill imagery or illustrations
- "Farmer Login," "Farmer Registration," and "Admin Login" actions
- Platform features
- How the system works
- Benefits for farmers and sugar mills
- AI agricultural assistance section
- Statistics section using clearly identified real or sample demonstration data
- Frequently asked questions
- Contact and footer sections

Use a green, white, and subtle earthy color palette. The website should feel trustworthy, modern, clean, and suitable for actual farmers and mill operators.

Do not use fake government affiliations, fabricated certifications, or misleading claims.

---

## 5. Farmer Dashboard

Create a personalized dashboard showing the logged-in farmer's real data.

Display:
- Welcome message and farmer profile
- Total registered fields
- Total cultivated area
- Current crop and planting information
- Current crushing season and important dates
- Active sugarcane tickets
- Pending ticket requests
- Recent deliveries
- Total payable amount
- Total amount paid
- Outstanding payment amount
- Recent notifications
- Agricultural recommendations
- Quick-action buttons

Include charts for delivery history and payment summaries when sufficient data exists.

Every dashboard value must come from the authenticated farmer's database records. Show meaningful empty states when no records exist.

---

## 6. Farmer Profile Management

Create a profile module with:
- Farmer name
- Farmer ID
- Mobile number
- Email, if provided
- Village
- District
- State
- Address
- Preferred language
- Registration date

Allow farmers to update permitted details. Validate mobile numbers and other fields appropriately.

If identity documents or bank details are introduced, protect them carefully, collect only what is necessary, and never expose them in public responses or logs.

---

## 7. Field and Sugarcane Crop Management

Farmers should be able to register and manage multiple agricultural fields.

Each field should support:
- Field name or identifier
- Village and location
- Area in acres or hectares
- Sugarcane variety
- Planting date
- Expected harvest date
- Actual harvest date, if available
- Soil information
- Irrigation method
- Crop type or planting cycle
- Fertilizer and crop-care records
- Expected production quantity
- Field notes
- Field status

Features:
- Add a field
- View field details
- Edit a field
- Delete or archive a field safely
- View all fields in a searchable table or card layout
- Calculate total cultivated area
- Maintain crop-cycle history
- Validate area and date values

Store units explicitly and convert them consistently. Do not silently mix acres and hectares.

*(Part 2 note: weather and irrigation advice needs field coordinates or a village/district location. Add optional `latitude`, `longitude` (or a geocoded village location) to the Field model without breaking existing records.)*

---

## 8. Crushing Season Management

Create an annual sugar mill crushing-season module.

Administrators should be able to:
- Create a season for a specific year
- Set tentative and confirmed opening dates
- Set the expected closing date
- Publish changes to farmers
- Update dates with a recorded reason
- View previous seasons
- Mark a season as planned, active, completed, or cancelled

Farmers should be able to:
- View the current season
- See opening and closing dates
- Receive notifications when dates change
- View historical season information

Use proper date validation and clearly label tentative dates. Do not represent an estimated date as officially confirmed.

---

## 9. Sugarcane Ticket Generation and Management

Build a ticket management system for sugarcane supply.

Each ticket should contain:
- Unique ticket number
- Farmer reference
- Field reference, when applicable
- Season reference
- Issue date
- Valid-from date
- Expiry date
- Allocated quantity
- Delivery date or slot, if configured
- Ticket status
- Approval details
- Associated delivery records
- Creation and update timestamps

Supported ticket statuses:
- Draft
- Pending Review
- Approved
- Released
- Partially Supplied
- Completed
- Expired
- Rejected
- Cancelled

### Ticket Workflow
1. Farmer submits a ticket request.
2. The system validates the farmer, field, season, and applicable rules.
3. The request enters Pending Review.
4. The admin reviews the request.
5. The admin approves or rejects it with an appropriate reason.
6. Approved tickets are released according to the configured process.
7. Verified deliveries update the supplied quantity and ticket status.
8. The ticket is completed when its applicable fulfillment conditions are met.

Generate unique ticket numbers on the server and prevent duplicate or conflicting ticket records.

### AI-Assisted Ticket Features
Use AI to assist with:
- Summarizing ticket requests
- Explaining eligibility requirements
- Identifying missing information
- Helping administrators review unusual requests
- Explaining ticket statuses in simple language

AI must not invent allocations, bypass admin approval, change verified quantities, or override business rules. Ticket eligibility and quantity allocation must be calculated using explicit, configurable rules.

Do not assume that every mill uses the same allocation policy. Allow authorized administrators to configure the relevant rules.

---

## 10. Sugarcane Delivery and Weighment Management

Create a module to record sugarcane deliveries against valid tickets.

Each delivery should contain:
- Unique delivery or weighment reference
- Ticket reference
- Farmer reference
- Delivery date and time
- Gross weight
- Tare weight
- Net weight
- Accepted quantity
- Applicable approved rate
- Amount calculated from verified quantity and rate
- Quality or deduction details, if applicable
- Receipt number
- Verification status
- Recorded-by administrator
- Audit timestamps

Calculate net weight using the validated gross and tare weights. Validate all quantities and ensure they cannot be negative or physically inconsistent.

Only authorized users may create or verify official weighment records. Prevent unauthorized edits and duplicate submissions. Corrections to verified records must follow an audited adjustment process.

Keep estimated quantities separate from verified quantities.

---

## 11. Farmer Payment Management

Create a transparent payment tracking module.

Display:
- Verified supplied quantity
- Applicable approved rate
- Calculated payable amount
- Approved adjustments or deductions
- Total amount paid
- Outstanding amount
- Payment status
- Expected payment date, if configured
- Actual payment date
- Payment reference
- Related delivery records

Payment statuses may include:
- Pending Verification
- Calculated
- Awaiting Approval
- Approved
- Partially Paid
- Paid
- On Hold
- Disputed

Calculate payable amounts from verified supply and authorized rates. Calculate outstanding balances from recorded, verified payments and approved adjustments.

Only authorized administrators may record or verify payments. Maintain a payment history and audit trail. Never mark a payment as completed merely because an AI model recommends it or a user clicks an unverified button.

Do not claim to transfer money or connect to a bank unless a real, authorized payment integration has been implemented.

---

## 12. AI Agricultural Assistant (Text)

Integrate an AI assistant to help farmers understand crop management.

Possible features:
- Sugarcane crop-care guidance
- General fertilizer guidance
- Irrigation recommendations
- Variety information
- Common pest and disease information
- Harvest planning
- Explanations of ticket and payment statuses
- Frequently asked questions
- Personalized summaries based on authorized farmer records

The assistant should use simple English and Hindi, with a language selector.

### AI Safety and Reliability
- Use an AI provider through the backend.
- Store API keys only in server environment variables.
- Clearly distinguish general educational guidance from professional agricultural advice.
- Ground recommendations in verified agricultural information whenever possible.
- Ask for missing context before giving specific recommendations.
- Avoid inventing fertilizer dosages, pesticide instructions, official policies, or disease diagnoses.
- For serious crop disease or chemical-treatment questions, advise the farmer to consult an appropriate agricultural expert or local extension service.
- Do not present AI-generated advice as an official instruction from a sugar mill or government department.
- Do not allow the AI assistant to access records belonging to other farmers.
- Provide a graceful fallback if the AI provider is unavailable.

Keep the AI provider integration modular so that the provider can be changed later.

---

## 13. Notifications and Announcements

Build an in-app notification system.

Notifications can cover:
- Crushing-season opening or closing date changes
- Ticket submission and approval
- Ticket rejection with reason
- Ticket expiry reminders
- Delivery updates
- Payment status updates
- Important mill announcements
- Agricultural advisories

Features:
- Notification list
- Unread count
- Mark as read
- Mark all as read
- Notification timestamps
- Links to relevant ticket, delivery, or payment pages

Allow administrators to publish announcements for all farmers or a defined eligible group.

Make clear that SMS and WhatsApp delivery require separate integrations and should be implemented only when properly configured.

---

## 14. Admin Dashboard

Build a professional admin dashboard with operational summaries.

Display:
- Total registered farmers
- Total active farmers
- Total registered fields
- Total cultivated area
- Active crushing season
- Pending ticket requests
- Approved and released tickets
- Total verified sugarcane supplied
- Daily and seasonal procurement
- Pending payment approvals
- Recorded payments
- Outstanding payable amount

Include:
- Date-range filters
- Season filters
- Farmer search
- Ticket status filters
- Delivery and payment reports
- Charts and tables
- Recent activity
- Alerts requiring administrative action

All figures must be calculated from actual database records. If sample data is used during development, label it as demo data and never mix it with production records.

---

## 15. Financial and Mill Operations Analytics

Create a reporting module for mill operations.

Track relevant records for:
- Sugarcane procurement
- Verified delivery quantities
- Approved procurement rates
- Recorded payments
- Outstanding liabilities
- Operational expenses, if entered
- Other revenue, if recorded
- Crushing-season performance

Calculate financial summaries using clearly defined accounting rules.

Do not calculate actual mill profit using an oversimplified formula such as revenue minus farmer payments alone. A meaningful profit report requires reliable revenue, procurement costs, operating expenses, and any other relevant accounting entries.

Show estimated values separately from verified financial records. Include date ranges, units, calculation definitions, and exportable reports where practical.

---

## 16. Complaints and Support

Allow farmers to submit complaints or questions related to:
- Tickets
- Delivery records
- Payment discrepancies
- Profile details
- Field information
- Other mill-related concerns

Each complaint should have:
- Unique reference
- Farmer reference
- Category
- Description
- Supporting attachment, if enabled
- Submission date
- Status
- Admin response
- Resolution date

Possible statuses:
- Submitted
- Under Review
- Awaiting Farmer Response
- Resolved
- Closed

Farmers should be able to track their complaints. Administrators should be able to assign, review, respond to, and resolve them.

Validate uploaded files and restrict file size and type. Do not allow arbitrary executable uploads.

---

## 17. Database Models

Design appropriate Mongoose models, including:

- User
- FarmerProfile, if separate from User
- Field
- CropCycle, if needed
- CrushingSeason
- Ticket
- Delivery
- Payment
- Notification
- Announcement
- Complaint
- MillRate or ProcurementRate
- Expense, if financial analytics are implemented
- AuditLog

Define field types, required values, enums, references, timestamps, indexes, and validation rules.

Use consistent relationships. A farmer's records must be linked to their authenticated account. Avoid duplicating sensitive information unnecessarily.

Use transactions where multiple database changes must succeed or fail together and the deployment database supports the required transaction configuration.

*(Part 2 adds CropDiseaseReport, WeatherAdvisory, SupplyForecast, and optionally VoiceAssistantSession; see Section 26.)*

---

## 18. Backend API Design

Create REST API endpoints with appropriate authentication and authorization.

Suggested endpoint groups:

Authentication:
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`

Farmer profile:
- GET `/api/farmers/me`
- PATCH `/api/farmers/me`

Fields:
- GET `/api/fields`
- POST `/api/fields`
- GET `/api/fields/:id`
- PATCH `/api/fields/:id`
- DELETE `/api/fields/:id`

Crushing seasons:
- GET `/api/seasons`
- GET `/api/seasons/current`
- POST `/api/admin/seasons`
- PATCH `/api/admin/seasons/:id`

Tickets:
- GET `/api/tickets`
- POST `/api/tickets`
- GET `/api/tickets/:id`
- PATCH `/api/admin/tickets/:id/review`
- PATCH `/api/admin/tickets/:id/status`

Deliveries:
- GET `/api/deliveries`
- POST `/api/admin/deliveries`
- GET `/api/deliveries/:id`

Payments:
- GET `/api/payments`
- POST `/api/admin/payments`
- PATCH `/api/admin/payments/:id/verify`

Notifications:
- GET `/api/notifications`
- PATCH `/api/notifications/:id/read`

Complaints:
- GET `/api/complaints`
- POST `/api/complaints`
- PATCH `/api/admin/complaints/:id`

AI:
- POST `/api/ai/agricultural-assistant`
- POST `/api/ai/ticket-assistance`

Admin analytics:
- GET `/api/admin/dashboard`
- GET `/api/admin/reports`

These are suggested endpoint names. Adjust them if a better design is needed, but document the final API. Validate every request, enforce authorization on every protected route, and return consistent HTTP status codes and error messages. Use pagination and filtering for large lists.

*(Part 2 endpoints are listed in Section 27.)*

---

## 19. Frontend Pages and Components

Create reusable React pages and components.

Public:
- Home
- About
- Features
- Login
- Registration

Farmer:
- Farmer Dashboard
- My Profile
- My Fields
- Add/Edit Field
- Field Details
- Crushing Season
- My Tickets
- Ticket Details
- Delivery History
- Payment History
- Agricultural AI Assistant
- Notifications
- Complaints
- Settings

Admin:
- Admin Dashboard
- Farmer Management
- Farmer Details
- Field Overview
- Season Management
- Ticket Management
- Delivery and Weighment Management
- Payment Management
- Procurement Rates
- Financial Reports
- Announcements
- Complaints Management
- Audit Logs
- Admin Settings

Shared components:
- Responsive navbar
- Sidebar
- Footer
- Protected route
- Loading indicator
- Error message
- Confirmation modal
- Search bar
- Filter controls
- Pagination
- Status badges
- Data tables
- Form fields
- Empty states
- Toast notifications
- Chart cards

Make the interface responsive on mobile, tablet, and desktop. Ensure forms are accessible and provide helpful validation messages.

*(Part 2 pages are listed in Section 28.)*

---

## 20. UI/UX Design Requirements

Use a polished, modern dashboard design.

Design guidelines:
- Green and white primary palette
- Light neutral backgrounds
- Readable typography
- Consistent spacing
- Clear visual hierarchy
- Rounded cards used consistently
- Subtle shadows
- Simple charts
- Professional icons
- Responsive tables
- Mobile-friendly navigation
- Accessible contrast
- Clear status indicators
- Useful loading, error, and empty states

Farmer interfaces should prioritize clarity and ease of use. Avoid overcrowding the dashboard or using unnecessarily complex language.

Use realistic agricultural imagery where helpful, but do not sacrifice usability for decoration.

Every visible button and navigation link must perform its intended action. Do not leave dead buttons, placeholder pages, or nonfunctional forms in the completed modules.

---

## 21. Validation, Security, and Auditability

Implement:
- Server-side validation for all inputs
- Authentication and role-based authorization
- Farmer record ownership checks
- Secure password hashing
- Protected environment variables
- Rate limiting for sensitive endpoints
- Safe error handling
- Appropriate CORS configuration
- Secure production settings
- File upload restrictions, if uploads exist
- Database indexes
- Duplicate prevention where required
- Audit logging for important admin actions
- Pagination and limits for list endpoints

Record who performed important administrative actions and when. Avoid logging passwords, access tokens, private API keys, or unnecessary personal information.

Do not trust user-supplied IDs, prices, payment statuses, ticket approval statuses, or verified delivery quantities. Validate them on the server.

---

## 22. Testing and Quality Assurance

Test the application module by module.

Include tests for:
- Registration and login
- Role-based access control
- Farmer record isolation
- Field CRUD operations
- Crushing-season validation
- Ticket generation and approval
- Ticket quantity and status updates
- Delivery weight calculations
- Payment calculations
- Notifications
- Complaint workflows
- AI provider failure handling
- API validation
- Responsive layouts

Test both successful and unsuccessful cases. Fix errors before moving to the next module.

Use a testing framework such as Vitest or Jest for relevant frontend and backend tests. Add API integration tests where appropriate.

*(Part 2 test requirements are in Section 32.)*

---

## 23. Setup and Deployment Documentation

Provide a complete README containing:
- Project overview
- Features
- Architecture
- Technologies used
- Prerequisites
- Installation commands
- Environment variable setup
- MongoDB Atlas configuration
- Frontend start command
- Backend start command
- API documentation
- Test commands
- GitHub instructions
- Render deployment
- Vercel deployment
- Common troubleshooting steps

Provide `.env.example` files without real secrets.

Use separate development and production configuration. Configure the production frontend URL, backend URL, CORS, MongoDB connection, JWT settings, and AI provider keys correctly.

Never commit `.env` files containing secrets.

*(Update the README with the Part 2 features, new environment variables, scheduled jobs, and deployment notes.)*

---

# PART 2 — AI AUTOMATION EXTENSION

Add the following four AI automation features to the existing AgroCane 360 project. Keep all existing project features. Do not rebuild the project from scratch. Integrate each feature with the existing frontend, backend, database, authentication, authorization, notification system, and design.

## 24. The Four Features

### FEATURE 1: AI Sugarcane Crop Disease Detection

- Allow farmers to upload photographs of sugarcane leaves or affected plants.
- Use an AI vision API through the backend to analyze the image.
- Display possible diseases, symptoms, confidence information when available, and recommended next steps.
- Save reports in MongoDB so farmers can view their analysis history.
- Validate image formats and file sizes (check the real file type from the file contents, not only the extension).
- Show loading indicators, errors, and retry options.
- Clearly label results as **preliminary AI guidance, not a confirmed diagnosis**.
- Never invent pesticide dosages or unsafe treatment instructions. For chemical treatment, direct the farmer to a local agricultural expert or extension service.
- Let the farmer optionally link a report to one of their own fields.

### FEATURE 2: AI Weather and Irrigation Alerts

- Integrate a real weather API through the Node.js backend.
- Show current weather, forecasts, rainfall information, and relevant weather alerts.
- Generate irrigation and crop-care suggestions using available weather data and farmer field information.
- Add scheduled background jobs to check updated forecasts.
- Send relevant alerts through the existing in-app notification system.
- Display forecast timestamps and handle API failures gracefully.
- Never fabricate weather data. If the weather API fails, show the last stored data clearly marked with its timestamp, or an honest error.
- Do not automatically control irrigation equipment.

### FEATURE 3: AI Sugarcane Supply Prediction (Admin)

- Build an AI-powered forecasting module for sugar mill administrators.
- Use available historical delivery records, cultivated area, crop information, planting dates, seasons, and other reliable data.
- Predict expected sugarcane supply over appropriate time periods.
- Display expected versus actual supply using Recharts.
- Provide daily, weekly, or seasonal forecasts when sufficient data is available.
- Store forecasts and their generation timestamps in MongoDB.
- Start with a simple forecasting model (for example moving average, seasonal average, or area-times-yield estimates), implemented in Node.js.
- Optionally use Python and a machine-learning model through a separate API service later.
- Explain prediction limitations and show warnings when historical data is insufficient.
- Never present predictions as guaranteed quantities.
- Never automatically approve tickets or promise payments based on predictions.
- Use only verified delivery records as "actual" supply.

### FEATURE 4: AI Voice Assistant for Farmers

- Build a voice-enabled AI assistant supporting Hindi and English.
- Add a microphone button, speech-to-text, text chat, and text-to-speech responses.
- Allow farmers to ask questions such as:
  - "Mera ticket ka status kya hai?"
  - "Mera payment kitna pending hai?"
  - "Crushing season kab shuru hoga?"
  - "Mere khet ke liye irrigation ki kya salah hai?"
- Retrieve ticket, payment, field, and season information from authenticated backend APIs.
- Answer personal account questions using verified database records instead of guessing.
- Use browser speech recognition and speech synthesis (Web Speech API) where supported, with a text-based fallback.
- Protect farmer data and never expose another farmer's information.
- Never claim a payment or ticket action succeeded without backend confirmation.
- The voice assistant is read-only for account data: it can explain, not approve, pay, or change records.

---

## 25. Packages, Folders, and Environment Variables

Before coding, list the exact packages and environment variables required. Expected additions (confirm current, supported versions):

**Server:** `multer` (uploads), `file-type` (or equivalent) for content-based file-type checking, `node-cron` (or `agenda`/`bullmq`) for scheduled jobs, `express-rate-limit`, an AI provider SDK (modular wrapper), `axios` or `node-fetch` for weather API calls, optional `node-cache` or Redis for caching, and `jest`/`supertest` for tests.

**Client:** existing stack plus Web Speech API usage (no package needed), Recharts (already installed).

**Suggested new server folders:** `server/src/jobs/`, `server/src/services/ai/`, `server/src/services/weather/`, `server/src/services/forecast/`, `server/uploads/` (git-ignored, or use cloud storage in production).

**New `.env.example` placeholders (no real secrets):**
- `AI_PROVIDER`, `AI_API_KEY`, `AI_VISION_MODEL`, `AI_CHAT_MODEL`
- `WEATHER_API_PROVIDER`, `WEATHER_API_KEY`, `WEATHER_API_BASE_URL`
- `WEATHER_CHECK_CRON`, `FORECAST_REFRESH_CRON`
- `RAIN_ALERT_THRESHOLD_MM`, `HEAT_ALERT_THRESHOLD_C`, `FROST_ALERT_THRESHOLD_C`, `WIND_ALERT_THRESHOLD_KMH`
- `MAX_UPLOAD_SIZE_MB`, `ALLOWED_IMAGE_TYPES`
- `MIN_FORECAST_HISTORY_DAYS` (or minimum record count)

Explain which external services need a separate account or API key, and mention free-tier limits where relevant.

---

## 26. New Database Models

Create appropriate Mongoose models with types, required values, enums, references, timestamps, indexes, and validation:

- **CropDiseaseReport** – farmer ref, optional field ref, image reference (stored safely), image metadata, AI provider/model used, possible diseases (name, symptoms, confidence if available), recommended next steps, disclaimer text, status (analyzed/failed), error info, created timestamp.
- **WeatherAdvisory** – farmer ref (or field ref), location, forecast source, forecast issue timestamp, alert type, severity, message, suggested actions, notification sent flag, a deduplication key (for example farmer + field + alert type + date window).
- **SupplyForecast** – season ref, period type (daily/weekly/seasonal), forecast period start/end, predicted quantity, lower/upper range, model name and version, input data summary (record count, date range), warnings, generated timestamp, generated-by (system or admin), actual quantity (filled later for performance tracking).
- **VoiceAssistantSession** *(only if conversation history is enabled)* – farmer ref, language, messages (role, text, timestamp), intents detected, created timestamp. Avoid storing raw audio. Allow farmers to delete their history.
- **ScheduledJobRun** *(recommended)* – job name, started/finished timestamps, status, error message, records processed. Used for "last successful update" and overlap protection.

Add indexes for farmer-based lookups, date ranges, and deduplication keys.

---

## 27. New API Endpoints

All endpoints are protected with authentication, role-based authorization, input validation, and rate limiting.

**Farmer endpoints**
- `POST /api/ai/crop-disease/analyze` – upload image, run analysis, save report
- `GET /api/ai/crop-disease/history` – paginated history of the logged-in farmer's reports
- `GET /api/ai/crop-disease/:id` – single report (ownership enforced)
- `GET /api/weather/forecast` – current weather and forecast for the farmer's field or location
- `GET /api/weather/advisories` – the farmer's irrigation and weather advisories
- `POST /api/ai/voice/chat` – text (from typed or transcribed speech), language; returns grounded answer

**Admin endpoints**
- `POST /api/ai/supply-prediction/generate`
- `GET /api/ai/supply-prediction` – forecasts, with filters
- `GET /api/ai/supply-prediction/performance` – forecast vs actual accuracy where measurable
- `POST /api/admin/announcements/weather` – publish weather and agricultural announcements (reuse the existing announcements system where possible)

Adjust names if a better design is needed and document the final API. Return consistent status codes and error messages. Enforce farmer record ownership on every request.

---

## 28. New Frontend Pages

Use the existing AgroCane 360 green-and-white design. Make all pages responsive, accessible, and easy for farmers to use (large touch targets, simple language, Hindi/English labels).

**Farmer dashboard additions**
- AI Crop Disease Detection (upload, preview, analyze, results, retry)
- Weather and Irrigation Alerts (current weather, forecast, rainfall, alerts, suggestions, forecast timestamp)
- Crop Analysis History (list, details, filters)
- AI Voice Assistant (microphone button, chat view, language selector, text input fallback, speak-response toggle)

**Admin dashboard additions**
- Sugarcane Supply Forecast (generate, view, warnings, limitations)
- Expected vs Actual Supply (Recharts)
- Forecast History
- Forecast Performance (shown only where sufficient data exists)
- Weather and Agricultural Announcements

Add the new items to the existing sidebar/navigation, and add quick-action cards to the existing dashboards without redesigning them.

---

## 29. Automation Requirements

- Schedule weather forecast checks (for example every few hours) using a job scheduler.
- Generate notifications when configured weather thresholds are met, through the existing notification module.
- Refresh supply predictions when sufficient new verified delivery data is available.
- Prevent duplicate notifications (deduplication keys) and overlapping scheduled jobs (lock flag or run record).
- Display the last successful update and handle failures (log, record the failed run, retry safely, never crash the server).
- Cache suitable AI and weather results and apply rate limits to protect API quotas.
- Group weather checks by location so one API call can serve many fields in the same area.
- Make thresholds configurable by administrators or environment variables.
- Note for deployment: free Render instances may sleep; explain how this affects scheduled jobs and suggest alternatives.

---

## 30. AI Safety and Data Rules for Part 2

- All AI and weather keys stay in backend environment variables only.
- Label all AI outputs as guidance, not official advice or confirmed diagnosis.
- Never invent pesticide or fertilizer dosages, diagnoses, weather values, delivery quantities, or payment amounts.
- For personal account questions (ticket, payment, field, season), the backend fetches verified records first and passes only that authenticated farmer's data to the AI; the AI explains, and the numbers come from the database.
- If data is missing, say so honestly instead of guessing.
- Provide graceful fallbacks when the AI provider or weather provider is unavailable.
- Never allow cross-farmer data access, including through prompts ("show me another farmer's payment").
- Defend against prompt injection: treat uploaded image content and user text as untrusted; AI output must never trigger approvals, payments, or record changes.
- Do not store unnecessary personal data; avoid logging images, tokens, or sensitive details.
- Uploaded images: restrict type and size, rename files safely, strip or ignore unsafe metadata, never execute uploaded files, and apply per-farmer upload rate limits.

---

## 31. Hindi and English Voice Requirements

- Support English (`en-IN`) and Hindi (`hi-IN`), plus Hinglish typed text (for example "Mera payment kitna pending hai?").
- Detect intent for: ticket status, payment pending, crushing season date, irrigation advice, general crop questions.
- Use browser speech recognition and speech synthesis where supported; detect unsupported browsers and show a clear text-only fallback.
- Handle microphone permission denied, no speech detected, and offline errors with friendly messages.
- Show the transcribed text before or while sending so the farmer can correct it.
- Responses should be short, simple, and spoken-friendly.

---

## 32. Testing Requirements for Part 2

Test:
- Image upload (valid, wrong format, oversized, fake extension, empty file)
- AI API failures and timeouts (graceful fallback, retry option)
- Weather API failures (stored data shown with timestamp, no fabricated data)
- Prediction accuracy where measurable (compare past forecasts with verified actuals)
- Insufficient historical data (warning shown, no misleading forecast)
- Voice input permissions and unsupported browsers
- Language support (English, Hindi, Hinglish)
- Authentication and role-based authorization (farmer cannot use admin endpoints)
- Farmer data isolation (reports, advisories, voice answers)
- Scheduled jobs: no duplicate notifications, no overlapping runs, failure recording
- Rate limiting and caching behavior

Use Jest/Supertest (backend) and Vitest/React Testing Library (frontend) where suitable. Mock the AI and weather providers in automated tests; do not spend paid API quota in tests.

---

## 33. Part 2 Quality Rules

- All features connect to the real backend and database where persistence is required.
- No fake results, hardcoded AI responses presented as real, or nonfunctional buttons.
- Any demo data must be clearly labeled and kept separate from production data.
- Do not overwrite existing working features; make changes additive and explain every modification to existing files.

---

# PART 3 — COMBINED IMPLEMENTATION GUIDE

## 34. Implementation Rules — Follow These Carefully

1. If the project already exists, first inspect the existing structure and identify exactly which files need modification. Ask me to paste the relevant files or folder tree if you cannot see them.
2. Explain the implementation plan before coding, and list required packages and environment variables.
3. Give exact terminal commands and tell me which directory to run them in.
4. Keep the React frontend and Express backend as separate applications.
5. Implement one module/feature at a time.
6. For each module, provide complete code for the files required.
7. Clearly state the exact filename and folder path before each code block. For modified existing files, show exactly what to add or change and where.
8. Explain important code in beginner-friendly English.
9. Explain how the frontend connects to the backend and how the backend connects to MongoDB and to external APIs.
10. Tell me how to run the application and verify each feature.
11. If an error occurs, diagnose the actual error instead of rewriting the whole project unnecessarily.
12. Do not skip package installation, environment variables, database setup, or imports.
13. Do not claim a feature works until its implementation and required configuration are complete.
14. Do not replace a real backend with localStorage or hardcoded data for core functionality.
15. Do not create fake payment confirmations, fabricated analytics, fabricated weather, or fake AI responses that appear real.
16. Use clearly labeled demo data only when needed for development.
17. Keep the code readable and maintainable for a B.Tech student.
18. Avoid unnecessary complexity, but do not compromise security or data integrity.
19. Keep all frontend API URLs configurable through environment variables.
20. Explain any external service that requires a separate account or API key.
21. At the end of each module, provide a checklist of what is completed and what I should test before proceeding.
22. Do not generate the entire project or all four AI features in one enormous response.

---

## 35. Required Implementation Order

**Base platform (Part 1)**

- **Phase 1:** Project planning, folder structure, package installation, React/Vite setup, Express setup, and MongoDB connection.
- **Phase 2:** Public landing page, responsive layouts, reusable UI components, and routing.
- **Phase 3:** Registration, login, authentication, protected routes, and admin/farmer role separation.
- **Phase 4:** Farmer profile, field management, and crop-cycle records.
- **Phase 5:** Crushing-season management and notifications.
- **Phase 6:** Ticket request, admin review, ticket approval, and ticket status tracking.
- **Phase 7:** Verified delivery and weighment records.
- **Phase 8:** Payment calculation, payment approval, and payment history.
- **Phase 9:** Admin dashboard, analytics, financial reports, and complaints.
- **Phase 10:** AI agricultural assistant and AI-assisted ticket review.
- **Phase 11:** Testing, validation, security checks, bug fixing, and responsive improvements.
- **Phase 12:** GitHub, README, MongoDB Atlas, Render backend deployment, and Vercel frontend deployment.

**AI automation extension (Part 2)** — start only after the base platform works (or after you have inspected the existing project):

- **Phase 13 – Preparation:** Inspect existing code, list files to modify, install new packages, add environment variables, create shared AI-provider wrapper, upload middleware, rate limiters, and the job scheduler foundation (with overlap protection and `ScheduledJobRun`).
- **Phase 14 – Feature 1:** AI Crop Disease Detection (model, upload endpoint, vision service, history, farmer pages, tests).
- **Phase 15 – Feature 2:** AI Weather and Irrigation Alerts (weather service, caching, advisory model, scheduled checks, notifications with deduplication, farmer pages, admin weather announcements, tests).
- **Phase 16 – Feature 3:** AI Sugarcane Supply Prediction (data readiness check, simple forecasting model, SupplyForecast storage, scheduled refresh, admin pages with Recharts, performance tracking, tests).
- **Phase 17 – Feature 4:** AI Voice Assistant (intent detection, grounded data retrieval, chat endpoint, Web Speech API UI, Hindi/English support, fallback, tests).
- **Phase 18 – Final integration:** Full regression test of base + AI features, security review, farmer data isolation review, responsive check, README and `.env.example` update, deployment notes (including cron behavior on Render).

---

## 36. First Response Required

Do not immediately generate all project code.

**If the base project does not exist yet**, first provide:
1. A short explanation of the AgroCane 360 architecture (including where the four AI features will fit).
2. The complete folder structure.
3. The prerequisites I need on my Windows computer.
4. The exact commands to create the frontend and backend.
5. The packages I need to install.
6. The environment variables I will need, using example placeholders only.
7. A simple explanation of how React, Express, and MongoDB will communicate.
8. The first small milestone I should complete and test.

**If the base project already exists**, first provide:
1. A list of the existing files and folders you need me to share (folder tree, `package.json` files, `server.js`/`app.js`, auth middleware, notification model/controller, Field, Delivery, Ticket, Payment, and Season models, sidebar/router files).
2. The implementation plan for the four AI features and which existing files will be modified.
3. The packages to install (server and client) with exact commands and directories.
4. The new environment variables, using placeholders only.
5. A simple explanation of how the new features connect to the frontend, backend, MongoDB, and the external AI and weather APIs.
6. The first small milestone (Phase 13 preparation, then Feature 1) and how I will test it.

After that, guide me through the project step by step, waiting for my progress or errors when necessary.

The final goal is a functional, secure, responsive, AI-powered, full-stack MERN application suitable for a B.Tech final-year project and a software development portfolio.

**Project name:** AgroCane 360
**Project title:** AI-Driven Sugarcane Farming and Sugar Mill Operations Platform
**Primary stack:** MongoDB, Express.js, React.js, Node.js
**AI extensions:** Crop disease detection, weather and irrigation alerts, supply prediction, Hindi/English voice assistant
**Target users:** Sugarcane farmers and sugar mill administrators
**Development approach:** Step-by-step implementation with clear explanations and real database integration.
