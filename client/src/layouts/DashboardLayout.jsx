import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Sprout, LayoutDashboard, User, Map, CalendarDays, Ticket, Truck, Wallet,
  Bot, Bell, MessageSquare, Camera, CloudSun, Mic, History, Users, BarChart3,
  Megaphone, Percent, ScrollText, TrendingUp, Menu, X, LogOut, ExternalLink, Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const farmerNav = [
  { to: "/farmer", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/farmer/profile", label: "My Profile", icon: User },
  { to: "/farmer/fields", label: "My Fields", icon: Map },
  { to: "/farmer/season", label: "Crushing Season", icon: CalendarDays },
  { to: "/farmer/tickets", label: "My Tickets", icon: Ticket },
  { to: "/farmer/deliveries", label: "Deliveries", icon: Truck },
  { to: "/farmer/payments", label: "Payments", icon: Wallet },
  { to: "/farmer/assistant", label: "AI Assistant", icon: Bot },
  { to: "/farmer/voice", label: "Voice Assistant", icon: Mic },
  { to: "/farmer/crop-disease", label: "AI Crop Disease Check", icon: Camera },
  { to: "/farmer/crop-history", label: "Analysis History", icon: History },
  { to: "/farmer/weather", label: "Weather & Irrigation", icon: CloudSun },
  { to: "/farmer/notifications", label: "Notifications", icon: Bell },
  { to: "/farmer/complaints", label: "Complaints", icon: MessageSquare },
];

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/farmers", label: "Farmers", icon: Users },
  { to: "/admin/seasons", label: "Seasons", icon: CalendarDays },
  { to: "/admin/tickets", label: "Tickets", icon: Ticket },
  { to: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/rates", label: "Procurement Rates", icon: Percent },
  { to: "/admin/supply-forecast", label: "Supply Forecast", icon: TrendingUp },
  { to: "/admin/reports", label: "Financial Reports", icon: BarChart3 },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquare },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = user?.role === "admin" ? adminNav : farmerNav;

  const handleLogout = async () => {
    await logout();
    navigate(user?.role === "admin" ? "/admin/login" : "/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-brand-900 text-brand-100 transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5 text-lg font-bold text-white">
          <Sprout className="h-6 w-6" /> AgroCane 360
        </div>
        <nav className="space-y-1 px-3 pb-6">
          {items.map(({ to, label, icon: Icon, end, external }) =>
            external ? (
              <a
                key={to}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition text-brand-100 hover:bg-brand-700/60"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-400" />
                  <span>{label}</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-brand-300" />
              </a>
            ) : (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive ? "bg-brand-600 text-white" : "hover:bg-brand-700/60"
                  }`
                }
              >
                <Icon className="h-5 w-5" /> {label}
              </NavLink>
            )
          )}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
            {open ? <X /> : <Menu />}
          </button>
          <p className="hidden text-sm text-gray-500 md:block">
            {user?.role === "admin" ? "Admin Portal" : "Farmer Portal"}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
