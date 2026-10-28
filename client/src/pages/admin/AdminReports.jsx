import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, PieChart as PieIcon, Wallet, ArrowDownRight } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

const COLORS = ["#16a34a", "#2563eb", "#d97706", "#dc2626", "#8b5cf6", "#06b6d4"];

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/reports")
      .then((res) => setReports(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const { procurementTrend = [], varietyBreakdown = [], paymentStatusBreakdown = [] } =
    reports || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial & Operational Analytics</h1>
        <p className="text-sm text-gray-500">Comprehensive procurement, sugarcane variety distribution, and disbursement metrics</p>
      </div>

      {/* Procurement Trend */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Daily Cane Arrivals & Procurement Value</h2>
        <p className="text-xs text-gray-400 mb-4">Volume (Tonnes) and Payable Amount (₹) recorded at weighbridge</p>
        <div className="h-72 w-full">
          {procurementTrend.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-gray-400">
              No procurement trends recorded yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procurementTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="tonnes" fill="#15803d" name="Sugarcane (Tonnes)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="amount" fill="#0284c7" name="Amount (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Variety Breakdown */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Cultivated Variety Distribution</h2>
          <p className="text-xs text-gray-400 mb-4">Acreage breakdown across farmer plots</p>
          <div className="h-64 w-full">
            {varietyBreakdown.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-gray-400">
                No variety data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={varietyBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="variety" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="area" fill="#16a34a" name="Area (Acres)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Farmer Payment Accounts Status</h2>
          <p className="text-xs text-gray-400 mb-4">Disbursement progress and pending liability categories</p>
          <div className="mt-4 space-y-3">
            {paymentStatusBreakdown.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400">No payment records yet.</p>
            ) : (
              paymentStatusBreakdown.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-semibold text-gray-800 text-sm">{s.status}</span>
                    <span className="text-xs text-gray-400">({s.count} vouchers)</span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    ₹{s.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
