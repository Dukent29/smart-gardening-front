import Link from "next/link";
import { useRouter } from "next/router";
import { FaSearch, FaLeaf } from "react-icons/fa";
import { TbGardenCart } from "react-icons/tb";
import { BsHeartPulse } from "react-icons/bs";
import { FaCompass } from "react-icons/fa6";

const navLinks = [
	{ href: "/explore", label: "Explorer", icon: <FaCompass /> },
	{ href: "/plant/health", label: "Santé", icon: <BsHeartPulse /> },
	{ href: "/dashboard", label: "Mon Jardin", icon: <TbGardenCart /> },
	{ href: "/search", label: "Recherche", icon: <FaSearch /> },
];

export default function BottomNav() {
	const router = useRouter();

	return (
		<nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#FEFEFD] rounded-full shadow-lg flex justify-around px-4 py-2 gap-4 items-center border border-[#E0E0E0] sm:w-[520px] w-full max-w-[420px] ">
			{navLinks.map(({ href, label, icon }) => {
				const isActive = router.pathname === href;
				return (
					<Link
						key={href}
						href={href}
						className="flex flex-col items-center group"
					>
						<span
							className={`text-xl rounded-full p-2 transition ${
								isActive
									? "bg-[#0a5d2f] text-white"
									: "text-[#0a5d2f] group-hover:bg-[#0a5d2f] group-hover:text-white"
							}`}
						>
							{icon}
						</span>
						<span
							className={`text-xs mt-1 ${
								isActive
									? "text-[#0a5d2f] font-semibold"
									: "text-gray-700"
							}`}
						>
							{label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
}