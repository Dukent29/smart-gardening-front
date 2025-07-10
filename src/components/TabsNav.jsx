// components/TabsNav.jsx
import { FaUserCircle, FaSignOutAlt, FaQuestionCircle, FaSearch } from "react-icons/fa";

export default function TabsNav({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'Scan', label: 'Scan', icon: <FaSearch className="w-5 h-5" /> },
    { key: 'Chat', label: 'Chat', icon: <FaUserCircle className="w-5 h-5" /> },
    { key: 'History', label: 'History', icon: <FaQuestionCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex justify-around items-center border-b bg-white py-2">
      {tabs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex flex-col items-center px-4 py-1 cursor-pointer focus:outline-none ${
            activeTab === key
              ? 'text-green-600 font-bold border-b-2 border-green-600'
              : 'text-gray-500'
          }`}
        >
          {icon}
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
}
