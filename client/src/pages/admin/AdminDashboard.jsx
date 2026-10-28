import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Users, Map, Ticket, Truck, Wallet, TrendingUp, AlertCircle,
  CalendarDays, CheckCircle2, ArrowRight, ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from "recharts";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/units";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, repRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/reports"),
      ]);
      setData(dashRes.data);
      setReports(repRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  const stats = data?.stats || {};
  const recentTickets = data?.recentTickets || [];
  const recentDeliveries = data?.recentDeliveries || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase text-brand-800">
            Mill Operations Center
          </span>
          <h1 className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Sugar Mill Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500">Live operational oversight, crushing season procurement, and accounts</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Link
            to="/admin/deliveries"
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-800"
          >
            <Truck className="h-4 w-4" /> Record Weighment
          </Link>
          <Link
            to="/admin/supply-forecast"
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-brand-700 bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
          >
            <TrendingUp className="h-4 w-4" /> Supply Forecast
          </Link>
        </div>
      </div>

      {/* 4 Primary Operational Metric Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Farmers & Cultivation */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Farmers & Fields</span>
            <div className="rounded-xl bg-brand-100 p-2 text-brand-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.totalFarmers}</p>
          <p className="mt-1 text-xs text-gray-500">
            Registered Fields: <span className="font-semibold text-brand-700">{stats.totalFields}</span> ({stats.totalCultivatedAreaAcres} acres)
          </p>
          <Link to="/admin/farmers" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
            View Farmers &rarr;
          </Link>
        </div>

        {/* Tickets Under Review */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Ticket Requests</span>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
              <Ticket className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.pendingTickets}</p>
          <p className="mt-1 text-xs text-gray-500">
            Approved & active: <span className="font-semibold text-green-700">{stats.approvedTickets}</span>
          </p>
          <Link to="/admin/tickets" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
            Review Tickets &rarr;
          </Link>
        </div>

        {/* Cane Procurement (Tonnes) */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Cane Crushed</span>
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">
            {stats.totalSuppliedTonnes} <span className="text-base font-medium text-gray-500">T</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Active Season: <span className="font-semibold text-gray-800">{stats.activeSeason}</span>
          </p>
          <Link to="/admin/deliveries" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
            Weighment Logs &rarr;
          </Link>
        </div>

        {/* Outstanding Payment Liability */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Outstanding Balance</span>
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-700">
            ₹{stats.outstanding?.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Total Disbursed: <span className="font-semibold text-gray-800">₹{stats.totalPaid?.toLocaleString("en-IN")}</span>
          </p>
          <Link to="/admin/payments" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
            Disburse Payments &rarr;
          </Link>
        </div>
      </div>

      {/* Chart: Procurement Trend */}
      {reports?.procurementTrend?.length > 0 && (
        <div className="min-w-0 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Sugarcane Procurement Trend (Tonnes)</h2>
            <span className="text-xs text-gray-400">Verified mill weighments</span>
          </div>
          <div className="h-64 sm:h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports.procurementTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={40} />
                <Tooltip />
                <Bar dataKey="tonnes" fill="#16a34a" radius={[6, 6, 0, 0]} name="Cane (Tonnes)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Two Column Layout: Recent Deliveries & Tickets */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tickets to review */}
        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="font-bold text-gray-900 text-base sm:text-lg">Recent Supply Tickets</h2>
            <Link to="/admin/tickets" className="text-xs font-semibold text-brand-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="mt-4 divide-y">
            {recentTickets.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No recent tickets.</p>
            ) : (
              recentTickets.map((t) => (
                <div key={t._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-bold text-gray-900">{t.ticketNumber}</p>
                    <p className="text-xs text-gray-500">
                      Farmer: {t.farmer?.name} ({t.farmer?.mobile}) &bull; {t.allocatedQuantityTonnes} T
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="font-bold text-gray-900 text-base sm:text-lg">Recent Weighbridge Entries</h2>
            <Link to="/admin/deliveries" className="text-xs font-semibold text-brand-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="mt-4 divide-y">
            {recentDeliveries.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No weighments recorded yet.</p>
            ) : (
              recentDeliveries.map((d) => (
                <div key={d._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 py-3 text-sm">
                  <div>
                    <p className="font-bold text-gray-900">{d.receiptNumber}</p>
                    <p className="text-xs text-gray-500">
                      {d.farmer?.name} &bull; Net: {d.acceptedQuantityTonnes} T &bull; {formatDate(d.deliveryDate)}
                    </p>
                  </div>
                  <span className="font-bold text-emerald-700 text-left sm:text-right">₹{d.totalAmount?.toLocaleString("en-IN")}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
