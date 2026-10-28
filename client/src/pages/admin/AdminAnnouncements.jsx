import { useEffect, useState, useCallback } from "react";
import { Megaphone, Plus, X, Send } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetRole: "all",
    priority: "medium",
    category: "general",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await api.post("/admin/announcements", formData);
      setModalOpen(false);
      setFormData({
        title: "",
        message: "",
        targetRole: "all",
        priority: "medium",
        category: "general",
      });
      await loadData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && announcements.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sugar Mill Announcements</h1>
          <p className="text-sm text-gray-500">Publish operational notices, seasonal dates, and alerts to farmers</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" /> Publish Announcement
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-400">
            No announcements published yet.
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a._id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                      a.priority === "urgent" || a.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {a.priority} Priority
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 uppercase">
                    {a.category}
                  </span>
                  <span className="text-xs text-gray-400">Audience: {a.targetRole}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(a.publishedAt)}</span>
              </div>
              <h2 className="mt-3 text-lg font-bold text-gray-900">{a.title}</h2>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{a.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Publish New Announcement</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weighbridge #2 Maintenance on Thursday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="general">General Notice</option>
                    <option value="season">Crushing Season</option>
                    <option value="rates">Procurement Rates</option>
                    <option value="weather">Weather Alert</option>
                    <option value="advisory">Crop Advisory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Triggers notifications)</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide detailed instructions or notice information..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Publishing..." : "Broadcast Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
