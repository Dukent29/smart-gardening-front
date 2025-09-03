// src/components/NotificationBell.jsx
import { useEffect, useState } from "react";
import { FaBell, FaTrash, FaFileAlt, FaSeedling, FaExclamationCircle } from "react-icons/fa";
import { getNotifications } from "@/lib/notificationService";

export default function NotificationBell() {
  // Déclare TOUS les hooks sans condition (règle d’or React)
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch côté client uniquement
  useEffect(() => {
    let ignore = false;

    const fetchNotifications = async () => {
      try {
        if (typeof window === "undefined") return; // anti-SSR
        const userId = localStorage.getItem("userId");
        if (!userId) {
          // Redirige si pas connecté
          window.location.href = "/login";
          return;
        }

        const data = await getNotifications(userId);
        if (ignore) return;

        if (Array.isArray(data)) {
          setNotifications(data);
          setCount(data.filter((n) => !n.is_read).length);
        } else {
          console.warn("Invalid response structure:", data);
          setError("Failed to load notifications. Please try again later.");
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Error fetching notifications:", err);
          setError("Failed to load notifications. Please try again later.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchNotifications();
    return () => { ignore = true; };
  }, []);

  // Info support Notifications (client only) – pas d’erreur bruyante
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      console.log("Notifications are supported");
    } else {
      console.warn("Notifications unsupported (browser or SSR).");
    }
  }, []);

  const markNotificationAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, is_read: true } : n)));
      setCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.warn("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (typeof window === "undefined") return;
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      await fetch(`/api/notifications/${userId}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setCount(0);
    } catch (err) {
      console.warn("Error marking all notifications as read:", err);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-600 hover:text-blue-600 text-xl"
        aria-label="Notifications"
      >
        <FaBell />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
          <div className="p-2 text-sm font-bold border-b text-[#0A5D2F]">Notifications</div>

          <div className="max-h-60 overflow-y-auto">
            {error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-2 text-gray-500">No new notifications</div>
            ) : (
              <>
                {sortedNotifications.slice(0, 3).map((notif) => {
                  let Icon = FaFileAlt;
                  let iconColor = "text-gray-500 bg-gray-200";
                  switch (notif.type) {
                    case "delete": Icon = FaTrash; iconColor = "text-red-500 bg-red-200"; break;
                    case "article": Icon = FaFileAlt; iconColor = "text-blue-500 bg-blue-200"; break;
                    case "plant":
                    case "add_plant": Icon = FaSeedling; iconColor = "text-green-500 bg-green-200"; break;
                    case "alert": Icon = FaExclamationCircle; iconColor = "text-yellow-500 bg-yellow-200"; break;
                  }
                  return (
                    <div
                      key={notif._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => markNotificationAsRead(notif._id)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-sm text-[#0A5D2F] truncate">{notif.title}</div>
                        <div className="text-xs text-gray-500 truncate">{(notif.message || "").slice(0, 50)}...</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {notifications.length > 3 && (
                  <div
                    className="p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => { window.location.href = "/notifications"; }}
                  >
                    See more
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-2 border-t flex items-center justify-between">
            <button onClick={markAllAsRead} className="text-xs text-gray-600 hover:text-gray-800">
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
