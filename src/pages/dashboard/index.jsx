// dossier: pages/dashboard · fichier: index.jsx
import { AppLayout } from "@/layout/AppLayout";
import PlantCard from "@/components/PlantCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Sidebar from "@/components/Sidebar";

import { useRouter } from "next/router";
import BottomNav from "@/components/BottomNav";

export default function Dashboard() {
  useAuthGuard(); // Protects the route
  const { data, loading, error } = useDashboardData();
  const router = useRouter();

  return (
  <div className="flex bg-[#F5F5F5] min-h-screen relative">
    <Sidebar />
    <div className="flex-1 w-full max-w-md mx-auto relative">
      <AppLayout title="Tableau de bord">
        <h1 className="text-2xl font-bold mb-4 text-[#074221] text-center">
          Vue d’ensemble du jardin 🌿
        </h1>

        {loading && <p className="text-center text-gray-500">Chargement…</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
          {data.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </AppLayout>

      {/* ✅ Floating button */}
      <button
        onClick={() => router.push('/plant/add')}
        className="fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg z-50"
        aria-label="Ajouter une plante"
      >
        +
      </button>
    </div>

    <BottomNav />
  </div>
);

}
