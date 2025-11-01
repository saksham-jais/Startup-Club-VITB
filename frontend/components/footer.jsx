import React from "react";

const Footer = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Teams", path: "/teams" },
    { name: "About Us", path: "/ClubDetails" },
    { name: "Event Timeline", path: "/eventstimeline" },
  ];

  const quickLinks = [
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
    { name: "Resources", path: "/resources" },
    { name: "Join Us", path: "/join" },
  ];

  const supportLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "FAQs", path: "/faq" },
    { name: "Support", path: "/support" },
    { name: "Feedback", path: "/feedback" },
  ];

  const socialLinks = [
    { 
      name: "Instagram", 
      url: "https://instagram.com/startup.vit", 
      icon: "fab fa-instagram",
      color: "hover:text-pink-400"
    },
    { 
      name: "LinkedIn", 
      url: "https://linkedin.com/company/startupclubvitb", 
      icon: "fab fa-linkedin-in",
      color: "hover:text-blue-400"
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com/startupclubvitb", 
      icon: "fab fa-twitter",
      color: "hover:text-blue-300"
    },
    { 
      name: "YouTube", 
      url: "https://youtube.com/@startupclubvitb", 
      icon: "fab fa-youtube",
      color: "hover:text-red-500"
    },
    { 
      name: "Email", 
      url: "mailto:startupclub@vitbhopal.ac.in", 
      icon: "fas fa-envelope",
      color: "hover:text-green-400"
    },
  ];

  return (
    <footer className="bg-teal-700 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Navigation Links */}
          <div>
            <h5 className="border-l-4 border-white pl-4 mb-6 text-lg font-semibold">Navigation</h5>
            <ul className="list-none space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="flex items-center hover:ml-2 hover:font-semibold transition-all duration-300 group"
                  >
                    <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&gt;&gt;</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="border-l-4 border-white pl-4 mb-6 text-lg font-semibold">Quick Links</h5>
            <ul className="list-none space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="flex items-center hover:ml-2 hover:font-semibold transition-all duration-300 group"
                  >
                    <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&gt;&gt;</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h5 className="border-l-4 border-white pl-4 mb-6 text-lg font-semibold">Support</h5>
            <ul className="list-none space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="flex items-center hover:ml-2 hover:font-semibold transition-all duration-300 group"
                  >
                    <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">&gt;&gt;</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Contact */}
        <div className="mt-12">
          <div className="flex flex-col items-center">
            <h5 className="text-lg font-semibold mb-4">Connect With Us</h5>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white ${social.color} transform hover:scale-110 transition-all duration-300 text-xl`}
                  title={social.name}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>
          
          <hr className="my-8 border-white/30" />
          
          {/* Contact Info */}
          <div className="text-center text-white/80">
            <p className="mb-2">
              <i className="fas fa-map-marker-alt mr-2"></i>
              VIT Bhopal University, Bhopal-Indore Highway, Kothrikalan, Madhya Pradesh 466114
            </p>
            <p className="mb-4">
              <i className="fas fa-envelope mr-2"></i>
              startupclub@vitbhopal.ac.in
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-6 border-t border-white/20">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} Startup Club - VIT Bhopal. All rights reserved.
          </p>
          <p className="text-white/60 text-xs mt-2">
            Empowering student entrepreneurs to innovate, create, and transform ideas into reality.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;