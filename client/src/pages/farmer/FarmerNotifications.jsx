import { useEffect, useState, useCallback } from "react";
import { Bell, CheckCheck, Ticket, Truck, Wallet, Calendar, AlertCircle } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/units";

const iconMap = {
  ticket: Ticket,
  delivery: Truck,
  payment: Wallet,
  season: Calendar,
  weather: AlertCircle,
  info: Bell,
};

export default function FarmerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Notifications</h1>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread messages` : "All notifications read"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          text="You will receive alerts here when tickets are approved, weighments recorded, or payments disbursed."
        />
      ) : (
        <div className="divide-y rounded-2xl border border-gray-100 bg-white shadow-sm">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <div
                key={n._id}
                onClick={() => !n.isRead && markRead(n._id)}
                className={`flex items-start gap-4 p-5 transition cursor-pointer ${
                  n.isRead ? "bg-white hover:bg-gray-50" : "bg-brand-50/40 hover:bg-brand-50/70"
                }`}
              >
                <div
                  className={`rounded-xl p-2.5 shrink-0 ${
                    n.isRead ? "bg-gray-100 text-gray-600" : "bg-brand-100 text-brand-700 font-bold"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm ${n.isRead ? "font-semibold text-gray-800" : "font-bold text-brand-950"}`}>
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-gray-400 shrink-0">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">{n.message}</p>
                </div>
                {!n.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
