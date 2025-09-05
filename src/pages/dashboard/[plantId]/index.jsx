import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePlantDetail } from "@/hooks/usePlantDetail";
import axios from "@/lib/axios";
import SensorCard from "@/components/SensorCard";
import { AppLayout } from "@/layout/AppLayout";
import { FiMoreVertical } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* ========= Images: FORCER /api/uploads =========
   On reconstruit l'URL à partir de NEXT_PUBLIC_STATIC_BASE,
   même si plant.image_url est déjà une URL absolue. */
const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE || "https://awm.portfolio-etudiant-rouen.com/api").replace(/\/+$/, "");

const toPlantImageUrl = (raw = "") => {
  if (!raw) return "";

  // 1) enlève protocole+host si présents
  let p = String(raw).trim().replace(/^https?:\/\/[^/]+\/?/, "");

  // 2) normalise le chemin
  p = p.replace(/^\/+/, "");   // enlève les / en tête
  p = p.replace(/^api\/+/, ""); // enlève un "api/" parasite

  // 3) s'assure qu'on commence par uploads/
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;

  // 4) reconstruit systématiquement sur BASE (qui contient déjà /api)
  return `${STATIC_BASE}/${p}`; // → .../api/uploads/xxx
};
/* ============================================== */

export default function PlantDetail() {
  const router = useRouter(); // Call useRouter() at the top level
  const { plantId } = router.query;
  const { plant, sensors, actions, loading, error, mutate } = usePlantDetail(plantId);

  const [showMenu, setShowMenu] = useState(false); // For the 3-dots menu
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation modal
  const [loadingAction, setLoadingAction] = useState(false);

  const latestByType = {};
  (sensors || []).forEach((s) => {
    if (!latestByType[s.type] || new Date(s.timestamp) > new Date(latestByType[s.type].timestamp)) {
      latestByType[s.type] = s;
    }
  });

  // Calculate overall plant status based on all sensors
  const getOverallStatus = () => {
    const allStatuses = Object.values(latestByType).map(sensor => sensor.status);
    if (allStatuses.includes("CRITICAL")) return "CRITICAL";
    if (allStatuses.includes("LOW")) return "LOW";
    if (allStatuses.length > 0 && allStatuses.every(status => status === "OK")) return "OK";
    return "UNKNOWN";
  };

  const overallStatus = getOverallStatus();
  const getBadgeStyle = (status) => {
    const styles = {
      OK: "bg-green-100 text-green-800 border-green-200",
      LOW: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CRITICAL: "bg-red-100 text-red-800 border-red-200",
      UNKNOWN: "bg-gray-100 text-gray-600 border-gray-200"
    };
    return styles[status] || styles.UNKNOWN;
  };

  const hasCriticalSensor = Object.values(latestByType).some((sensor) =>
    ["LOW", "CRITICAL"].includes(sensor.status)
  );

  const handleSimulateManualAction = async () => {
    try {
      const res = await axios.patch(`/simulation/simulate-response/${plantId}`);
      if (res.data.success) {
        console.log("✅ Manual actions applied:", res.data.updatedSensors);
        mutate();
      }
    } catch (err) {
      console.error("❌ Failed to simulate manual actions:", err);
      alert("Erreur lors du déclenchement de l'action manuelle.");
    }
  };

  const toggleAutomationMode = async () => {
    try {
      const res = await axios.patch(`/plants/${plantId}/automation`, {
        is_automatic: !plant.is_automatic,
      });
      if (res.data.success) {
        console.log("🌿 Automation mode updated");
        mutate();
      }
    } catch (err) {
      console.error("❌ Failed to toggle automation mode:", err);
      alert("Erreur lors de la mise à jour du mode automatique.");
    }
  };

  const handleDeletePlant = async () => {
    try {
      setLoadingAction(true);
      const res = await axios.delete(`/plants/${plantId}`);
      if (res.data.success) {
        alert("✅ Plante supprimée avec succès !");
        router.push("/dashboard"); // Redirect to the dashboard after deletion
      } else {
        alert("❌ Échec de la suppression de la plante.");
      }
    } catch (err) {
      console.error("❌ Failed to delete plant:", err);
      alert("Erreur lors de la suppression de la plante.");
    } finally {
      setLoadingAction(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditPlant = () => {
    router.push(`/plants/edit/${plantId}`); // Redirect to the edit page (to be constructed)
  };

  return (
    <AppLayout title={plant?.plant_name || "Détails de la Plante"}>
      <div className="space-y-6 mt-6 px-4">
        {loading ? (
          <div>
            <Skeleton height={200} className="rounded-lg" />
            <Skeleton width="60%" height={30} className="mt-4" />
            <Skeleton width="40%" height={20} className="mt-2" />
            <Skeleton width="100%" height={20} className="mt-2" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error.message}</p>
        ) : (
          <div>
            {/* 🔹 Info */}
            <div className="space-y-2 relative">
              <h1 className="text-2xl font-bold text-gray-800">{plant.plant_name}</h1>
              <p className="text-sm text-gray-500">{plant.plant_type}</p>
              <p className="text-gray-600">{plant.description}</p>
              {plant.image_url && (
                <img
                  src={toPlantImageUrl(plant.image_url)}
                  alt={plant.plant_name}
                  className="w-full max-h-[300px] object-cover rounded-lg shadow"
                />
              )}

              {/* 3-dots menu */}
              <div className="absolute top-0 right-0">
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <FiMoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete Plant
                    </button>
                    <button
                      onClick={handleEditPlant}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Plant
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 🔸 Sensor + Actions */}
            <div className="p-4 space-y-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between ">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getBadgeStyle(overallStatus)}`}>
                  {overallStatus === "UNKNOWN" ? "Unknown" : overallStatus}
                </span>
                <button
                  onClick={toggleAutomationMode}
                  className={`text-xs px-2 py-1 rounded border font-semibold shadow-sm hover:shadow transition ${
                    plant.is_automatic
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {plant.is_automatic ? "AUTO" : "MANUAL"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SensorCard 
                  type="soil_moisture" 
                  value={latestByType.soil_moisture?.value} 
                  status={latestByType.soil_moisture?.status || "OK"}
                  isManual={!plant.is_automatic}
                  onAction={handleSimulateManualAction}
                />
                <SensorCard 
                  type="light" 
                  value={latestByType.light?.value} 
                  status={latestByType.light?.status || "OK"}
                  isManual={!plant.is_automatic}
                  onAction={handleSimulateManualAction}
                />
                <SensorCard 
                  type="temperature" 
                  value={latestByType.temperature?.value} 
                  status={latestByType.temperature?.status || "OK"}
                  isManual={!plant.is_automatic}
                  onAction={handleSimulateManualAction}
                />
                <SensorCard 
                  type="humidity" 
                  value={latestByType.humidity?.value} 
                  status={latestByType.humidity?.status || "OK"}
                  isManual={!plant.is_automatic}
                  onAction={handleSimulateManualAction}
                />
              </div>

              <div className="text-xs text-right text-gray-500">
                Last watered: {plant.lastActionAt ? new Date(plant.lastActionAt).toLocaleString() : "—"}
              </div>

              <div className="mt-6">
                <h2 className="text-md font-semibold mb-2 text-[#0A5D2F]">Dernières actions</h2>
                {actions?.length ? (
                  <ul className="space-y-1 text-sm text-gray-700">
                    {actions.slice(0, 2).map((a) => (
                      <li key={a._id}>
                        {new Date(a.timestamp).toLocaleString()} — {a.action}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Aucune action enregistrée.</p>
                )}
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
                  <p className="text-sm text-gray-600 mt-2">
                    This action cannot be undone. Do you really want to delete this plant?
                  </p>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeletePlant}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      disabled={loadingAction}
                    >
                      {loadingAction ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
