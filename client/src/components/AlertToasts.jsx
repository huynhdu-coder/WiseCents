import { useState, useEffect } from "react";
import api from "../api/axios";

const TYPE_STYLES = {
  budget_exceeded: { bg: "bg-red-50", border: "border-red-300", icon: "🚨", text: "text-red-800" },
  budget_warning:  { bg: "bg-amber-50", border: "border-amber-300", icon: "⚠️", text: "text-amber-800" },
  goal_completed:  { bg: "bg-green-50", border: "border-green-300", icon: "🎉", text: "text-green-800" },
  goal_milestone:  { bg: "bg-blue-50", border: "border-blue-300", icon: "🎯", text: "text-blue-800" },
};

export default function AlertToasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/notifications");
        // Show at most 3 unread alerts as toasts
        const unread = (res.data.alerts || [])
          .filter((a) => !a.is_read)
          .slice(0, 3);
        setToasts(unread);
      } catch (err) {
        // silently ignore — toasts are non-critical
      }
    };

    fetchUnread();
  }, []);

  const dismiss = async (alertId) => {
    try {
      await api.put(`/notifications/${alertId}/read`);
    } catch (_) {}
    setToasts((prev) => prev.filter((t) => t.alert_id !== alertId));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const style = TYPE_STYLES[toast.type] || TYPE_STYLES.budget_warning;
        return (
          <div
            key={toast.alert_id}
            className={`${style.bg} ${style.border} border rounded-xl shadow-md px-4 py-3 flex items-start gap-3 animate-fade-in`}
          >
            <span className="text-xl flex-shrink-0">{style.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${style.text}`}>{toast.title}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismiss(toast.alert_id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-1 text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
