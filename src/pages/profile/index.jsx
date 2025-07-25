import { useEffect, useState } from "react";
import { AppLayout } from "@/layout/AppLayout";
import UserInfo from "@/components/UserProfile/UserInfo";
import PrivacySettings from "@/components/UserProfile/PrivacySettings";
import HelpSupport from "@/components/UserProfile/HelpSupport";
import NotificationOptions from "@/components/UserProfile/NotificationOptions";
import HealthReport from "@/components/UserProfile/HealthReport";
import { getUserProfile } from "@/lib/userService";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      });
  }, []);

  return (
    <AppLayout title="Mon Profil">
      <div className="space-y-6 mt-6 px-4">
        {!user ? (
          <div className="text-center text-gray-400">Loading user info...</div>
        ) : (
          <UserInfo user={user} />
        )}
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <PrivacySettings />
          <HelpSupport />
          <NotificationOptions />
          <HealthReport />
        </div>
      </div>
    </AppLayout>
  );
}