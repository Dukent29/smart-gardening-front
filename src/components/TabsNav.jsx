// components/TabsNav.jsx
import { IoMdQrScanner } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { MdHistory } from "react-icons/md";

export default function TabsNav({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'Scan', label: 'Scan', icon: <IoMdQrScanner className="w-6 h-6" /> },
    { key: 'Chat', label: 'Chat', icon: <IoChatbubbleOutline className="w-6 h-6" /> },
    { key: 'History', label: 'History', icon: <MdHistory className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-white px-6 pt-4">
      {/* 🟢 Top title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-800">Plant Health</h2>
        <p className="text-sm text-gray-500">Scan, diagnose, and get expert advice</p>
      </div>

      {/* 🟢 Tabs nav bar */}
      <div className="flex justify-between gap-8 border-b">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition duration-150 ease-in-out ${
              activeTab === key
                ? 'text-green-700 border-green-700'
                : 'text-gray-500 border-transparent hover:text-green-600'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
