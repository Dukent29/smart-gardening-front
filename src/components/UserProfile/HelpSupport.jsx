import FqIcon from "@/assets/icons/circle-question-mark.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import { TbArrowGuide } from "react-icons/tb";
export default function HelpSupport() {
  return (
    <div>
      <h3 className="font-semibold text-gray-600 mb-2">Aide &amp; Support</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer">
          <FqIcon />
          <span>FAQ</span>
        </li>
        <li className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer">
          <PhoneIcon />
          <span>Contacter le support</span>
        </li>
        <li className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer">
          <TbArrowGuide className="text-2xl text-gray-600" />
          <span>Guide d'utilisateur</span>
        </li>
      </ul>
    </div>
  );
}