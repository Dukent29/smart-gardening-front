import SensorBar from "./SensorBar";
import TempIcon from "../assets/icons/thermometer.svg";
import HumidityIcon from "../assets/icons/eye.svg"; 
import LightIcon from "../assets/icons/sun.svg";
import MoistureIcon from "../assets/icons/droplets.svg";

export default function SensorCard({ type, value, status, onAction, isManual }) {
  const sensorInfo = {
    temperature: { label: "Temperature", icon: TempIcon, unit: "°C", action: "Ajuster Température", barColor: "red" },
    humidity: { label: "Humidity", icon: HumidityIcon, unit: "%", action: "Humidifier", barColor: "blue" },
    soil_moisture: { label: "Moisture", icon: MoistureIcon, unit: "%", action: "Arroser la plante", barColor: "green" },
    light: { label: "Light", icon: LightIcon, unit: "lx", action: "Ajouter de la lumière", barColor: "yellow" }
  };

  const { label, icon: IconComponent, unit, action, barColor } = sensorInfo[type] || {};
  const alertColor = status === "CRITICAL" ? "bg-[#de3d31]" :
                     status === "LOW" ? "bg-yellow-400" : "bg-green-500";

  // Convert value for percentage display (light sensor needs different scaling)
  const getBarValue = () => {
    if (!value || isNaN(parseFloat(value))) return 0;
    
    if (type === "light") {
      // Scale light value (assuming max ~1000 lx for indoor plants)
      return Math.min(100, (parseFloat(value) / 1000) * 100);
    }
    if (type === "temperature") {
      // Scale temperature (assuming 0-40°C range)
      return Math.min(100, Math.max(0, (parseFloat(value) / 40) * 100));
    }
    // For humidity and soil_moisture, value should already be in percentage
    return parseFloat(value);
  };

  // Format display value to avoid floating point precision issues
  const getDisplayValue = () => {
    if (!value || isNaN(parseFloat(value))) return "—";
    const numValue = parseFloat(value);
    return Number(numValue.toFixed(1));
  };

  // Show action button only for critical/low sensors when in manual mode
  const showActionButton = isManual && ["CRITICAL", "LOW"].includes(status);

  return (
    <div className="rounded-2xl p-3 bg-white border border-green-300 border-solid relative text-gray-800">
      <SensorBar 
        icon={IconComponent ? <IconComponent className="w-6 h-6 text-gray-700" /> : "📊"}
        label={label}
        value={getBarValue()}
        displayValue={getDisplayValue()}
        unit={unit}
        barColor={barColor}
      />
      
      {showActionButton && (
        <button
          onClick={onAction}
          className={`mt-3 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 w-full ${
            status === "CRITICAL" 
              ? "bg-red-500 hover:bg-[#de3d31] text-white shadow-lg hover:shadow-xl" 
              : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {action}
        </button>
      )}
    </div>
  );
}
