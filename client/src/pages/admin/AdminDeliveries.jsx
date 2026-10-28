import { useEffect, useState, useCallback } from "react";
import { Truck, Plus, CheckCircle, Scale, X } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeRate, setActiveRate] = useState(3700);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    ticketId: "",
    vehicleNumber: "",
    grossWeightTonnes: "",
    tareWeightTonnes: "",
    ratePerTonne: 3700,
    deductions: 0,
    qualityNotes: "Standard cane, clean, trash < 1%",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [delRes, tickRes, rateRes] = await Promise.all([
        api.get("/deliveries"),
        api.get("/tickets?status=Approved"),
        api.get("/rates"),
      ]);

      setDeliveries(delRes.data.deliveries || []);
      const appTickets = tickRes.data.tickets || [];
      setTickets(appTickets);
      if (appTickets.length > 0) {
        setFormData((prev) => ({ ...prev, ticketId: appTickets[0]._id }));
      }

      if (rateRes.data.rates?.length > 0) {
        const r = rateRes.data.rates[0].ratePerTonne;
        setActiveRate(r);
        setFormData((prev) => ({ ...prev, ratePerTonne: r }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculated net & total
  const gross = Number(formData.grossWeightTonnes) || 0;
  const tare = Number(formData.tareWeightTonnes) || 0;
  const ded = Number(formData.deductions) || 0;
  const net = Math.max(0, Number((gross - tare).toFixed(3)));
  const accepted = Math.max(0, Number((net - ded).toFixed(3)));
  const totalAmount = Math.round(accepted * Number(formData.ratePerTonne || activeRate));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.ticketId) {
      setFormError("Please select a valid approved ticket.");
      return;
    }
    if (gross <= tare) {
      setFormError("Gross weight must be strictly greater than tare weight.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/admin/deliveries", {
        ...formData,
        grossWeightTonnes: gross,
        tareWeightTonnes: tare,
        deductions: ded,
      });

      setModalOpen(false);
      setFormData({
        ticketId: tickets[0]?._id || "",
        vehicleNumber: "",
        grossWeightTonnes: "",
        tareWeightTonnes: "",
        ratePerTonne: activeRate,
        deductions: 0,
        qualityNotes: "Standard cane, clean",
      });
      await loadData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && deliveries.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weighbridge & Cane Deliveries</h1>
          <p className="text-sm text-gray-500">Record certified weighments, gross/tare weights, and generate delivery vouchers</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" /> New Weighment Entry
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto table-responsive">
          <table className="min-w-[700px] w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Receipt #</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Farmer</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Vehicle</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Gross & Tare</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Net Accepted</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Rate</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Amount Payable</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                    No weighment entries recorded yet.
                  </td>
                </tr>
              ) : (
                deliveries.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-gray-900 whitespace-nowrap">{d.receiptNumber}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">{d.farmer?.name}</div>
                      <div className="text-xs text-gray-400">{d.farmer?.farmerId}</div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-mono text-xs whitespace-nowrap">{d.vehicleNumber}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs whitespace-nowrap">
                      <div>G: {d.grossWeightTonnes} T</div>
                      <div className="text-gray-400">T: {d.tareWeightTonnes} T</div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-gray-900 whitespace-nowrap">
                      {d.acceptedQuantityTonnes} Tonnes
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">₹{d.ratePerTonne}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-emerald-700 whitespace-nowrap">
                      ₹{d.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(d.deliveryDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Weighment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Record Cane Delivery & Weighment</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Approved Supply Ticket</label>
                <select
                  required
                  value={formData.ticketId}
                  onChange={(e) => setFormData({ ...formData, ticketId: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- Select Ticket --</option>
                  {tickets.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.ticketNumber} &mdash; {t.farmer?.name} ({t.allocatedQuantityTonnes} T allocated)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle / Cart Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UP 15 AB 4589"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm uppercase focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gross Weight (Tonnes)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    placeholder="e.g. 14.80"
                    value={formData.grossWeightTonnes}
                    onChange={(e) => setFormData({ ...formData, grossWeightTonnes: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tare Weight (Tonnes)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 4.20"
                    value={formData.tareWeightTonnes}
                    onChange={(e) => setFormData({ ...formData, tareWeightTonnes: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate / Tonne (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.ratePerTonne}
                    onChange={(e) => setFormData({ ...formData, ratePerTonne: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trash Deductions (Tonnes)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Real-time Calculation Preview */}
              <div className="rounded-2xl bg-brand-50/70 p-4 border border-brand-200">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Net Sugarcane Weight:</span>
                  <span className="font-bold text-gray-900">{net} Tonnes</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Accepted Quantity (After Ded):</span>
                  <span className="font-bold text-brand-900">{accepted} Tonnes</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-emerald-800 border-t border-brand-200 pt-2 mt-2">
                  <span>Calculated Amount:</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Record & Verify Weighment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
