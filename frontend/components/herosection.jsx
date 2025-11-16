import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  // Local image paths in homepage folder
  const buildingImg = "/homepage/pic1.JPG";
  const personImg = "/homepage/pic3.JPG";

  const [zoomOut, setZoomOut] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  const images = [
    { src: buildingImg, alt: "Innovation Building" },
    { src: personImg, alt: "Entrepreneur" },
  ];

  // Run zoom-out animation on first render
  useEffect(() => {
    setZoomOut(true);
  }, []);

  // Auto change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Navigate to Events Timeline page
  const goToEvents = () => {
    navigate("/eventstimeline");
  };

  // Navigate to About Us page
  const goToAboutUs = () => {
    navigate("/ClubDetails");
  };

  return (
    <>
      <style>
        {`
          @keyframes zoomOut {
            0% {
              transform: scale(1.5);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-zoom-out {
            animation: zoomOut 0.8s ease-out forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in-out;
          }
        `}
      </style>

      {/* Main Hero Section with proper spacing from navbar */}
      <section className="relative w-full h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center overflow-hidden pt-20 pb-20">
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Image Slideshow - Full width on mobile, half on large screens */}
            <div
              className={`w-full lg:w-1/2 relative h-[30vh] lg:h-[24rem] order-1 ${
                zoomOut ? "animate-zoom-out" : "opacity-0"
              }`}
            >
              {/* Single Image Display with fade animation */}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex
                        ? "opacity-100 animate-fadeIn"
                        : "opacity-0"
                    }`}
                    onError={(e) => {
                      console.error("Image failed to load:", image.src);
                      e.target.style.display = "none";
                    }}
                  />
                ))}
              </div>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Left side: Details with animation - Full width on mobile, half on large screens */}
            <div
              className={`w-full lg:w-1/2 mb-6 lg:mb-0 order-2 lg:order-2 ${
                zoomOut ? "animate-zoom-out" : "opacity-0"
              }`}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                Where Ideas
                <br />
                Become Ventures.
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mt-6 max-w-lg">
                Welcome to the StartUp Club, your campus launchpad for innovation and
                entrepreneurship. We are a community of creators, builders, and
                dreamers dedicated to turning bold ideas into real-world impact.
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <button
                  onClick={goToAboutUs}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-blue-500 hover:border-2 hover:border-blue-500 transition duration-300"
                >
                  Join Our Community
                </button>
                <button
                  onClick={goToEvents}
                  className="text-blue-500 font-medium hover:underline px-6 py-3 border border-blue-500 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  See Upcoming Events
                </button>
              </div>
            </div>
          </div>

          {/* Bottom collaboration note (empty but kept for layout consistency) */}
          <div
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-gray-500 text-sm ${
              zoomOut ? "animate-zoom-out" : "opacity-0"
            }`}
          ></div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
