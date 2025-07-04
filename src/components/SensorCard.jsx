// 📁 components/SensorCard.jsx
export default function SensorCard({ type, value, status, onAction, isManual }) {
  const sensorInfo = {
    temperature: { label: "Temperature", icon: "🌡️", unit: "°C", action: "Adjust Temp" },
    humidity: { label: "Humidity", icon: "💧", unit: "%", action: "Humidify" },
    soil_moisture: { label: "Moisture", icon: "🌱", unit: "%", action: "Water Plant" },
    light: { label: "Light", icon: "💡", unit: "lx", action: "Add Light" }
  };

  const { label, icon, unit, action } = sensorInfo[type] || {};
  const alertColor = status === "CRITICAL" ? "bg-red-600" :
                     status === "LOW" ? "bg-yellow-400" : "bg-green-500";

  return (
    <div className={`rounded-lg p-4 shadow-md text-center ${alertColor} text-white`}>
      <div className="text-3xl">{icon}</div>
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-xl">{value}{unit}</div>
      {status !== "OK" && (
        <div className="text-sm italic">{status === "LOW" ? "Needs attention" : "Critical condition"}</div>
      )}
      {isManual && (
        <button
          onClick={onAction}
          className="mt-2 bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition"
        >
          {action}
        </button>
      )}
    </div>
  );
}
