import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignup = () => {
    // Scroll to the events section instead of navigating to registration
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: navigate to home if events section not found
      navigate('/');
    }
    closeMobileMenu();
  };

  return (
    <nav className="relative sticky top-0 z-[1000] w-full bg-gradient-to-r from-gray-50/90 to-white/90 py-[25px] border-b border-blue-400/10">
      <div className="flex justify-center">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 w-full flex items-center justify-between">
          <div className="relative text-[28px] md:text-[36px] font-black text-slate-800">
            <Link to="/" className="hover:text-blue-500 transition-colors duration-300" onClick={closeMobileMenu}>
              StartUp Club
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex list-none m-0 p-0 items-center">
            <li className="mx-[35px]">
              <Link
                to="/"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(96,165,250,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-blue-600 hover:[text-shadow:_0_0_10px_rgba(96,165,250,0.3)]"
              >
                Home
              </Link>
            </li>
            <li className="mx-[35px]">
              <Link
                to="/teams"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(96,165,250,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-blue-600 hover:[text-shadow:_0_0_10px_rgba(96,165,250,0.3)]"
              >
                Team
              </Link>
            </li>
            <li className="mx-[35px]">
              <Link
                to="/eventstimeline"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(96,165,250,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-blue-600 hover:[text-shadow:_0_0_10px_rgba(96,165,250,0.3)]"
              >
                Events Timeline
              </Link>
            </li>
            <li className="mx-[35px]">
              <Link
                to="/ClubDetails"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(96,165,250,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-blue-600 hover:[text-shadow:_0_0_10px_rgba(96,165,250,0.3)]"
              >
                About Us
              </Link>
            </li>
          </ul>

          {/* Right side: Button and Mobile Hamburger */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={handleSignup}
              className="relative px-4 py-2 md:px-6 md:py-3 bg-blue-400 text-white no-underline text-sm md:text-[16px] font-semibold transition-all duration-300 ease-in-out overflow-hidden rounded-md md:rounded-lg shadow-md hover:shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[rgba(96,165,250,0.3)] before:to-[rgba(96,165,250,0.3)] before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:[text-shadow:_0_0_5px_rgba(255,255,255,0.5)] hover:bg-blue-500 active:scale-95 active:shadow-inner"
            >
              Register Now
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 focus:outline-none transition-transform duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 active:scale-95"
              aria-label="Toggle mobile menu"
            >
              <div className="flex flex-col justify-center items-center space-y-1.5 w-6 relative">
                <span
                  className={`block transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] h-0.5 w-full rounded-sm origin-center ${
                    isMobileMenuOpen
                      ? 'bg-blue-600 rotate-45 translate-y-2'
                      : 'bg-slate-800'
                  }`}
                ></span>
                <span
                  className={`block transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] h-0.5 w-full rounded-sm origin-center ${
                    isMobileMenuOpen 
                      ? 'bg-slate-800 opacity-0 scale-0 translate-y-0'
                      : 'bg-slate-800 opacity-100 scale-100'
                  }`}
                ></span>
                <span
                  className={`block transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] h-0.5 w-full rounded-sm origin-center ${
                    isMobileMenuOpen
                      ? 'bg-blue-600 -rotate-45 -translate-y-2'
                      : 'bg-slate-800'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-r from-gray-50/95 to-white/95 border-b border-blue-400/10 py-6 shadow-lg z-[999] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform origin-top ${
        isMobileMenuOpen
          ? 'translate-y-0 opacity-100 scale-y-100 visible'
          : '-translate-y-1 opacity-0 scale-y-95 invisible'
      }`}>
        <ul className="flex flex-col items-center space-y-6 m-0 p-0 list-none w-full">
          <li className={`w-full px-4 transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${
            isMobileMenuOpen ? 'translate-x-0 opacity-100 delay-100' : 'translate-x-[-10px] opacity-0'
          }`}>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-3 text-left text-slate-800 no-underline text-[16px] font-medium transition-colors duration-300 hover:text-blue-600 hover:[text-shadow:_0_0_5px_rgba(96,165,250,0.2)]"
            >
              Home
            </Link>
          </li>
          <li className={`w-full px-4 transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${
            isMobileMenuOpen ? 'translate-x-0 opacity-100 delay-200' : 'translate-x-[-10px] opacity-0'
          }`}>
            <Link
              to="/teams"
              onClick={closeMobileMenu}
              className="block py-3 text-left text-slate-800 no-underline text-[16px] font-medium transition-colors duration-300 hover:text-blue-600 hover:[text-shadow:_0_0_5px_rgba(96,165,250,0.2)]"
            >
              Team
            </Link>
          </li>
          <li className={`w-full px-4 transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${
            isMobileMenuOpen ? 'translate-x-0 opacity-100 delay-300' : 'translate-x-[-10px] opacity-0'
          }`}>
            <Link
              to="/eventstimeline"
              onClick={closeMobileMenu}
              className="block py-3 text-left text-slate-800 no-underline text-[16px] font-medium transition-colors duration-300 hover:text-blue-600 hover:[text-shadow:_0_0_5px_rgba(96,165,250,0.2)]"
            >
              Events Timeline
            </Link>
          </li>
          <li className={`w-full px-4 transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${
            isMobileMenuOpen ? 'translate-x-0 opacity-100 delay-400' : 'translate-x-[-10px] opacity-0'
          }`}>
            <Link
              to="/ClubDetails"
              onClick={closeMobileMenu}
              className="block py-3 text-left text-slate-800 no-underline text-[16px] font-medium transition-colors duration-300 hover:text-blue-600 hover:[text-shadow:_0_0_5px_rgba(96,165,250,0.2)]"
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;