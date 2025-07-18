import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import ProfilIcon from "../assets/icons/profil.svg"; 
import BackIcon from "../assets/icons/arrow-left.svg";

export default function Header({ title = "Page" }) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow  ">
      {/* Arrow left */}
      <button
        onClick={() => router.back()}
        className="text-gray-600 hover:text-blue-600 text-xl"
        aria-label="Retour"
      >
        <BackIcon />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-bold text-gray-800 text-center flex-1">
        {title}
      </h1>

      {/* Profile icon */}
      <button
        onClick={() => router.push("/profile")}
        className="text-gray-600 hover:text-blue-600 text-2xl"
        aria-label="Profil"
      >
        <ProfilIcon/>
      </button>
    </header>
  );
}