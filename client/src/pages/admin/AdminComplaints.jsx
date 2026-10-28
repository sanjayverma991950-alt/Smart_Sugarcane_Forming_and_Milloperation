import { useEffect, useState, useCallback } from "react";
import { MessageSquare, CheckCircle, Clock, X } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [respondModal, setRespondModal] = useState(null);
  const [responseStatus, setResponseStatus] = useState("Resolved");
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadComplaints = useCallback(async () => {
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
    loadComplaints();
  }, [loadComplaints]);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!respondModal) return;

    setSubmitting(true);
    try {
      await api.patch(`/admin/complaints/${respondModal._id}`, {
        status: responseStatus,
        adminResponse,
      });

      setRespondModal(null);
      await loadComplaints();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && complaints.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Complaints & Grievances</h1>
          <p className="text-sm text-gray-500">Address farmer tickets, weighment queries, and payment disputes</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadComplaints} />}

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-400">
            No complaints submitted by farmers.
          </div>
        ) : (
          complaints.map((c) => (
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
                  <p className="text-xs text-gray-500">
                    By: <span className="font-semibold text-gray-700">{c.farmer?.name}</span> ({c.farmer?.mobile}) &bull; Village: {c.farmer?.village}
                  </p>
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
                  <p className="text-xs font-bold text-brand-900">Your Response:</p>
                  <p className="mt-1 text-sm text-gray-800">{c.adminResponse}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setRespondModal(c);
                    setResponseStatus(c.status || "Resolved");
                    setAdminResponse(c.adminResponse || "");
                  }}
                  className="rounded-xl border border-brand-700 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                >
                  {c.adminResponse ? "Edit Response" : "Respond / Resolve"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Respond Modal */}
      {respondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700">{respondModal.complaintNumber}</span>
                <h2 className="text-lg font-bold text-gray-900">Respond to Complaint</h2>
              </div>
              <button onClick={() => setRespondModal(null)} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResponseSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Awaiting Farmer Response">Awaiting Farmer Response</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Administrator Response</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain resolution, investigation findings, or weighbridge corrections..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRespondModal(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Submit Response"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
