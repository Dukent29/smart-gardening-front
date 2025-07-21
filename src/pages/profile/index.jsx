import { useEffect, useState } from "react";
import UserInfo from "@/components/UserProfile/UserInfo";
import PrivacySettings from "@/components/UserProfile/PrivacySettings";
import HelpSupport from "@/components/UserProfile/HelpSupport";
import NotificationOptions from "@/components/UserProfile/NotificationOptions";
import HealthReport from "@/components/UserProfile/HealthReport";
import { getUserProfile } from "@/lib/userService";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import ProfileHeader from "@/components/ProfileHeader";


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
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebar />
      <div className="w-full">
      <ProfileHeader title="Mon Profil" />
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
      <BottomNav />
    </div>
  );
}