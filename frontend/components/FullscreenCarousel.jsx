// FullscreenCarousel.js
import React, { useState, useEffect, useRef } from "react";

const slides = [
  {
    title: "Summer Sports Festival 2024",
    description:
      "Join us for an exciting summer of athletics, competitions, and community spirit. Register now to secure your spot!",
    bgImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=1080&fit=crop",
    bgPosition: "center center",
  },
  {
    title: "Marathon Championship",
    description:
      "Test your endurance in our annual marathon event. Professional timing, medals, and prizes for all categories.",
    bgImage: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1920&h=1080&fit=crop",
    bgPosition: "center center",
  },
  {
    title: "Youth Athletics Program",
    description:
      "Develop your skills with our comprehensive training program. Expert coaches, modern facilities, and supportive community.",
    bgImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&h=1080&fit=crop",
    bgPosition: "center center",
  },
];

export default function FullscreenCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef();
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const onDragStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    clearInterval(intervalRef.current);
  };

  const onDragMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    if (Math.abs(deltaX) > 30) {
      if (deltaX < 0 && activeIndex < slides.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (deltaX > 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      isDragging.current = false;
    }
  };

  const onDragEnd = () => {
    isDragging.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
    }, 700);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    clearInterval(intervalRef.current);
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
    }, 700);
  };

  const handleRegisterClick = () => {
    const slideData = slides[activeIndex];
    const params = new URLSearchParams({
      title: slideData.title,
      description: slideData.description,
      bgImage: slideData.bgImage,
    }).toString();
    
    // Open registration page in new tab (assuming React Router or similar; adjust path as needed for your app)
    window.open(`/registration?${params}`, '_blank');
  };

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full text-center py-6 md:py-8 bg-gradient-to-b from-white to-gray-50">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-500 mb-3 md:mb-4">
          EVENTS
        </h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
      </div>

      {/* Carousel */}
      <div
        className="relative flex-1 w-full overflow-hidden"
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.bgImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: slide.bgPosition,
                backgroundColor: "#333",
              }}
            >
              <div className="flex items-center justify-center h-full max-w-6xl mx-auto px-4 md:px-8">
                <div className="text-center text-white z-10">
                  <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-6 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-xl mb-5 md:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    {slide.description}
                  </p>
                  <button
                    onClick={handleRegisterClick}
                    className="inline-block bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <ol className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, idx) => (
            <li
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition-all ${
                idx === activeIndex ? "bg-white scale-125" : "bg-gray-400 hover:bg-gray-300"
              }`}
            ></li>
          ))}
        </ol>

        {/* Carousel Controls */}
        <button
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-white text-xl md:text-3xl cursor-pointer z-20 hover:text-gray-300 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 md:p-3 transition"
          onClick={() =>
            setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
        >
          ←
        </button>
        <button
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-white text-xl md:text-3xl cursor-pointer z-20 hover:text-gray-300 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 md:p-3 transition"
          onClick={() =>
            setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
          }
        >
          →
        </button>
      </div>
    </div>
  );
}