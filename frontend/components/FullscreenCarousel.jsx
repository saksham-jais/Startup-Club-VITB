// FullscreenCarousel.js
import React, { useState, useEffect } from "react";

const event = {
  title: "S²-25 - StartUp Synergy",
  subtitle: "29 - 30 November 2025",
  description: "This two-day event is designed to foster innovation, collaboration, and intellectual engagement through a diverse range of activities including competitions, speaker sessions, and entertainment.",
  bgPosition: "center center",
};

const FullscreenCarousel = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const whoWeAreText = [
    "The StartUp Club is more than just a club; it's an ecosystem.",
    "We empower students by providing the resources, mentorship, and network needed to navigate the journey from concept to company.",
    "Whether you're a seasoned coder, a brilliant designer, a sharp marketer, or just have a spark of an idea, this is where you start."
  ];

  // Typewriter effect for Who We Are section
  useEffect(() => {
    if (currentIndex < whoWeAreText.length) {
      const currentText = whoWeAreText[currentIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= currentText.length) {
          setDisplayedText(currentText.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Wait before moving to next line
          setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setDisplayedText("");
          }, 2000);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else {
      // Reset animation after completion
      setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText("");
      }, 3000);
    }
  }, [currentIndex]);

  const handleRegisterClick = () => {
    const params = new URLSearchParams({
      title: event.title,
      description: event.description,
      bgImage: event.bgImage,
    }).toString();
    
    window.open(`/registration?${params}`, '_blank');
  };

  return (
    <>
      {/* Events Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        
        {/* Header Section - Outside the box in background */}
        <div className="text-center mb-4 md:mb-2">
          <h1 className="text-4xl md:text-10xl font-bold text-white mb-4">
            UPCOMING EVENTS
          </h1>
          <div className="w-40 h-2 bg-yellow-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-1xl md:text-1xl text-blue-100 font-semibold">
            Register Now!
          </p>
        </div>

        {/* Event Content Box */}
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300">
          
          {/* Event Content */}
          <div className="text-center">
            
            {/* Event Title */}
            <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {event.title}
            </h2>
            
            {/* Date Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-base font-bold shadow-md">
                <span className="mr-2">📅</span>
                {event.subtitle}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
              <p className="text-sm md:text-base text-white leading-relaxed">
                {event.description}
              </p>
            </div>
            
            {/* Register Button */}
            <div className="flex justify-center">
              <button
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Register Now
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 text-white/70 text-xs">
              <p>📍 VIT Bhopal University</p>
            </div>
          </div>
        </div>
      </div>

      {/* We Build the Future Section - Boxes with Typewriter */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left side - Headline */}
            <div className="lg:w-2/5">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                We Build
                <br />
                the Future.
              </h2>
              <div className="w-20 h-1 bg-blue-500 mb-8"></div>
              <p className="text-lg text-gray-600">
                Our mission to empower the next generation of innovators
              </p>
            </div>

            {/* Right side - Typewriter Boxes */}
            <div className="lg:w-3/5 space-y-6">
              {/* Box 1 */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm">
                <div className="text-lg text-gray-700 font-medium min-h-20 flex items-center">
                  {currentIndex === 0 ? (
                    <>
                      {displayedText}
                      <span className="typing-cursor ml-1">|</span>
                    </>
                  ) : (
                    "The StartUp Club is more than just a club; it's an ecosystem."
                  )}
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm">
                <div className="text-lg text-gray-700 font-medium min-h-20 flex items-center">
                  {currentIndex === 1 ? (
                    <>
                      {displayedText}
                      <span className="typing-cursor ml-1">|</span>
                    </>
                  ) : (
                    "We empower students by providing the resources, mentorship, and network needed to navigate the journey from concept to company."
                  )}
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg shadow-sm">
                <div className="text-lg text-gray-700 font-medium min-h-20 flex items-center">
                  {currentIndex === 2 ? (
                    <>
                      {displayedText}
                      <span className="typing-cursor ml-1">|</span>
                    </>
                  ) : (
                    "Whether you're a seasoned coder, a brilliant designer, a sharp marketer, or just have a spark of an idea, this is where you start."
                  )}
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-start space-x-3 mt-8">
                {whoWeAreText.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-blue-500 scale-125' 
                        : index < currentIndex 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          .typing-cursor {
            animation: blink 1s infinite;
          }
        `}
      </style>
    </>
  );
};

export default FullscreenCarousel;