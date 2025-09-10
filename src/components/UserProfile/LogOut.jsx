import { useState } from "react";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";

export default function LogOut() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full bg-[#de3d31] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <BiLogOut className="text-xl" />
        {loading ? "Déconnexion..." : "Se déconnecter"}
      </button>
    </div>
  );
}
