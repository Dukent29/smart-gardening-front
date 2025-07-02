// 📁 src/components/PlantCard.jsx
import { useRouter } from "next/router";
import SensorBar      from "./SensorBar";

// mapping couleur + label par status
const badgeMap = {
  OK:       ["bg-green-600", "Excellent"],
  LOW:      ["bg-yellow-400", "Attention"],
  CRITICAL: ["bg-red-500",   "Alerte"],
};

export default function PlantCard({ plant }) {
  const router = useRouter();

  // 🔑 1) Dernière mesure par type
  const latestByType = {};
  (plant.sensors || []).forEach((s) => {
    const key = s.type;
    // garde la plus récente
    if (!latestByType[key] || new Date(s.timestamp) > new Date(latestByType[key].timestamp)) {
      latestByType[key] = s;
    }
  });

  // 🔑 2) Capteur pivot (défini en DB ou fallback moist)
  const pivot = plant.main_sensor || "soil_moisture";
  const pivotStatus = latestByType[pivot]?.status || "OK";
  const [badgeColor, badgeText] = badgeMap[pivotStatus] ?? badgeMap.OK;

  // 🔑 3) Valeurs pour barres
  const latest = {
    soil:     latestByType.soil_moisture?.value,
    temp:     latestByType.temperature?.value,
    light:    latestByType.light?.value,
    humidity: latestByType.humidity?.value,
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/${plant.plant_id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col sm:flex-row justify-between"
    >
      {/* LEFT */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">{plant.plant_name}</h2>
        <p className="text-sm text-gray-500">{plant.plant_type}</p>
        <span className={`text-xs text-white px-2 py-0.5 rounded-full ${badgeColor} w-fit`}>
          {badgeText}
        </span>
      </div>

      {/* MIDDLE – 4 capteurs */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 items-center mt-4 sm:mt-0">
        <SensorBar icon="🌱" label="Moisture" value={latest.soil}      barColor="blue"   />
        <SensorBar icon="💡" label="Light"    value={latest.light}     barColor="amber"  unit="lx" />
        <SensorBar icon="🌡️" label="Temp"     value={latest.temp}      barColor="orange" unit="°C" />
        <SensorBar icon="💧" label="Humidity" value={latest.humidity}  barColor="pink"   />
      </div>

      {/* RIGHT */}
      <div className="text-xs text-gray-500 mt-4 sm:mt-0 sm:text-right">
        Last watered:{" "}
        {plant.lastActionAt
          ? new Date(plant.lastActionAt).toLocaleString()
          : "—"}
      </div>
    </div>
  );
}
