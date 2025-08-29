// dossier: pages/dashboard · fichier: index.jsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import { AppLayout } from "@/layout/AppLayout";
import PlantCard from "@/components/PlantCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

import Link from "next/link";

export default function Dashboard() {
  const { data, loading, error } = useDashboardData();

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen relative">
      <Sidebar />
      <div className="flex-1 w-full max-w-md mx-auto relative">
        <AppLayout title="Tableau de bord">
          <h1 className="text-2xl font-bold mb-4 text-[#074221] px-4">
            Vue d’ensemble du jardin
          </h1>

          {loading && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
              {/* Skeleton placeholders for cards */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow">
                  <Skeleton height={150} className="rounded-lg" />
                  <Skeleton width="60%" height={20} className="mt-2" />
                  <Skeleton width="40%" height={20} className="mt-1" />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
              {data.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          )}
        </AppLayout>

        <BottomNav />
        {/* Floating Add Plant Button */}
        <Link href="/plant/add" legacyBehavior>
          <a
            className="fixed bottom-24 right-8 bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl z-50 transition-colors duration-200"
            aria-label="Ajouter une plante"
          >
            +
          </a>
        </Link>
      </div>
    </div>
  );
}
