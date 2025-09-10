
import { useEffect, useState } from "react";
import { FaBell, FaTrash, FaFileAlt, FaSeedling, FaExclamationCircle } from "react-icons/fa";
import { getNotifications } from "@/lib/notificationService";
import api from "@/lib/axios"; // ← instance axios (baseURL finit par /api)

export default function NotificationBell() {
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
          window.location.href = "/login";
          return;
        }

        const data = await getNotifications(userId);
        if (Array.isArray(data)) {
          // Check localStorage for persisted read state
          const persistedNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`)) || [];
          const mergedNotifications = data.map((notif) => {
            const persisted = persistedNotifications.find((p) => p._id === notif._id);
            return persisted ? { ...notif, is_read: persisted.is_read } : notif;
          });

          setNotifications(mergedNotifications);
          setCount(mergedNotifications.filter((n) => !n.is_read).length);
        } else {
          console.warn("Invalid response structure:", data);
          setError("Failed to load notifications. Please try again later.");
        }
      } catch (err) {
        console.warn("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchNotifications();
    return () => { ignore = true; };
  }, []);

  
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      console.log("Les notifications sont prises en charge");
    } else {
      console.warn("Notifications non prises en charge (navigateur ou SSR).");
    }
  }, []);

  const markNotificationAsRead = async (id) => {
    try {
      
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, is_read: true } : n))
      );
      setCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.warn("Erreur lors du marquage de la notification comme lue :", err);
    }
  };

  const markAllAsRead = () => {
    // Directly update the local state to mark all notifications as read
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setCount(0); // Reset the notification count to 0

    // Optionally, persist the updated state in localStorage
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const updatedNotifications = notifications.map((n) => ({ ...n, is_read: true }));
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
      }
    } catch (err) {
      console.warn("Failed to persist notifications in localStorage:", err);
    }
  };

  if (loading) {
    return <div>Chargement des notifications...</div>;
  }

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-600 hover:text-[#074221] text-xl cursor-pointer"
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
              <div className="p-2 text-gray-500">Aucune nouvelle notification</div>
            ) : (
              <>
                {sortedNotifications.slice(0, 3).map((notif) => {
                  let Icon = FaFileAlt;
                  let iconColor = "text-gray-500 bg-gray-200";
                  switch (notif.type) {
                    case "delete": Icon = FaTrash; iconColor = "text-[#de3d31] bg-red-200"; break;
                    case "article": Icon = FaFileAlt; iconColor = "text-blue-600 bg-blue-200"; break;
                    case "plant":
                    case "add_plant": Icon = FaSeedling; iconColor = "text-[#09552b] bg-[#8eb49f]"; break;
                    case "alert": Icon = FaExclamationCircle; iconColor = "text-yellow-600 bg-yellow-200"; break;
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
                    Voir plus
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-2 border-t flex items-center justify-between">
            <button onClick={markAllAsRead} className="text-xs text-gray-600 hover:text-gray-800">
              Tout marquer comme lu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
