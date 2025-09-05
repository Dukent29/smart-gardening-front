import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/lib/notificationService";
import { AppLayout } from "@/layout/AppLayout";
import Skeleton from "react-loading-skeleton";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <AppLayout title="Notifications">
      <div className="p-4">
        {loading && (
          <ul className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="p-4 bg-white shadow rounded-xl">
                <Skeleton height={20} width={200} className="mb-2" />
                <Skeleton height={15} width={300} />
                <Skeleton height={15} width={150} className="mt-2" />
              </li>
            ))}
          </ul>
        )}
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
                  <h3 className="font-bold text-green-700 cursor-pointer" onClick={() => handleMarkAsRead(notif._id)}>{notif.title}</h3>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpenDropdown(notif._id)}>
                    &#x22EE;
                  </button>
                </div>
                <p className="text-gray-700">{notif.message}</p>
                <p className="text-gray-500 text-sm">{new Date(notif.createdAt).toLocaleString()}</p>
                <div className="relative">
                  {openDropdown === notif._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleMarkAsRead(notif._id);
                          setOpenDropdown(null);
                        }}
                      >
                        Mark as Read
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
