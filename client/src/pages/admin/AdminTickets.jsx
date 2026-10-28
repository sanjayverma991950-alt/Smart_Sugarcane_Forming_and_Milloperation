import { useEffect, useState, useCallback } from "react";
import { Ticket, CheckCircle, XCircle, Search, Filter, X } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/units";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reviewModal, setReviewModal] = useState(null); // ticket being reviewed
  const [reviewAction, setReviewAction] = useState("Approved");
  const [reviewReason, setReviewReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = statusFilter ? `/tickets?status=${statusFilter}` : "/tickets";
      const res = await api.get(url);
      setTickets(res.data.tickets || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModal) return;

    setSubmitting(true);
    try {
      await api.patch(`/admin/tickets/${reviewModal._id}/review`, {
        status: reviewAction,
        reviewReason,
      });
      setReviewModal(null);
      await loadTickets();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.patch(`/admin/tickets/${ticketId}/status`, { status: newStatus });
      await loadTickets();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading && tickets.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sugarcane Supply Tickets Management</h1>
          <p className="text-sm text-gray-500">Review farmer ticket requests, approve quotas, and track fulfillment</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-xs focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Partially Supplied">Partially Supplied</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadTickets} />}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto table-responsive">
          <table className="min-w-[720px] w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Ticket Number</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Farmer Details</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Field</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Allocated / Supplied</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Slot</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                    No tickets found for this filter.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-gray-900 whitespace-nowrap">{t.ticketNumber}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">{t.farmer?.name}</div>
                      <div className="text-xs text-gray-400 font-mono">
                        {t.farmer?.farmerId} &bull; {t.farmer?.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs whitespace-nowrap">
                      {t.field?.name || "General Plot"}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-semibold text-gray-900 whitespace-nowrap">
                      {t.allocatedQuantityTonnes} T
                      <div className="text-xs font-normal text-gray-400">
                        Supplied: {t.suppliedQuantityTonnes} T
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs text-gray-500 whitespace-nowrap">{t.deliverySlot}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                      {t.status === "Pending Review" ? (
                        <button
                          onClick={() => {
                            setReviewModal(t);
                            setReviewAction("Approved");
                            setReviewReason("");
                          }}
                          className="rounded-xl bg-brand-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-800 cursor-pointer"
                        >
                          Review Request
                        </button>
                      ) : (
                        <div className="inline-flex gap-1">
                          {t.status === "Approved" && (
                            <button
                              onClick={() => handleStatusChange(t._id, "Completed")}
                              className="rounded-lg border px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setReviewModal(t);
                              setReviewAction(t.status === "Approved" ? "Rejected" : "Approved");
                              setReviewReason(t.reviewReason || "");
                            }}
                            className="rounded-lg border px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700">{reviewModal.ticketNumber}</span>
                <h2 className="text-lg font-bold text-gray-900">Review Ticket Request</h2>
              </div>
              <button onClick={() => setReviewModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <p>Farmer: <span className="font-semibold text-gray-900">{reviewModal.farmer?.name}</span></p>
              <p>Requested Quantity: <span className="font-semibold text-gray-900">{reviewModal.allocatedQuantityTonnes} Tonnes</span></p>
              {reviewModal.requestNotes && <p className="mt-1 italic">&ldquo;{reviewModal.requestNotes}&rdquo;</p>}
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Decision</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewAction("Approved")}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                      reviewAction === "Approved"
                        ? "border-green-600 bg-green-50 text-green-800"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Approve Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction("Rejected")}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                      reviewAction === "Rejected"
                        ? "border-red-600 bg-red-50 text-red-800"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Reject Request
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {reviewAction === "Approved" ? "Approval Notes (Optional)" : "Rejection Reason (Required)"}
                </label>
                <textarea
                  rows={3}
                  required={reviewAction === "Rejected"}
                  placeholder={
                    reviewAction === "Approved"
                      ? "e.g. Approved as per field survey"
                      : "e.g. Allocation limit for this crushing window reached"
                  }
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Confirm Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
