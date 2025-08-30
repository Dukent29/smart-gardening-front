import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { getNotifications } from "@/lib/notificationService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Ensure userId is retrieved
        if (!userId) {
          console.warn("User ID not found in localStorage. Redirecting to login.");
          window.location.href = "/login"; // Redirect to login page
          return;
        }

        const data = await getNotifications(userId);
        console.log(data); // Debugging: Check the structure of the response

        if (Array.isArray(data)) {
          setNotifications(data);
          setCount(data.filter((notif) => !notif.is_read).length);
        } else {
          console.error("Invalid response structure:", data);
          setError("Failed to load notifications. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, is_read: true } : notif
        )
      );
      setCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

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
          <div className="p-2 text-sm font-bold border-b">Notifications</div>
          <div className="max-h-60 overflow-y-auto">
            {error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-2 text-gray-500">No new notifications</div>
            ) : (
              <>
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => markAsRead(notif._id)}
                  >
                    {notif.message}
                  </div>
                ))}
                {notifications.length > 3 && (
                  <div
                    className="p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => (window.location.href = "/notifications")}
                  >
                    See more
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
