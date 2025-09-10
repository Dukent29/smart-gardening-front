// dossier: pages/dashboard · fichier: index.jsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; 
import { AppLayout } from "@/layout/AppLayout";
import PlantCard from "@/components/PlantCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { getPlantCount } from "@/lib/plantService";
import { FaSeedling } from "react-icons/fa";

import Link from "next/link";

export default function Dashboard() {
  const { data, loading, error } = useDashboardData();
  const [plantCount, setPlantCount] = useState(null);

  useEffect(() => {
    const fetchPlantCount = async () => {
      try {
        const count = await getPlantCount();
        setPlantCount(count);
      } catch (error) {
        console.error("Error fetching plant count:", error);
      }
    };

    fetchPlantCount();
  }, []);

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen relative">
      <Sidebar />
      <div className="flex-1 w-full max-w-lg mx-auto relative">
        <AppLayout title="Tableau de bord">
          <h1 className="text-2xl font-bold mb-4 text-[#074221] px-4">
            Vue d’ensemble du jardin
          </h1>

                    {/* Add Plant Count Card */}
          {!loading && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 mb-4">
              <div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <FaSeedling className="text-[#09552b] text-3xl" />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-[#09552b]">{plantCount}</p>
                  <p className="text-gray-500">Plantes</p>
                </div>
              </div>
            </div>
          )}

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
        
        <Link href="/plant/add" legacyBehavior>
          <a
            className="fixed bottom-24 right-8 bg-[#09552b] hover:bg-[#074221] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl z-50 transition-colors duration-200"
            aria-label="Ajouter une plante"
          >
            +
          </a>
        </Link>
      </div>
    </div>
  );
}
