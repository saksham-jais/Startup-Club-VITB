import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Only keep the tech fest event
const techFestEvent = {
  title: "S²-25 - StartUp Synergy",
  subtitle: "05 February 2026",
  description:
    "Opening Ceremony+Live Podcast Session, Ideathon, Meme War Competition Featuring E-Sports, Cultural Performances, and StandUp Comedy.",
  img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2070&q=80",
  bannerImages: [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80",
  ],
  type: "Tech Festival",
  collaboration: "With Campus Tech Society",
  time: "10:00 AM - 8:00 PM",
  venue: "VIT Bhopal University, Main Campus",
  date: "December 15",
  year: "2025",
  detailedDescription:
    "Dive into a world of technology with hands-on workshops, coding challenges, and expert talks.",
  speaker: "Mr. Raj Patel",
  designation: "CTO, TechNova Solutions",
  judges: ["Dr. Sneha Rao", "Mr. Vikram Singh", "Prof. Anita Desai"],
  mentors: ["Alex Johnson", "Sara Lee"],
};

// Now only one event
const events = [techFestEvent];

const whoWeAreText = [
  "The StartUp Club is more than just a club; it's an ecosystem.",
  "We empower students with resources, mentorship, and a powerful network.",
  "Whether you're a coder, designer, marketer, or creator—this is where you start.",
];

const FullscreenCarousel = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // TYPEWRITER EFFECT
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (currentIndex < whoWeAreText.length) {
      const text = whoWeAreText[currentIndex];
      let c = 0;

      intervalRef.current = setInterval(() => {
        if (c <= text.length) {
          setDisplayedText(text.substring(0, c));
          c++;
        } else {
          clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
            setDisplayedText("");
          }, 2000);
        }
      }, 30);
    } else {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(0);
      }, 3000);
    }
  }, [currentIndex]);

  const handleEventTitleClick = () => {
    // Since there's now only one event (index 0)
    const eventTitle = events[0].title;
    navigate(`/eventstimeline/${eventTitle.replace(/\s+/g, "-")}`, {
      state: { event: events[0] },
    });
  };

  return (
    <>
      {/* 🔥 FIXED: make event section the top-most layer */}
      <div
        id="events-section"
        className="relative z-[9999] w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4"
      >
        <div className="text-center mb-8 w-full max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            UPCOMING EVENT
          </h1>
          <div className="w-40 h-2 bg-yellow-400 mx-auto mb-4 rounded-full" />
          <p className="text-blue-100 font-semibold">
            A day full of innovation, creativity, and collaboration.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          {/* Single event – changed from grid to centered layout */}
          <div className="flex justify-center">
            <div
              className="event-card w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 md:p-10 relative z-20"
            >
              <div className="text-center">
                {/* Event Title */}
                <button
                  onClick={handleEventTitleClick}
                  className="text-xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200 block w-full"
                >
                  {events[0].title}
                </button>

                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-5 py-3 rounded-full text-lg font-bold shadow-md">
                    <span className="mr-2">📅</span>
                    {events[0].subtitle}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 mb-8 border border-white/10">
                  <p className="text-base md:text-lg text-white leading-relaxed">
                    {events[0].description}
                  </p>
                </div>

                {/* Register Button */}
                <div className="flex justify-center">
                  <a
                    href="/event-selection-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[99999] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🚀 Register Now
                  </a>
                </div>

                <p className="mt-6 text-white/70 text-sm">
                  📍 VIT Bhopal University
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typewriter Section – kept unchanged */}
      <section className="py-20 bg-white relative z-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left */}
            <div className="lg:w-2/5">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                We Build<br />the Future.
              </h2>
              <div className="w-20 h-1 bg-blue-500 mb-8" />
              <p className="text-lg text-gray-600">
                Empowering the next generation of innovators
              </p>
            </div>

            {/* Right (boxes) */}
            <div className="lg:w-3/5 space-y-6">
              {[0, 1, 2].map((box) => (
                <div
                  key={box}
                  className={
                    box === 0
                      ? "bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm"
                      : box === 1
                      ? "bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm"
                      : "bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg shadow-sm"
                  }
                >
                  <div className="text-lg text-gray-700 font-medium min-h-20 flex items-center">
                    {currentIndex === box ? (
                      <>
                        {displayedText}
                        <span className="typing-cursor ml-1">|</span>
                      </>
                    ) : (
                      whoWeAreText[box]
                    )}
                  </div>
                </div>
              ))}

              <div className="flex space-x-3 mt-8">
                {whoWeAreText.map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "bg-blue-500 scale-125"
                        : i < currentIndex
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          .typing-cursor {
            animation: blink 1s infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default FullscreenCarousel;