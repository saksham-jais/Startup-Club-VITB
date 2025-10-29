import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);
      setIsVisible(scrollPosition < window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Teams", path: "/teams" },
    { name: "About Us", path: "/ClubDetails" },
    { name: "Event Timeline", path: "/eventstimeline" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 flex items-center justify-center py-1 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-full bg-[#101926] shadow-xl mx-auto border border-[#212B36]/40 max-w-[1500px] w-full sm:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2CEFE3] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
              <circle cx="12" cy="12" r="10" stroke="#101926" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#101926" />
            </svg>
          </div>
          <span className="text-white text-lg sm:text-xl font-bold tracking-widest">
            Start<span className="text-[#2CEFE3]">Up</span>Club
          </span>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Main Nav - Desktop */}
        <div className="hidden sm:flex sm:flex-1 sm:justify-center">
          <div className="bg-[#172033] rounded-full px-2 py-1 flex items-center gap-0">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`
                  px-4 py-2 font-semibold text-white transition text-sm sm:text-base
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

        {/* Login/Signup - Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full font-medium transition bg-[#172033] text-white border border-[#232D37]/60 hover:bg-[#232D37] text-sm"
          >
            Login
          </Link>
          <span className="text-white text-opacity-30 px-2 text-xl select-none">|</span>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-full font-medium bg-blue-500 text-white shadow transition hover:bg-blue-500/80 text-sm"
          >
            Register Now
          </Link>
        </div>

        {/* Mobile Menu */}
        <div
          className={`sm:hidden absolute top-full left-0 right-0 bg-[#101926] border border-[#212B36]/40 mt-2 mx-4 rounded-2xl transition-all duration-300 ${
            isMenuOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col items-center py-4">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={toggleMenu}
                className={`
                  w-full text-center py-3 font-semibold text-white transition text-base
                  ${(location.pathname === path && !path.includes('#'))
                    ? "bg-[#172033] border-y border-[#2CEFE3]"
                    : "bg-transparent"}
                `}
              >
                {name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={toggleMenu}
              className="w-full text-center py-3 font-medium text-white border-y border-[#232D37]/60 hover:bg-[#232D37] text-base"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={toggleMenu}
              className="w-full text-center py-3 font-medium bg-blue-500 text-white hover:bg-blue-500/80 text-base"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}