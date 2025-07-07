import Link from "next/link";

export default function PrivacySettings() {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Settings</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/settings/privacy" className="flex items-center gap-2 text-blue-600 hover:underline">
            <span>🔒</span>
            <span>Privacy Settings</span>
          </Link>
        </li>
        <li>
          <Link href="/settings/account" className="flex items-center gap-2 text-blue-600 hover:underline">
            <span>⚙️</span>
            <span>Account Settings</span>
          </Link>
        </li>
      </ul>
      </div>
  );
}