// dossier: pages/dashboard · fichier: index.jsx
import { useDashboardData } from "@/hooks/useDashboardData";
import PlantCard            from "@/components/PlantCard";
import { useAuthGuard }     from "@/hooks/useAuthGuard";
import { DashboardLayout } from "@/layout/dashboardLayout";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";


export default function Dashboard() {
  useAuthGuard();                         // protège la route
  const { data, loading, error } = useDashboardData();
    console.log("DBG loading:", loading);
    console.log("DBG error:", error);
    console.log("DBG data:", data);


  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="p-4 flex-1">
          <Header title="Tableau de bord" />
          <h1 className="text-2xl font-bold mb-4">Vue d’ensemble du jardin 🌿</h1>
          {loading && <p>Chargement…</p>}
          {error   && <p className="text-red-500">{error}</p>}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
