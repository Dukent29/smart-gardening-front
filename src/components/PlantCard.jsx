// 📁 src/components/PlantCard.jsx
import { useRouter } from "next/router";
import SensorBar from "./SensorBar";
import TempIcon from "../assets/icons/thermometer.svg";
import HumidityIcon from "../assets/icons/eye.svg"; 
import LightIcon from "../assets/icons/sun.svg";
import MoistureIcon from "../assets/icons/droplets.svg"; 

export default function PlantCard({ plant }) {
  const router = useRouter();

  /* 1. Dernière mesure par type */
  const latestByType = {};
  (plant.sensors || []).forEach((s) => {
    if (!latestByType[s.type] || new Date(s.timestamp) > new Date(latestByType[s.type].timestamp)) {
      latestByType[s.type] = s;
    }
  });

  /* 2. Capteur pivot & badge */
  const mainSensorType = plant.main_sensor || "soil_moisture";
  const mainSensor     = (plant.sensors || []).find(s => s.type === mainSensorType);

  const badgeColor =
    mainSensor?.status === "OK"        ? "bg-green-500"
    : mainSensor?.status === "LOW"     ? "bg-yellow-400"
    : mainSensor?.status === "CRITICAL"? "bg-red-500"
    : "bg-gray-300";

  const badgeText = mainSensor?.status || "—";

  /* 3. Valeurs pour barres */
  const latest = {
    soil:     latestByType.soil_moisture?.value,
    temp:     latestByType.temperature?.value,
    light:    latestByType.light?.value,
    humidity: latestByType.humidity?.value,
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/${plant.plant_id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#06331a]">{plant.plant_name}</h2>
        <p className="text-sm text-[#5b9274]">{plant.plant_type}</p>
        <span className={`text-xs text-white px-2 py-0.5 rounded-full ${badgeColor} w-fit`}>
          {badgeText}
        </span>
      </div>

      {/* CAPTEURS */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 items-center mt-4 text-gray-700">
        <SensorBar icon={<MoistureIcon />} label="Moisture" value={latest.soil}      barColor="blue" />
        <SensorBar icon={<LightIcon />} label="Light"    value={latest.light}     barColor="amber"  unit="lx" />
        <SensorBar icon={<TempIcon />} label="Temp"     value={latest.temp}      barColor="orange" unit="°C" />
        <SensorBar icon={<HumidityIcon />} label="Humidity" value={latest.humidity}  barColor="pink"   />
      </div>

      {/* FOOTER */}
      <div className="text-xs text-gray-500 mt-4 sm:text-right">
        Last watered: {plant.lastActionAt ? new Date(plant.lastActionAt).toLocaleString() : "—"}
      </div>
    </div>
  );
}
