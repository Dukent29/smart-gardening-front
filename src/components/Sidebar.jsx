// components/Sidebar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import { TbGardenCart } from "react-icons/tb";
import { FaSignOutAlt, FaQuestionCircle, FaSearch } from "react-icons/fa";
import { BsHeartPulse } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";

const links = [
  { href: "/dashboard", label: "Garden", icon: <TbGardenCart /> },
  { href: "/plant/health", label: "Health", icon: <BsHeartPulse /> },
  { href: "/Explore", label: "Explore", icon: <FaQuestionCircle /> },
  { href: "/search", label: "Recherche", icon: <FaSearch /> },
  { href: "/settings", label: "Paramètres", icon: <IoMdSettings /> },
   { href: "/logout", label: "Déconnexion", icon: <FaSignOutAlt /> },
  
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="h-screen w-64 bg-white shadow-xl p-4 flex flex-col justify-between hidden md:block">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">🌿 Smart Garden</h2>
        <nav className="space-y-2">
          {links.map(({ href, label, icon }) => (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition hover:bg-blue-100 ${
                router.pathname.startsWith(href) ? "bg-blue-200 text-blue-900 font-semibold" : "text-gray-700"
              }`}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <footer className="text-xs text-gray-500 text-center pt-8">
        <p>
          Made with ❤️ by <a href="https://material-tailwind.com" className="underline" target="_blank">Material Tailwind</a>
        </p>
      </footer>
    </aside>
  );
}
