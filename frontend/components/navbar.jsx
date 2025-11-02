import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/registration');
  };

  return (
    <nav className="sticky top-0 z-[1000] w-full bg-gradient-to-r from-gray-50/90 to-white/90 py-[25px] border-b border-amber-600/10">
      <div className="flex justify-center">
        <div className="max-w-[1100px] mx-auto px-10 w-full flex items-center justify-between">
          <div className="relative text-[36px] font-black text-slate-800">
            <Link to="/" className="hover:text-blue-400 transition-colors duration-300">
              StartUp Club
            </Link>
          </div>
          <ul className="flex list-none m-0 p-0 items-center">
            <li className="mx-[35px]">
              <Link
                to="/"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(212,175,55,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-amber-600 hover:[text-shadow:_0_0_10px_rgba(212,175,55,0.3)]"
              >
                Home
              </Link>
            </li>
            <li className="mx-[35px]">
              <Link
                to="/team"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(212,175,55,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-amber-600 hover:[text-shadow:_0_0_10px_rgba(212,175,55,0.3)]"
              >
                Team
              </Link>
            </li>
            <li className="mx-[35px]">
              <Link
                to="/eventstimeline"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(212,175,55,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-amber-600 hover:[text-shadow:_0_0_10px_rgba(212,175,55,0.3)]"
              >
                Events Timeline
              </Link>
            </li>
            <li className="mx-[35px]">
              <Link
                to="/about-us"
                className="relative text-slate-800 no-underline text-[18px] transition-all duration-300 ease-in-out overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(212,175,55,0.1)] before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:text-amber-600 hover:[text-shadow:_0_0_10px_rgba(212,175,55,0.3)]"
              >
                About Us
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignup}
              className="relative px-6 py-3 bg-blue-400 text-white no-underline text-[16px] font-semibold transition-all duration-300 ease-in-out overflow-hidden rounded-lg shadow-md hover:shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[rgba(212,175,55,0.3)] before:to-[rgba(212,175,55,0.3)] before:translate-x-[-100%] before:transition-transform before:duration-[600ms] hover:before:translate-x-full hover:[text-shadow:_0_0_5px_rgba(255,255,255,0.5)] hover:bg-blue-500 active:scale-95 active:shadow-inner"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;