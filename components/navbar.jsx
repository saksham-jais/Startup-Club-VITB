import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Updated navigation links
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Teams", path: "/teams" },
		{ name: "About Us", path: "/ClubDetails" }, // Corrected path from previous step
		{ name: "Event Timeline", path: "/events" },
		{ name: "Testimonials", path: "/testimonials" }, // Changed to a hash link
	];

	return (
		<nav className="w-full fixed top-0 left-0 z-50 flex items-center justify-center py-1 bg-transparent">
			<div className="flex items-center justify-between gap-10 px-6 py-2 rounded-full bg-[#101926] shadow-xl mx-auto border border-[#212B36]/40 max-w-[1500px] w-full">
				{/* Logo */}
				<div className="flex items-center space-x-2">
					<div className="w-10 h-10 rounded-full bg-[#2CEFE3] flex items-center justify-center">
						<svg viewBox="0 0 24 24" fill="none" width="24" height="24">
							<circle cx="12" cy="12" r="10" stroke="#101926" strokeWidth="2" />
							<circle cx="12" cy="12" r="4" fill="#101926" />
						</svg>
					</div>
					<span className="text-white text-xl font-bold tracking-widest">Start<span className="text-[#2CEFE3]">Up</span>Club</span>
				</div>

				{/* Main Nav */}
				<div className="flex-1 flex justify-center">
					<div className="bg-[#172033] rounded-full px-2 py-1 flex items-center gap-0">
						{navLinks.map(({ name, path }) => (
							<Link
								key={name}
								to={path}
								className={`
									px-6 py-2 font-semibold text-white transition
									${(location.pathname === path && !path.includes('#'))
										? "rounded-full border border-[#2CEFE3] bg-[#172033] shadow"
										: "bg-transparent"}
								`}
							>
								{name}
							</Link>
						))}
					</div>
				</div>

				{/* Login/Signup */}
				<div className="flex items-center gap-2">
					<Link
						to="/login"
						className="px-5 py-2 rounded-full font-medium transition bg-[#172033] text-white border border-[#232D37]/60 hover:bg-[#232D37]"
					>
						Login
					</Link>
					<span className="text-white text-opacity-30 px-2 text-xl select-none">|</span>
					<Link
						to="/signup"
						className="px-6 py-2 rounded-full font-medium bg-[#2CEFE3] text-[#101926] shadow transition hover:bg-[#2CEFE3]/90"
					>
						Sign up
					</Link>
				</div>
			</div>
		</nav>
	);
}
