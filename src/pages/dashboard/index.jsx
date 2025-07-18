// dossier: pages/dashboard · fichier: index.jsx
import { useDashboardData } from "@/hooks/useDashboardData";
import PlantCard            from "@/components/PlantCard";
import { useAuthGuard }     from "@/hooks/useAuthGuard";
import { DashboardLayout } from "@/layout/dashboardLayout";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useRouter } from "next/router"; // Import useRouter from next/router


export default function Dashboard() {
  useAuthGuard();                         // protège la route
  const { data, loading, error } = useDashboardData();
  const router = useRouter(); // Initialise useRouter
    console.log("DBG loading:", loading);
    console.log("DBG error:", error);
    console.log("DBG data:", data);


  return (
    <DashboardLayout>
      <div className="flex bg-[#F5F5F5] relative">
        <Sidebar />
        <div className="flex-1">
          <Header title="Tableau de bord" />
          <h1 className="text-2xl font-bold mb-4 text-[#074221] p-4">Vue d’ensemble du jardin </h1>
          {loading && <p>Chargement…</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
            {data.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>

          {/* Floating Button */}
          <button
            onClick={() => router.push("/plant/add")}
            className="fixed bottom-6 right-6 w-[52px] h-[52px] bg-[#B3CDBF] text-[#074221] rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#A3BCAF] transition"
            aria-label="Ajouter une plante"
          >
            +
          </button>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
