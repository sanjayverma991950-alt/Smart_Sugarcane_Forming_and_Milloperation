import { useEffect, useState, useCallback } from "react";
import { Wallet, Plus, CheckCircle, ArrowDownRight, X } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/units";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disburseModal, setDisburseModal] = useState(null);
  const [disburseAmount, setDisburseAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Direct Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/payments");
      setPayments(res.data.payments || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleDisburseSubmit = async (e) => {
    e.preventDefault();
    if (!disburseModal) return;

    setFormError("");
    setSubmitting(true);
    try {
      await api.post(`/admin/payments/${disburseModal._id}/disburse`, {
        amount: Number(disburseAmount),
        paymentMethod,
        paymentReference,
      });

      setDisburseModal(null);
      await loadPayments();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && payments.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Payments Management</h1>
          <p className="text-sm text-gray-500">Record banking disbursements, maintain verified payment ledgers, and manage balances</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadPayments} />}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto table-responsive">
          <table className="min-w-[700px] w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Payment #</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Farmer Details</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Season</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Net Payable</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Amount Paid</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Balance Due</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                    No payment accounts created yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-gray-900 whitespace-nowrap">{p.paymentNumber}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">{p.farmer?.name}</div>
                      <div className="text-xs text-gray-400">{p.farmer?.mobile} &bull; {p.farmer?.farmerId}</div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs whitespace-nowrap">{p.season?.name}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-semibold text-gray-900 whitespace-nowrap">
                      ₹{p.netPayable.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-emerald-600 whitespace-nowrap">
                      ₹{p.amountPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-bold text-amber-600 whitespace-nowrap">
                      ₹{p.balanceDue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                      {p.balanceDue > 0 ? (
                        <button
                          onClick={() => {
                            setDisburseModal(p);
                            setDisburseAmount(p.balanceDue);
                            setPaymentReference(`NEFT-${Date.now().toString().slice(-6)}`);
                            setFormError("");
                          }}
                          className="rounded-xl bg-brand-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-800 cursor-pointer"
                        >
                          Disburse
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold">Fully Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disburse Modal */}
      {disburseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700">{disburseModal.paymentNumber}</span>
                <h2 className="text-lg font-bold text-gray-900">Disburse Payment to Farmer</h2>
              </div>
              <button onClick={() => setDisburseModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-700">
              <p>Farmer: <span className="font-bold">{disburseModal.farmer?.name}</span></p>
              <p>Total Outstanding: <span className="font-bold text-amber-700">₹{disburseModal.balanceDue.toLocaleString("en-IN")}</span></p>
            </div>

            <form onSubmit={handleDisburseSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Disbursement Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={disburseModal.balanceDue}
                  value={disburseAmount}
                  onChange={(e) => setDisburseAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Reference / UTR Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR-SBI-8923419"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm uppercase focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setDisburseModal(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Processing..." : "Record Payment Disbursement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
