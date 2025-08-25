import { useState } from "react";
import SwitchToggle from "@/components/SwitchToggle";

export default function NotificationOptions() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [healthNotif, setHealthNotif] = useState(true);
  const [wateringReminders, setWateringReminders] = useState(false);

  return (
    <div className="space-y-2 text-gray-700">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Notifications par e-mail</span>
        <SwitchToggle checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Notifications SMS</span>
        <SwitchToggle checked={smsNotif} onChange={() => setSmsNotif(!smsNotif)} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Health Notifications</span>
        <SwitchToggle checked={healthNotif} onChange={() => setHealthNotif(!healthNotif)} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Watering Reminders</span>
        <SwitchToggle checked={wateringReminders} onChange={() => setWateringReminders(!wateringReminders)} />
      </div>
    </div>
  );
}
