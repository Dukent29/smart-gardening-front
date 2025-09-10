import { useRouter } from "next/router";
import { motion } from "framer-motion";
import SensorCard from "./SensorCard";
import axios from "@/lib/axios";
import {
  buildLatestByType,
  overallStatusFromLatest,
} from "@/utils/sensorsClient";

export default function PlantCard({ plant }) {
  const router = useRouter();

  // 1) latestByType avec fallback si pas de sensors
  const latestByType = buildLatestByType(plant.sensors, plant.plant_id);

  // 2) overall
  const overallStatus = overallStatusFromLatest(latestByType);

  const getBadgeStyle = (status) => {
    const styles = {
      OK: "bg-green-100 text-green-800 border-green-200",
      LOW: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CRITICAL: "bg-red-100 text-red-800 border-red-200",
      UNKNOWN: "bg-gray-100 text-gray-600 border-gray-200",
      default: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return styles[status] || styles.default;
  };

  const badgeText = overallStatus === "UNKNOWN" ? "Inconnu" : overallStatus;

  // 3) synchro DB quand user agit (si tu veux garder en dashboard)
  const handleManualAction = async () => {
    try {
      await axios.post(`/mock/sensors/${plant.plant_id}`);
      alert("🌱 Données synchronisées avec la base !");
      // ici, si tu as un mutate() dispo, tu peux le call pour refresh
    } catch (e) {
      console.error(e);
      alert("Erreur en synchronisant les capteurs");
    }
  };

  const cardVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

  return (
    <motion.div
      onClick={() => router.push(`/dashboard/${plant.plant_id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col"
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      variants={cardVariants}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-[#06331a]">{plant.plant_name}</h2>
        <p className="text-sm text-[#5b9274]">{plant.plant_type}</p>

        <div className="flex items-center gap-2">
          <motion.span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getBadgeStyle(
              overallStatus
            )}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {badgeText}
          </motion.span>

          <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
              plant.is_automatic
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {plant.is_automatic ? "AUTO" : "MANUEL"}
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 items-center mt-4">
        <SensorCard
          type="soil_moisture"
          value={latestByType.soil_moisture?.value}
          status={latestByType.soil_moisture?.status || "OK"}
          isManual={!plant.is_automatic}
          onAction={handleManualAction}
        />
        <SensorCard
          type="light"
          value={latestByType.light?.value}
          status={latestByType.light?.status || "OK"}
          isManual={!plant.is_automatic}
          onAction={handleManualAction}
        />
        <SensorCard
          type="temperature"
          value={latestByType.temperature?.value}
          status={latestByType.temperature?.status || "OK"}
          isManual={!plant.is_automatic}
          onAction={handleManualAction}
        />
        <SensorCard
          type="humidity"
          value={latestByType.humidity?.value}
          status={latestByType.humidity?.status || "OK"}
          isManual={!plant.is_automatic}
          onAction={handleManualAction}
        />
      </div>

      <div className="text-xs text-gray-500 mt-4 sm:text-right">
        Dernier arrosage : {plant.lastActionAt ? new Date(plant.lastActionAt).toLocaleString() : "—"}
      </div>
    </motion.div>
  );
}
