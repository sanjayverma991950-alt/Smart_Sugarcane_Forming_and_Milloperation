import { useEffect, useState } from "react";
import { ScrollText, ShieldAlert } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/audit-logs")
      .then((res) => setLogs(res.data.logs || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading && logs.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Audit Trails & Security Logs</h1>
        <p className="text-sm text-gray-500">Immutable chronological records of administrative modifications, approvals, and weighments</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                    No critical audit events recorded yet. System activity is tracked automatically.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-bold text-brand-900">{l.action}</td>
                    <td className="px-6 py-4">{l.admin?.name || "System Automated"}</td>
                    <td className="px-6 py-4 font-mono text-xs">{l.targetModel || "—"}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{l.ipAddress || "127.0.0.1"}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(l.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
