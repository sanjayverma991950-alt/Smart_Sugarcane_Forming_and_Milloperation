import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Plus, X, Send } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/units";

export default function FarmerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    category: "Tickets",
    subject: "",
    description: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data.complaints || []);
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
    setSubmitting(true);
    try {
      await api.post("/complaints", formData);
      setModalOpen(false);
      setFormData({ category: "Tickets", subject: "", description: "" });
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
          <h1 className="text-2xl font-bold text-brand-900">Farmer Complaints & Support</h1>
          <p className="text-sm text-gray-500">Submit questions or discrepancies regarding tickets, deliveries, or payments</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints filed"
          text="If you face any issues with ticket allocations, weighment discrepancies, or payment delays, you can raise an official query here."
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
            >
              Raise a support ticket
            </button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {complaints.map((c) => (
            <div key={c._id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{c.complaintNumber}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                      {c.category}
                    </span>
                  </div>
                  <h2 className="mt-1 text-base font-bold text-gray-800">{c.subject}</h2>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      c.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : c.status === "Under Review"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {c.status}
                  </span>
                  <p className="mt-1 text-[11px] text-gray-400">{formatDate(c.createdAt)}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{c.description}</p>

              {c.adminResponse && (
                <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
                  <p className="text-xs font-bold text-brand-900">Sugar Mill Administrator Response:</p>
                  <p className="mt-1 text-sm text-gray-800">{c.adminResponse}</p>
                  {c.resolvedAt && (
                    <p className="mt-2 text-[10px] text-gray-400">Resolved on: {formatDate(c.resolvedAt)}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">Submit a Complaint</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="Tickets">Tickets & Supply Chits</option>
                  <option value="Deliveries">Deliveries & Weighments</option>
                  <option value="Payments">Payment Discrepancies</option>
                  <option value="Weighment Discrepancy">Weighment Discrepancy</option>
                  <option value="Field Information">Field Information</option>
                  <option value="Other">Other Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weighment receipt missing for vehicle UP15 AB 4589"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue with dates and vehicle or ticket numbers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
