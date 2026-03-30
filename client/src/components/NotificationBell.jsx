import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const TYPE_ICONS = {
  budget_exceeded: "🚨",
  budget_warning: "⚠️",
  goal_completed: "🎉",
  goal_milestone: "🎯",
};

export default function NotificationBell() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/notifications");
      setAlerts(res.data.alerts || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (alertId) => {
    try {
      await api.put(`/notifications/${alertId}/read`);
      setAlerts((prev) =>
        prev.map((a) => (a.alert_id === alertId ? { ...a, is_read: true } : a))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const markAllRead = async () => {
    setLoading(true);
    try {
      await api.put("/notifications/read-all");
      setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffHrs = Math.floor(diffMs / 3600000);
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-sm text-gray-800">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={loading}
                className="text-xs text-wisegreen hover:underline disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                <p className="text-2xl mb-1">🎉</p>
                No notifications yet
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.alert_id}
                  onClick={() => !alert.is_read && markRead(alert.alert_id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !alert.is_read ? "bg-green-50/60" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5 flex-shrink-0">
                      {TYPE_ICONS[alert.type] || "🔔"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold leading-snug ${
                          !alert.is_read ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDate(alert.created_at)}
                      </p>
                    </div>
                    {!alert.is_read && (
                      <span className="w-2 h-2 bg-wisegreen rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <Link to="/dashboard/settings" onClick={() => setOpen(false)} className="text-xs text-wisegreen hover:underline">
              Manage notification settings →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
