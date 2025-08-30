//this page displays all notifications for the user
import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/notificationService";
import { AppLayout } from "@/layout/AppLayout";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("User ID not found in localStorage. Redirecting to login.");
          window.location.href = "/login";
          return;
        }

        const data = await getNotifications(userId);
        if (Array.isArray(data)) {
          setNotifications(data);
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

  return (
    <AppLayout title="Notifications">
      <div className="p-4">
        {loading && <div>Loading notifications...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && notifications.length === 0 && (
          <div className="text-gray-500">No notifications available</div>
        )}
        {!loading && !error && notifications.length > 0 && (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`p-4 bg-white shadow rounded-xl border-l-4 ${notif.type === 'plant' ? 'border-green-500' : 'border-blue-500'}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-green-700">{notif.title}</h3>
                  {!notif.is_read && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">New</span>
                  )}
                </div>
                <p className="text-gray-700">{notif.message}</p>
                <p className="text-gray-500 text-sm">{new Date(notif.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
