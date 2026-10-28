import { useEffect, useState, useCallback } from "react";
import { Truck, CheckCircle, Scale, FileText } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/units";

export default function FarmerDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/deliveries");
      setDeliveries(res.data.deliveries || []);
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

  const totalDeliveredTonnes = deliveries.reduce(
    (sum, d) => sum + (d.acceptedQuantityTonnes || 0),
    0
  );
  const totalAmountEarned = deliveries.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Sugarcane Delivery Receipts</h1>
          <p className="text-sm text-gray-500">Official weighbridge records and certified weights</p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Verified Supply</p>
          <p className="mt-2 text-3xl font-bold text-brand-700">
            {totalDeliveredTonnes.toFixed(2)} <span className="text-lg font-normal text-gray-600">Tonnes</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">{deliveries.length} verified weighments</p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Cane Value</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            ₹{totalAmountEarned.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-500">Calculated from approved procurement rates</p>
        </div>
      </div>

      {deliveries.length === 0 ? (
        <EmptyState
          title="No deliveries recorded yet"
          text="When your sugarcane trucks or carts reach the mill weighbridge, verified weighment slips will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Receipt #</th>
                  <th className="px-6 py-4">Date & Vehicle</th>
                  <th className="px-6 py-4">Gross & Tare</th>
                  <th className="px-6 py-4">Net Accepted</th>
                  <th className="px-6 py-4">Rate / T</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deliveries.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{d.receiptNumber}</td>
                    <td className="px-6 py-4">
                      <div>{formatDate(d.deliveryDate)}</div>
                      <div className="text-xs text-gray-400 font-mono">{d.vehicleNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>Gross: {d.grossWeightTonnes} T</div>
                      <div className="text-gray-400">Tare: {d.tareWeightTonnes} T</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {d.acceptedQuantityTonnes} Tonnes
                      {d.deductions > 0 && (
                        <div className="text-xs text-amber-600">Ded: -{d.deductions} T</div>
                      )}
                    </td>
                    <td className="px-6 py-4">₹{d.ratePerTonne}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ₹{d.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 capitalize">
                        <CheckCircle className="h-3 w-3" /> {d.status}
                      </span>
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
