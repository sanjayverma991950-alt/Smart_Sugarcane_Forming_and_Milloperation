import { useEffect, useState, useCallback } from "react";
import { Wallet, ArrowDownRight, CheckCircle2, Clock } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/units";

export default function FarmerPayments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalPayable: 0, totalPaid: 0, outstanding: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [payRes, sumRes] = await Promise.all([
        api.get("/payments"),
        api.get("/payments/summary"),
      ]);

      setPayments(payRes.data.payments || []);
      setSummary(sumRes.data.summary || { totalPayable: 0, totalPaid: 0, outstanding: 0 });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Sugarcane Payment Account</h1>
        <p className="text-sm text-gray-500">Transparent statement of cane supplied, payments disbursed, and balance due</p>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Cane Payable</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹{summary.totalPayable.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-400">Total gross value from verified supply</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Total Amount Disbursed</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            ₹{summary.totalPaid.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-emerald-600">Credited to farmer bank account</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Outstanding Balance</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            ₹{summary.outstanding.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-amber-600">Pending disbursement from mill</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          title="No payment records yet"
          text="When sugarcane deliveries are verified, your payment calculations and credit vouchers will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Payment Voucher #</th>
                  <th className="px-6 py-4">Season</th>
                  <th className="px-6 py-4">Net Payable</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Balance Due</th>
                  <th className="px-6 py-4">Payment Mode & Ref</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{p.paymentNumber}</td>
                    <td className="px-6 py-4">{p.season?.name || "Season"}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{p.netPayable.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ₹{p.amountPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">
                      ₹{p.balanceDue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-gray-800">{p.paymentMethod || "Direct Transfer"}</div>
                      <div className="text-gray-400 font-mono">{p.paymentReference || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
