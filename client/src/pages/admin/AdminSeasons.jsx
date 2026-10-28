import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Plus, Edit2, X, Check } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    tentativeStartDate: "",
    confirmedStartDate: "",
    expectedEndDate: "",
    status: "planned",
    notes: "",
    updatedReason: "",
  });

  const loadSeasons = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/seasons");
      setSeasons(res.data.seasons || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeasons();
  }, [loadSeasons]);

  const openCreate = () => {
    setEditingSeason(null);
    setFormData({
      name: `2026-2027`,
      tentativeStartDate: "",
      confirmedStartDate: "",
      expectedEndDate: "",
      status: "planned",
      notes: "",
      updatedReason: "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingSeason(s);
    setFormData({
      name: s.name,
      tentativeStartDate: s.tentativeStartDate ? s.tentativeStartDate.split("T")[0] : "",
      confirmedStartDate: s.confirmedStartDate ? s.confirmedStartDate.split("T")[0] : "",
      expectedEndDate: s.expectedEndDate ? s.expectedEndDate.split("T")[0] : "",
      status: s.status,
      notes: s.notes || "",
      updatedReason: s.updatedReason || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      if (editingSeason) {
        await api.patch(`/admin/seasons/${editingSeason._id}`, formData);
      } else {
        await api.post("/admin/seasons", formData);
      }
      setModalOpen(false);
      await loadSeasons();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && seasons.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crushing Seasons Management</h1>
          <p className="text-sm text-gray-500">Configure annual sugar mill crushing cycles, opening dates, and status</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" /> Create Season
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadSeasons} />}

      <div className="grid gap-6 md:grid-cols-2">
        {seasons.map((s) => (
          <div key={s._id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-brand-700">Season</span>
                <h2 className="text-xl font-bold text-gray-900">{s.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                    s.status === "active"
                      ? "bg-green-100 text-green-800"
                      : s.status === "completed"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {s.status}
                </span>
                <button
                  onClick={() => openEdit(s)}
                  className="rounded-lg border p-1.5 text-gray-600 hover:bg-gray-50"
                  title="Edit Season"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Tentative Opening</p>
                <p className="font-semibold text-gray-800">{formatDate(s.tentativeStartDate)}</p>
              </div>
              <div className="rounded-xl bg-brand-50/50 p-3">
                <p className="text-xs text-brand-700">Confirmed Opening</p>
                <p className="font-semibold text-gray-800">
                  {s.confirmedStartDate ? formatDate(s.confirmedStartDate) : "Pending"}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Expected Closing</p>
                <p className="font-semibold text-gray-800">{formatDate(s.expectedEndDate)}</p>
              </div>
            </div>

            {s.notes && (
              <p className="mt-3 text-xs text-gray-500 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                {s.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSeason ? `Edit Season ${editingSeason.name}` : "Create Crushing Season"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Season Name / Year</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-2027"
                  disabled={Boolean(editingSeason)}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tentative Start</label>
                  <input
                    type="date"
                    required
                    value={formData.tentativeStartDate}
                    onChange={(e) => setFormData({ ...formData, tentativeStartDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmed Start</label>
                  <input
                    type="date"
                    value={formData.confirmedStartDate}
                    onChange={(e) => setFormData({ ...formData, confirmedStartDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes / Circular</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {editingSeason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason for Update (Sent to farmers)</label>
                  <input
                    type="text"
                    placeholder="e.g. Opening rescheduled due to unseasonal rain"
                    value={formData.updatedReason}
                    onChange={(e) => setFormData({ ...formData, updatedReason: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}

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
                  className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingSeason ? "Update Season" : "Create Season"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
