import { useRouter } from "next/router";
import { FaSignOutAlt } from "react-icons/fa";
import BackIcon from "../assets/icons/arrow-left.svg";

export default function ProfileHeader({ title = "Profil" }) {
  const router = useRouter();

  const handleLogout = () => {
    // Terminate the session (clear localStorage, cookies, etc.)
    localStorage.clear(); // Example: Clear localStorage
    sessionStorage.clear(); // Example: Clear sessionStorage
    // Redirect to login page
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow mb-4">
      {/* Arrow left */}
      <button
        onClick={() => router.back()}
        className="text-gray-600 hover:text-[#074221] text-xl cursor-pointer"
        aria-label="Retour"
      >
        <BackIcon />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-bold text-gray-800 text-center flex-1">
        {title}
      </h1>

      {/* Logout icon */}
      <button
        onClick={handleLogout}
        className="text-gray-600 hover:text-red-600 text-2xl"
        aria-label="Déconnexion"
      >
        <FaSignOutAlt />
      </button>
    </header>
  );
}