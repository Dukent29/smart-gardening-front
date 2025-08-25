// 📁 src/components/SensorBar.jsx
import clsx from "clsx";          // npm i clsx  ( facultatif, juste pour la classe conditionnelle)

export default function SensorBar({ icon, label, value, displayValue, unit = "%", barColor = "blue" }) {
  // Use displayValue if provided, otherwise format the value
  const val = displayValue !== undefined ? displayValue : 
              (value !== undefined ? Number(parseFloat(value).toFixed(1)) : "—");

  // Convert value to number and validate for bar width
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isValidValue = !isNaN(numericValue) && numericValue !== null && numericValue !== undefined;
  
  const widthStyle = isValidValue ? { width: `${Math.min(100, Math.max(0, numericValue))}%` } : { width: 0 };

  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs mt-1">{label}</span>
      <span className="text-sm font-medium">{val}{val !== "—" && ` ${unit}`}</span>

      {/* bar */}
      <div className="w-full h-1 bg-gray-300 rounded mt-1">
        <div
          className={clsx(`h-full rounded bg-${barColor}-500`)}    /* ex: bg-blue-500 */
          style={widthStyle}
        />
      </div>
    </div>
  );
}

