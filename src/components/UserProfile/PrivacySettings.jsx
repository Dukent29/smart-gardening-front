import Link from "next/link";
import ShieldIcon from "@/assets/icons/shield.svg"
import { IoIosSettings } from "react-icons/io";

export default function PrivacySettings() {
  return (
    <div>
      <h3 className="font-semibold text-[#0A5D2F] mb-2">Paramètres</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/settings/privacy" className="flex items-center gap-2 text-gray-600 hover:underline">
            <ShieldIcon />
            <span>Paramètres de confidentialité</span>
          </Link>
        </li>
        <li>
          <Link href="/settings/account" className="flex items-center gap-2 text-gray-600 hover:underline">
            <IoIosSettings className="text-2xl text-[#474747]" />
            <span>Paramètres du compte</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}