// src/components/Header.jsx
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import BackIcon from "../assets/icons/arrow-left.svg";
import ProfilIcon from "../assets/icons/profil.svg";

function BellSkeleton() {
  return (
    <div
      className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"
      aria-hidden="true"
      title="Chargement…"
    />
  );
}


const NotificationBell = dynamic(() => import("./NotificationBell"), {
  ssr: false,
  loading: () => <BellSkeleton />,
});

export default function Header({ title = "Page" }) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
      {/* Bouton retour */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-gray-600 hover:text-[#074221] text-xl cursor-pointer"
        aria-label="Retour"
      >
        <BackIcon aria-hidden="true" />
      </button>

      {/* Titre */}
      <h1 className="text-lg font-bold text-gray-800 text-center flex-1">
        {title}
      </h1>

      {/* Notifications + Profil */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="text-gray-600 text-2xl"
          aria-label="Profil"
        >
          <ProfilIcon aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
