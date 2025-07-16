import FqIcon from "@/assets/icons/circle-question-mark.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import { TbArrowGuide } from "react-icons/tb";
export default function HelpSupport() {
  return (
    <div>
      <h3 className="font-semibold text-[#0A5D2F] mb-2">Help &amp; Support</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
          <FqIcon />
          <span>FAQ</span>
        </li>
        <li className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
          <PhoneIcon />
          <span>Contact Support</span>
        </li>
        <li className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
          <TbArrowGuide className="text-2xl text-[#474747]" />
          <span>User Guide</span>
        </li>
      </ul>
    </div>
    );
}