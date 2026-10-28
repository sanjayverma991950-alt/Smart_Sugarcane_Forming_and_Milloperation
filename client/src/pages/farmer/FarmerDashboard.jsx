import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Map, Ticket, Truck, Wallet, Plus, Camera, CloudSun, Mic,
  CalendarDays, Bell, ArrowRight, TrendingUp, CheckCircle2, Clock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/units";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    fields: [],
    tickets: [],
    deliveries: [],
    paymentSummary: { totalPayable: 0, totalPaid: 0, outstanding: 0 },
    season: null,
    announcements: [],
  });

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [fieldsRes, ticketsRes, deliveriesRes, paymentRes, seasonRes, announceRes] =
        await Promise.all([
          api.get("/fields"),
          api.get("/tickets"),
          api.get("/deliveries"),
          api.get("/payments/summary"),
          api.get("/seasons/current"),
          api.get("/announcements"),
        ]);

      setData({
        fields: fieldsRes.data.fields || [],
        tickets: ticketsRes.data.tickets || [],
        deliveries: deliveriesRes.data.deliveries || [],
        paymentSummary: paymentRes.data.summary || { totalPayable: 0, totalPaid: 0, outstanding: 0 },
        season: seasonRes.data.season || null,
        announcements: announceRes.data.announcements || [],
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={loadDashboardData} />;

  // Calculations
  const activeFields = data.fields.filter((f) => f.status === "active");
  const totalAreaAcres = activeFields.reduce((acc, f) => {
    const acres = f.areaUnit === "hectare" ? f.area * 2.47105 : f.area;
    return acc + acres;
  }, 0);

  const activeTickets = data.tickets.filter((t) =>
    ["Approved", "Released", "Partially Supplied"].includes(t.status)
  );
  const pendingTickets = data.tickets.filter((t) => t.status === "Pending Review");

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 p-5 sm:p-6 md:p-8 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand-600/50 px-3 py-1 text-xs font-medium tracking-wide">
              Farmer ID: {user?.farmerId || "Registered Farmer"}
            </span>
            <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold">
              Welcome, {user?.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-brand-100">
              Village: <span className="font-semibold text-white">{user?.village || "—"}</span> | District:{" "}
              <span className="font-semibold text-white">{user?.district || "—"}</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Link
              to="/farmer/tickets"
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-brand-50"
            >
              <Ticket className="h-4 w-4" /> Request Ticket
            </Link>
            <Link
              to="/farmer/crop-disease"
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
            >
              <Camera className="h-4 w-4" /> Disease Check
            </Link>
            <Link
              to="/farmer/voice"
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-brand-700/90 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Mic className="h-4 w-4" /> Voice Help
            </Link>
          </div>
        </div>
      </div>

      {/* Season Alert if Active */}
      {data.season && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/70 p-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="rounded-xl bg-brand-600 p-2 text-white shrink-0 mt-0.5 sm:mt-0">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-brand-700">Crushing Season {data.season.name}</p>
              <p className="text-xs sm:text-sm text-gray-700">
                Opening Date: <span className="font-medium text-gray-900">{formatDate(data.season.confirmedStartDate || data.season.tentativeStartDate)}</span> | Status: <span className="capitalize font-semibold text-brand-800">{data.season.status}</span>
              </p>
            </div>
          </div>
          <Link to="/farmer/season" className="text-xs font-semibold text-brand-700 hover:underline shrink-0">
            View Dates &rarr;
          </Link>
        </div>
      )}

      {/* 4 Key Metric Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Fields Card */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Registered Fields</span>
            <div className="rounded-xl bg-brand-100 p-2 text-brand-700">
              <Map className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-gray-900">{activeFields.length}</p>
          <p className="mt-1 text-xs text-gray-500">
            Total area: <span className="font-semibold text-brand-700">{totalAreaAcres.toFixed(2)} acres</span>
          </p>
          <Link to="/farmer/fields" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            Manage Fields <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Tickets Card */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Active Supply Tickets</span>
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <Ticket className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-gray-900">{activeTickets.length}</p>
          <p className="mt-1 text-xs text-gray-500">
            Pending review: <span className="font-semibold text-amber-600">{pendingTickets.length}</span>
          </p>
          <Link to="/farmer/tickets" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            View Tickets <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Deliveries Card */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Cane Delivered</span>
            <div className="rounded-xl bg-purple-100 p-2 text-purple-700">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            {data.deliveries.reduce((sum, d) => sum + (d.acceptedQuantityTonnes || 0), 0).toFixed(1)}{" "}
            <span className="text-sm font-normal text-gray-500">tonnes</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Total weighments: <span className="font-semibold text-gray-700">{data.deliveries.length}</span>
          </p>
          <Link to="/farmer/deliveries" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            Delivery History <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Payments Card */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Outstanding Balance</span>
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            ₹{data.paymentSummary.outstanding.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Paid: <span className="font-semibold text-emerald-600">₹{data.paymentSummary.totalPaid.toLocaleString("en-IN")}</span>
          </p>
          <Link to="/farmer/payments" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            Payment Details <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Deliveries / Active Tickets */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Tickets List */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Tickets</h2>
            <Link to="/farmer/tickets" className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700">
              All Tickets &rarr;
            </Link>
          </div>

          <div className="mt-4 divide-y">
            {data.tickets.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No supply tickets requested yet.</p>
            ) : (
              data.tickets.slice(0, 4).map((ticket) => (
                <div key={ticket._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{ticket.ticketNumber}</p>
                    <p className="text-xs text-gray-500">
                      Allocated: {ticket.allocatedQuantityTonnes} Tonnes | Supplied: {ticket.suppliedQuantityTonnes} Tonnes
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Deliveries List */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Weighments</h2>
            <Link to="/farmer/deliveries" className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700">
              All Deliveries &rarr;
            </Link>
          </div>

          <div className="mt-4 divide-y">
            {data.deliveries.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No sugarcane deliveries recorded yet.</p>
            ) : (
              data.deliveries.slice(0, 4).map((del) => (
                <div key={del._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 py-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{del.receiptNumber}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(del.deliveryDate)} | Vehicle: {del.vehicleNumber}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{del.acceptedQuantityTonnes} Tonnes</p>
                    <p className="text-xs font-semibold text-emerald-600">₹{del.totalAmount?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Announcements & Advisories */}
      {data.announcements.length > 0 && (
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Sugar Mill Announcements</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.announcements.slice(0, 2).map((a) => (
              <div key={a._id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-800">
                  {a.category.toUpperCase()}
                </span>
                <h3 className="mt-2 font-semibold text-gray-900">{a.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{a.message}</p>
                <p className="mt-2 text-xs text-gray-400">{formatDate(a.publishedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
