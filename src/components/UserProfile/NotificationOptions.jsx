import { useState } from "react";

export default function NotificationOptions() {
  const [plantAlert, setPlantAlert] = useState(true);
  const [wateringReminders, setWateringReminders] = useState(true);
  const [healthReport, setHealthReport] = useState(false);

  return (
    <div>
      <h3 className="font-semibold text-[#0A5D2F] mb-2">Notifications</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[#474747]">
          <input
            type="checkbox"
            checked={plantAlert}
            onChange={() => setPlantAlert(v => !v)}
            className="accent-green-500"
          />
          <span>🌱 Plant Alert</span>
        </label>
        <label className="flex items-center gap-2 text-[#474747]">
          <input
            type="checkbox"
            checked={wateringReminders}
            onChange={() => setWateringReminders(v => !v)}
            className="accent-blue-500"
          />
          <span>💧 Watering Reminders</span>
        </label>
        <label className="flex items-center gap-2 text-[#474747]">
          <input
            type="checkbox"
            checked={healthReport}
            onChange={() => setHealthReport(v => !v)}
            className="accent-pink-500"
          />
          <span>📈 Health Report</span>
          
        </label>
      </div>
    </div>
  );
}