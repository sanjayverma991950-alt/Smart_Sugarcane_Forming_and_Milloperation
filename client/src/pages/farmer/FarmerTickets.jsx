import { useEffect, useState, useCallback } from "react";
import { Plus, Ticket, AlertCircle, X, Check } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/units";

export default function FarmerTickets() {
  const [tickets, setTickets] = useState([]);
  const [fields, setFields] = useState([]);
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    fieldId: "",
    allocatedQuantityTonnes: "",
    deliverySlot: "Morning Slot (08:00 - 14:00)",
    requestNotes: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ticketRes, fieldRes, seasonRes] = await Promise.all([
        api.get("/tickets"),
        api.get("/fields?status=active"),
        api.get("/seasons/current"),
      ]);

      setTickets(ticketRes.data.tickets || []);
      setFields(fieldRes.data.fields || []);
      setSeason(seasonRes.data.season || null);
      if (fieldRes.data.fields?.length > 0) {
        setFormData((prev) => ({ ...prev, fieldId: fieldRes.data.fields[0]._id }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.allocatedQuantityTonnes || Number(formData.allocatedQuantityTonnes) <= 0) {
      setFormError("Please enter a valid requested quantity in tonnes.");
      return;
    }
    if (!season) {
      setFormError("No active crushing season found to request a ticket.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/tickets", {
        ...formData,
        seasonId: season._id,
      });
      setModalOpen(false);
      setFormData({
        fieldId: fields[0]?._id || "",
        allocatedQuantityTonnes: "",
        deliverySlot: "Morning Slot (08:00 - 14:00)",
        requestNotes: "",
      });
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">My Sugarcane Supply Tickets</h1>
          <p className="text-sm text-gray-500">Track requested, approved, and fulfilled supply chits</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Request Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          text="You haven't requested any supply tickets for the crushing season."
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
            >
              Request your first ticket
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Ticket Number</th>
                  <th className="px-6 py-4">Field</th>
                  <th className="px-6 py-4">Allocated / Supplied</th>
                  <th className="px-6 py-4">Valid Window</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Slot</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{t.ticketNumber}</td>
                    <td className="px-6 py-4">{t.field?.name || "General Allocation"}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{t.allocatedQuantityTonnes}</span> tonnes
                      <div className="text-xs text-gray-400">Supplied: {t.suppliedQuantityTonnes} T</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {formatDate(t.validFrom)} &mdash; {formatDate(t.expiryDate)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={t.status} />
                      {t.reviewReason && (
                        <p className="mt-1 text-xs text-gray-400 italic">Note: {t.reviewReason}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{t.deliverySlot || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">Request Sugarcane Supply Ticket</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Field (Optional)</label>
                <select
                  value={formData.fieldId}
                  onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- No specific field --</option>
                  {fields.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.variety || "General"}, {f.area} {f.areaUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Requested Quantity (Tonnes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  placeholder="e.g. 25"
                  value={formData.allocatedQuantityTonnes}
                  onChange={(e) => setFormData({ ...formData, allocatedQuantityTonnes: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Delivery Slot</label>
                <select
                  value={formData.deliverySlot}
                  onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="Morning Slot (08:00 - 14:00)">Morning Slot (08:00 - 14:00)</option>
                  <option value="Evening Slot (14:00 - 20:00)">Evening Slot (14:00 - 20:00)</option>
                  <option value="Night Slot (20:00 - 02:00)">Night Slot (20:00 - 02:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes / Remarks</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cane is mature and ready for cutting"
                  value={formData.requestNotes}
                  onChange={(e) => setFormData({ ...formData, requestNotes: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
