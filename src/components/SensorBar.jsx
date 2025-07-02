// 📁 src/components/SensorBar.jsx
import clsx from "clsx";          // npm i clsx  ( facultatif, juste pour la classe conditionnelle)

export default function SensorBar({ icon, label, value, unit = "%", barColor = "blue" }) {
  const val = value ?? "—";

  // Tailwind width : w-[70%] dynamiquement
  const widthStyle = value !== undefined ? { width: `${Math.min(100, value)}%` } : { width: 0 };

  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs mt-1">{label}</span>
      <span className="text-sm font-medium">{val}{value !== undefined && ` ${unit}`}</span>

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
