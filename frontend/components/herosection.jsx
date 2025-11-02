import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  // Local image paths in homepage folder
  const buildingImg = "/homepage/pic1.JPG";
  const personImg = "/homepage/pic3.JPG"; 
   
  const mobileVideo = "/Video0.mp4";
  const desktopVideo = "/Video.mp4";
  const [isLoading, setIsLoading] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const navigate = useNavigate();

  const images = [
    { src: buildingImg, alt: "Innovation Building" },
    { src: personImg, alt: "Entrepreneur" }
  ];

  useEffect(() => {
    // Check if the loading screen has already been shown in this session
    const hasSeenLoadingScreen = sessionStorage.getItem("hasSeenLoadingScreen");

    if (!hasSeenLoadingScreen) {
      // Prevent scrolling during loading screen
      document.body.style.overflow = "hidden";

      // Show loading screen only if it hasn't been shown before
      setIsLoading(true);
      setGlowEffect(true);

      // Hide loading screen and trigger zoom-out after 7 seconds (video duration)
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        setZoomOut(true);
        // Mark the loading screen as seen in session storage
        sessionStorage.setItem("hasSeenLoadingScreen", "true");
        // Restore scrolling after loading screen
        document.body.style.overflow = "";
      }, 5000);

      return () => {
        clearTimeout(loadingTimer);
        // Ensure scrolling is restored on component unmount
        document.body.style.overflow = "";
      };
    } else {
      // If loading screen was already shown, skip it and show content immediately
      setZoomOut(true);
    }
  }, []);

  // Auto change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Function to navigate to Events Timeline page
  const goToEvents = () => {
    navigate('/eventstimeline');
  };

  // Function to navigate to About Us page
  const goToAboutUs = () => {
    navigate('/ClubDetails');
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full h-full">
            {(mobileVideo || desktopVideo) ? (
              <>
                {/* Mobile Video: Visible on screens smaller than sm (640px) */}
                <video
                  src={mobileVideo}
                  autoPlay
                  muted
                  playsInline
                  className="block sm:hidden w-full h-full object-cover"
                  alt="Startup Club Mobile Loading Video"
                />
                {/* Desktop Video: Visible on screens sm (640px) and larger */}
                <video
                  src={desktopVideo}
                  autoPlay
                  muted
                  playsInline
                  className="hidden sm:block w-full h-full object-cover"
                  alt="Startup Club Desktop Loading Video"
                />
              </>
            ) : (
              /* Fallback to default video if no videos are provided */
              <video
                src={defaultVideo}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                alt="Startup Club Loading Video"
              />
            )}
            <div
              className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                glowEffect ? "animate-pulse bg-black/20" : ""
              }`}
            />
          </div>
        </div>
      )}

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
      <section className="relative w-full h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center overflow-hidden pt-20">
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left side: Details with animation */}
            <div
              className={`md:w-1/2 mb-10 md:mb-0 ${
                zoomOut ? "animate-zoom-out" : "opacity-0"
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
                Where Ideas
                <br />
                Become Ventures.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg">
                Welcome to the StartUp Club, your campus launchpad for innovation and entrepreneurship. 
                We are a community of creators, builders, and dreamers dedicated to turning bold ideas 
                into real-world impact.
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

            {/* Right side: Single image slideshow */}
            <div
              className={`md:w-1/2 relative h-10 md:h-[24rem] ${
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
                      index === currentImageIndex ? 'opacity-100 animate-fadeIn' : 'opacity-0'
                    }`}
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
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom collaboration note */}
          <div
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-gray-500 text-sm ${
                zoomOut ? "animate-zoom-out" : "opacity-0"
            }`}
          >
            
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;