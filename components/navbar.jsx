import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "About", path: "/aboutus" },
		{ name: "Services", path: "/services" },
		{ name: "Testimonials", path: "/testimonial" },
		{ name: "LogIn/SignUp", path: "/login_signup" },
	];

	return (
		<nav
			className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
				scrolled ? "bg-white/90 shadow-lg" : "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center space-x-8">
				{navItems.map((item) => (
					<Link
						key={item.name}
						to={item.path}
						className={`relative font-semibold transition-all duration-500
              ${
								location.pathname === item.path
									? "text-black"
									: "text-gray-300 hover:text-black"
							}`}
					>
						<span
							className={`px-4 py-2 rounded-full transition-all duration-300 ${
								location.pathname === item.path
									? "border-3 border-blue-400"
									: "hover:bg-blue-400"
							}`}
						>
							{item.name}
						</span>
					</Link>
				))}
			</div>
		</nav>
	);
}
