import React from "react";

const Footer = () => {
  return (
    <footer className="bg-teal-700 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <h5 className="border-l-4 border-gray-300 pl-4 mb-6">Quick links</h5>
            <ul className="list-none space-y-2">
              <li>
                <a href="/" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Home
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>About
                </a>
              </li>
              <li>
                <a href="/faq" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>FAQ
                </a>
              </li>
              <li>
                <a href="/get-started" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Get Started
                </a>
              </li>
              <li>
                <a href="/videos" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Videos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="border-l-4 border-gray-300 pl-4 mb-6">Quick links</h5>
            <ul className="list-none space-y-2">
              <li>
                <a href="/" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Home
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>About
                </a>
              </li>
              <li>
                <a href="/faq" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>FAQ
                </a>
              </li>
              <li>
                <a href="/get-started" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Get Started
                </a>
              </li>
              <li>
                <a href="/videos" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Videos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="border-l-4 border-gray-300 pl-4 mb-6">Quick links</h5>
            <ul className="list-none space-y-2">
              <li>
                <a href="/" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Home
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>About
                </a>
              </li>
              <li>
                <a href="/faq" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>FAQ
                </a>
              </li>
              <li>
                <a href="/get-started" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Get Started
                </a>
              </li>
              <li>
                <a href="https://www.sunlimetech.com" target="_blank" className="flex items-center hover:ml-2 hover:font-bold transition-all duration-300">
                  <span className="mr-2">&gt;&gt;</span>Imprint
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-center space-x-4">
            <a href="https://www.facebook.com" target="_blank" className="text-white hover:text-gray-300 transition-all duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" className="text-white hover:text-gray-300 transition-all duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" className="text-white hover:text-gray-300 transition-all duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.google.com" target="_blank" className="text-white hover:text-gray-300 transition-all duration-300">
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="mailto:example@email.com" target="_blank" className="text-white hover:text-gray-300 transition-all duration-300">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
          <hr className="my-6 border-gray-500" />
        </div>
        <div className="text-center">
          <p>
            <u><a href="https://www.nationaltransaction.com/" target="_blank" className="text-white hover:text-gray-300">National Transaction Corporation</a></u> is a Registered MSP/ISO of Elavon, Inc. Georgia [a wholly owned subsidiary of U.S. Bancorp, Minneapolis, MN]
          </p>
          <p className="text-sm mt-2">
            © All right Reversed. <a href="https://www.sunlimetech.com" target="_blank" className="text-green-400 hover:text-green-300">Sunlimetech</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;