import React, { useState, useEffect, useRef } from "react";

const slides = [
  {
    title: "Example headline",
    description:
      "Discover our innovative solutions tailored to your needs. Join us today and experience the difference.",
    buttonText: "Sign up today",
    bgImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/158072/spiderweb.jpg",
    bgPosition: "center top",
  },
  {
    title: "Another example headline",
    description:
      "Explore our wide range of services designed to empower your success. Learn more about what we offer.",
    buttonText: "Learn more",
    bgImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/158072/hearthand.jpg",
    bgPosition: "center center",
  },
  {
    title: "One more for good measure",
    description:
      "Browse our gallery to see the impact of our work. Get inspired and start your journey with us.",
    buttonText: "Browse gallery",
    bgImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/158072/woman-camera.jpg",
    bgPosition: "center bottom",
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

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full text-center py-8 bg-gradient-to-b from-white to-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">
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
                backgroundImage: `url(${slide.bgImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: slide.bgPosition,
                backgroundColor: "#777",
              }}
            >
              <div className="flex items-center justify-center h-full max-w-6xl mx-auto px-4">
                <div className="text-center text-white z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                  <a
                    href="#"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition"
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <ol className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, idx) => (
            <li
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                idx === activeIndex ? "bg-white" : "bg-gray-400"
              }`}
            ></li>
          ))}
        </ol>

        {/* Carousel Controls */}
        <a
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl cursor-pointer z-20 hover:text-gray-300"
          onClick={() =>
            setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
        >
          <span className="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl cursor-pointer z-20 hover:text-gray-300"
          onClick={() =>
            setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
          }
        >
          <span className="glyphicon glyphicon-chevron-right"></span>
        </a>
      </div>
    </div>
  );
}