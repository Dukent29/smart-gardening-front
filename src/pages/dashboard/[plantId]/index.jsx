import { useState } from "react";
import { useRouter } from "next/router";
import { usePlantDetail } from "@/hooks/usePlantDetail";
import axios from "@/lib/axios";
import SensorBar from "@/components/SensorBar";
import { AppLayout } from "@/layout/AppLayout";
import { FiMoreVertical } from "react-icons/fi";

export default function PlantDetail() {
  const { plantId } = useRouter().query;
  const { plant, sensors, actions, loading, error, mutate } = usePlantDetail(plantId);

  const [showMenu, setShowMenu] = useState(false); // For the 3-dots menu
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation modal
  const [loadingAction, setLoadingAction] = useState(false);

  if (loading) return <p className="p-4 text-center">Chargement…</p>;
  if (error) return <p className="p-4 text-center text-red-500">Erreur : {error.message}</p>;

  const mainSensorType = plant.main_sensor || "soil_moisture";
  const mainSensor = (sensors || []).find((s) => s.type === mainSensorType);
  const badgeColor =
    mainSensor?.status === "OK"
      ? "bg-green-500"
      : mainSensor?.status === "LOW"
      ? "bg-yellow-400"
      : mainSensor?.status === "CRITICAL"
      ? "bg-red-500"
      : "bg-gray-300";

  const latestByType = {};
  (sensors || []).forEach((s) => {
    if (!latestByType[s.type] || new Date(s.timestamp) > new Date(latestByType[s.type].timestamp)) {
      latestByType[s.type] = s;
    }
  });

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
        {/* 🔹 Info */}
        <div className="space-y-2 relative">
          <h1 className="text-2xl font-bold text-gray-800">{plant.plant_name}</h1>
          <p className="text-sm text-gray-500">{plant.plant_type}</p>
          <p className="text-gray-600">{plant.description}</p>
          {plant.image_url && (
            <img
              src={plant.image_url}
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
          <div className="flex items-center justify-between">
            <span className={`text-xs text-white px-2 py-0.5 rounded ${badgeColor}`}>
              {mainSensor?.status || "—"}
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

          <div className="grid grid-cols-2 gap-4 items-center">
            <SensorBar icon="🌱" label="Moisture" value={latestByType.soil_moisture?.value} barColor="blue" unit="%" />
            <SensorBar icon="💡" label="Light" value={latestByType.light?.value} barColor="amber" unit="lx" />
            <SensorBar icon="🌡️" label="Temp" value={latestByType.temperature?.value} barColor="orange" unit="°C" />
            <SensorBar icon="💧" label="Humidity" value={latestByType.humidity?.value} barColor="pink" unit="%" />
          </div>

          <div className="text-xs text-right text-gray-500">
            Last watered: {plant.lastActionAt ? new Date(plant.lastActionAt).toLocaleString() : "—"}
          </div>

          {!plant.is_automatic && hasCriticalSensor && (
            <div className="mt-4">
              <button
                onClick={handleSimulateManualAction}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full py-3 rounded-lg shadow"
              >
                🚨 Launch Manual Action
              </button>
              <p className="text-xs text-gray-400 text-center mt-1">
                Based on latest critical or low sensor
              </p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Dernières actions</h2>
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
    </AppLayout>
  );
}
