// 📁 pages/dashboard/[plantId]/index.jsx
import { useRouter } from "next/router";
import { usePlantDetail } from "@/hooks/usePlantDetail";
import { applyAction } from "@/lib/actionService";
import SensorBar from "@/components/SensorBar";

export default function PlantDetail() {
  const { plantId } = useRouter().query;
  const { plant, sensors, actions, loading, error, mutate } = usePlantDetail(plantId);

  if (loading) return <p className="p-4">Chargement…</p>;
  if (error) return <p className="p-4 text-red-500">Erreur : {error.message}</p>;

  const mainSensorType = plant.main_sensor || "soil_moisture";
  const mainSensor = (sensors || []).find(s => s.type === mainSensorType);
  const badgeColor =
    mainSensor?.status === "OK"        ? "bg-green-500"
    : mainSensor?.status === "LOW"     ? "bg-yellow-400"
    : mainSensor?.status === "CRITICAL"? "bg-red-500"
    : "bg-gray-300";

  const latestByType = {};
  (sensors || []).forEach((s) => {
    if (!latestByType[s.type] || new Date(s.timestamp) > new Date(latestByType[s.type].timestamp)) {
      latestByType[s.type] = s;
    }
  });

  const handleAction = async (sensor_type) => {
    await applyAction(plantId, { sensor_type });
    mutate(); // refresh everything
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* 🔹 Title + description + image */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">{plant.plant_name}</h1>
        <p className="text-sm text-gray-500">{plant.plant_type}</p>
        <p className="text-gray-600">{plant.description}</p>
        {plant.image_url && (
          <img
            src={plant.image_url}
            alt={plant.plant_name}
            className="w-full max-h-[400px] object-cover rounded-xl shadow"
          />
        )}
      </div>

      {/* 🔸 Sensor + Actions Card */}
      <div className="p-6 space-y-6 bg-white rounded-xl shadow">
        {/* Status & mode */}
        <div className="flex items-center justify-between">
          <span className={`text-xs text-white px-2 py-0.5 rounded ${badgeColor}`}>
            {mainSensor?.status || "—"}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded 
            ${plant.is_automatic ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
            {plant.is_automatic ? "AUTO" : "MANUAL"}
          </span>
        </div>

        {/* Sensor bar grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <SensorBar
            icon="🌱"
            label="Moisture"
            value={latestByType.soil_moisture?.value}
            barColor="blue"
            unit="%"
          />
          <SensorBar
            icon="💡"
            label="Light"
            value={latestByType.light?.value}
            barColor="amber"
            unit="lx"
          />
          <SensorBar
            icon="🌡️"
            label="Temp"
            value={latestByType.temperature?.value}
            barColor="orange"
            unit="°C"
          />
          <SensorBar
            icon="💧"
            label="Humidity"
            value={latestByType.humidity?.value}
            barColor="pink"
            unit="%"
          />
        </div>

        {/* Last watered */}
        <div className="text-xs text-right text-gray-500">
          Last watered: {plant.lastActionAt ? new Date(plant.lastActionAt).toLocaleString() : "—"}
        </div>

        {/* Manual Actions */}
        {!plant.is_automatic && (
            <div className="mt-4">
                <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full py-3 rounded-lg shadow">
                🚨 Launch Action
                </button>
                <p className="text-xs text-gray-400 text-center mt-1">Based on latest critical sensor</p>
            </div>
        )}

        {/* Actions Log */}
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
    </div>
  );
}
