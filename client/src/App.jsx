import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Public pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";

// Farmer pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import Profile from "./pages/farmer/Profile";
import Fields from "./pages/farmer/Fields";
import FieldForm from "./pages/farmer/FieldForm";
import FieldDetails from "./pages/farmer/FieldDetails";
import FarmerSeason from "./pages/farmer/FarmerSeason";
import FarmerTickets from "./pages/farmer/FarmerTickets";
import FarmerDeliveries from "./pages/farmer/FarmerDeliveries";
import FarmerPayments from "./pages/farmer/FarmerPayments";
import FarmerAssistant from "./pages/farmer/FarmerAssistant";
import FarmerVoiceAssistant from "./pages/farmer/FarmerVoiceAssistant";
import FarmerCropDisease from "./pages/farmer/FarmerCropDisease";
import FarmerCropHistory from "./pages/farmer/FarmerCropHistory";
import FarmerWeather from "./pages/farmer/FarmerWeather";
import FarmerNotifications from "./pages/farmer/FarmerNotifications";
import FarmerComplaints from "./pages/farmer/FarmerComplaints";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminSeasons from "./pages/admin/AdminSeasons";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminDeliveries from "./pages/admin/AdminDeliveries";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminRates from "./pages/admin/AdminRates";
import AdminSupplyForecast from "./pages/admin/AdminSupplyForecast";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Farmer Portal */}
        <Route element={<ProtectedRoute role="farmer" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/farmer/profile" element={<Profile />} />
            <Route path="/farmer/fields" element={<Fields />} />
            <Route path="/farmer/fields/new" element={<FieldForm />} />
            <Route path="/farmer/fields/:id" element={<FieldDetails />} />
            <Route path="/farmer/fields/:id/edit" element={<FieldForm />} />
            <Route path="/farmer/season" element={<FarmerSeason />} />
            <Route path="/farmer/tickets" element={<FarmerTickets />} />
            <Route path="/farmer/deliveries" element={<FarmerDeliveries />} />
            <Route path="/farmer/payments" element={<FarmerPayments />} />
            <Route path="/farmer/assistant" element={<FarmerAssistant />} />
            <Route path="/farmer/voice" element={<FarmerVoiceAssistant />} />
            <Route path="/farmer/crop-disease" element={<FarmerCropDisease />} />
            <Route path="/farmer/crop-history" element={<FarmerCropHistory />} />
            <Route path="/farmer/weather" element={<FarmerWeather />} />
            <Route path="/farmer/notifications" element={<FarmerNotifications />} />
            <Route path="/farmer/complaints" element={<FarmerComplaints />} />
          </Route>
        </Route>

        {/* Admin Portal */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/farmers" element={<AdminFarmers />} />
            <Route path="/admin/seasons" element={<AdminSeasons />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/deliveries" element={<AdminDeliveries />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/rates" element={<AdminRates />} />
            <Route path="/admin/supply-forecast" element={<AdminSupplyForecast />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
