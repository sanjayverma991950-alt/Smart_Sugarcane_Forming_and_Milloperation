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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto overscroll-contain bg-brand-900 text-brand-100 shadow-2xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-800/60 lg:border-none lg:py-5">
          <div className="flex items-center gap-2 text-lg font-bold text-white tracking-wide">
            <Sprout className="h-6 w-6 text-brand-500" /> AgroCane 360
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-brand-300 hover:bg-brand-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-3 pb-8">
          {items.map(({ to, label, icon: Icon, end, external }) =>
            external ? (
              <a
                key={to}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition text-brand-100 hover:bg-brand-700/60"
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
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-brand-600 text-white shadow-xs" : "hover:bg-brand-700/60"
                  }`
                }
              >
                <Icon className="h-5 w-5" /> {label}
              </NavLink>
            )
          )}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 lg:hidden cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-brand-900 text-sm sm:text-base lg:hidden">
                AgroCane 360
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-400 sm:inline lg:hidden">
                &bull;
              </span>
              <p className="hidden text-xs sm:text-sm font-medium text-gray-600 sm:block">
                {user?.role === "admin" ? "Mill Admin Portal" : "Farmer Portal"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-right">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
              <span className="max-w-[100px] sm:max-w-[180px] truncate text-xs sm:text-sm font-medium text-gray-800">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
