import React, { useState } from "react";

const Navbar = () => {
  const [active, setActive] = useState("portfolio");

  const links = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT ME", href: "#about" },
    { name: "SERVICES", href: "#services" },
    { name: "PORTFOLIO", href: "#portfolio" },
    { name: "BLOG", href: "#blog" },
    { name: "CONTACTS", href: "#contacts" },
  ];

  return (
    <nav className="bg-purple-600 flex justify-around items-center py-4 px-8 shadow-lg animate-fadeIn">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={() => setActive(link.name.toLowerCase())}
          className={`font-semibold text-lg px-6 py-2 rounded-md transition-all duration-300 ease-in-out ${
            active === link.name.toLowerCase()
              ? "bg-white text-purple-600 shadow-md scale-105"
              : "text-white hover:text-purple-200 hover:underline"
          }`}
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
};

export default Navbar;
