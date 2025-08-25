import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Simulation : remplacer par un appel API plus tard
  useEffect(() => {
    setCount(3); // ex: nombre de notifs non lues
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-600 hover:text-blue-600 text-xl"
        aria-label="Notifications"
      >
        <FaBell />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
          <div className="p-2 text-sm font-bold border-b">Notifications</div>
          <div className="max-h-60 overflow-y-auto">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              🌱 Nouvelle plante ajoutée
            </div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              💧 Humidité basse — pensez à arroser
            </div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              ☀️ Lumière activée en mode auto
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
