import { IoMdQrScanner } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";

// components/TabsNav.jsx
export default function TabsNav({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'AddPhoto', label: 'Add Photo', icon: <IoMdQrScanner className="w-6 h-6" /> },
    { key: 'AddManually', label: 'Add Manually', icon: <IoChatbubbleOutline className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-white px-6 pt-4 -mt-6">
      <div className="
      ">
        <h2 className="text-xl font-bold text-green-800">Add Plant</h2>
        <p className="text-sm text-gray-500">Choose how you want to add your plant</p>
      </div>

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