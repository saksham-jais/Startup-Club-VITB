// FullscreenCarousel.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const events = [
  {
    title: "S²-25 - StartUp Synergy",
    subtitle: "29 - 30 November 2025",
    description: "This two-day event is designed to foster innovation, collaboration, and intellectual engagement through a diverse range of activities including competitions, speaker sessions, and entertainment.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bannerImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1516321310764-9f3c2499b0b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "Startup Summit",
    collaboration: "With Tech Innovators Inc.",
    time: "9:00 AM - 6:00 PM",
    venue: "VIT Bhopal University, Auditorium Hall",
    date: "November 29",
    year: "2025",
    detailedDescription: "Join us for an immersive experience where ideas turn into realities. From pitch sessions to networking galas, S²-25 is your gateway to the startup world.",
    speaker: "Dr. Elena Vasquez",
    designation: "CEO, InnovateX Ventures",
    judges: ["Prof. Rajesh Kumar", "Ms. Priya Singh", "Dr. Amit Patel"],
    mentors: ["John Doe, Startup Advisor", "Jane Smith, Venture Capitalist"],
    day1: {
      title: "Day 1: Innovation Ignition",
      description: "Kickstart with workshops and initial competitions.",
      events: [
        {
          time: "9:00 AM - 10:30 AM",
          name: "Opening Ceremony",
          venue: "Main Auditorium",
          description: "Welcome address and keynote by industry leaders."
        },
        {
          time: "11:00 AM - 1:00 PM",
          name: "Ideathon",
          venue: "Workshop Room A",
          description: "Brainstorm and pitch innovative ideas."
        },
        {
          time: "2:00 PM - 4:00 PM",
          name: "Paper Presentation",
          venue: "Conference Hall",
          description: "Showcase research and get expert feedback."
        }
      ]
    },
    day2: {
      title: "Day 2: Synergy Showcase",
      description: "Final rounds, awards, and celebrations.",
      events: [
        {
          time: "9:00 AM - 11:00 AM",
          name: "Reverse Coding Challenge",
          venue: "Lab B",
          description: "Test your debugging and problem-solving skills."
        },
        {
          time: "12:00 PM - 2:00 PM",
          name: "E-Sports Tournament",
          venue: "Gaming Arena",
          description: "Compete in high-energy gaming battles."
        },
        {
          time: "3:00 PM - 5:00 PM",
          name: "Stand-Up Comedy",
          venue: "Main Stage",
          description: "Unwind with hilarious performances."
        },
        {
          time: "5:30 PM - 7:00 PM",
          name: "Cultural Performances",
          venue: "Outdoor Plaza",
          description: "Celebrate with music and dance."
        }
      ]
    },
    conclusion: "End the summit with lasting connections and actionable insights. See you at S²-25!",
    registrationFee: "₹500 per team",
    teamSize: "2-4 members"
  },
  // Add more events here as needed
  {
    title: "TechFest 2025 - Innovation Expo",
    subtitle: "15 - 16 December 2025",
    description: "A premier tech expo featuring workshops, hackathons, and exhibitor showcases to drive technological advancement and collaboration.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bannerImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "Tech Expo",
    collaboration: "With Global Tech Alliance",
    time: "10:00 AM - 7:00 PM",
    venue: "VIT Bhopal University, Expo Hall",
    date: "December 15",
    year: "2025",
    detailedDescription: "Explore the future of technology through hands-on workshops and cutting-edge demos.",
    speaker: "Mr. Alex Rivera",
    designation: "CTO, FutureTech Labs",
    judges: ["Dr. Sonia Gupta", "Mr. Vikram Rao", "Prof. Lisa Chen"],
    mentors: ["Mike Johnson, Tech Evangelist", "Sara Lee, Innovation Lead"],
    day1: {
      title: "Day 1: Tech Immersion",
      description: "Dive into workshops and initial hackathons.",
      events: [
        {
          time: "10:00 AM - 12:00 PM",
          name: "Opening Keynote",
          venue: "Expo Hall",
          description: "Inspiring talks on emerging tech trends."
        },
        {
          time: "1:00 PM - 4:00 PM",
          name: "Hackathon Round 1",
          venue: "Workshop Labs",
          description: "Build prototypes for real-world challenges."
        }
      ]
    },
    day2: {
      title: "Day 2: Expo Finale",
      description: "Showcases, awards, and networking.",
      events: [
        {
          time: "10:00 AM - 1:00 PM",
          name: "Exhibitor Demos",
          venue: "Main Floor",
          description: "Interactive tech showcases."
        },
        {
          time: "2:00 PM - 5:00 PM",
          name: "Awards Ceremony",
          venue: "Auditorium",
          description: "Celebrate top innovations."
        }
      ]
    },
    conclusion: "Join us to shape tomorrow's tech landscape!",
    registrationFee: "₹300 per participant",
    teamSize: "1-5 members"
  }
  // You can add more events to the array for additional slides
];

const FullscreenCarousel = () => {
  const navigate = useNavigate();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const currentEvent = events[currentEventIndex];

  const whoWeAreText = [
    "The StartUp Club is more than just a club; it's an ecosystem.",
    "We empower students by providing the resources, mentorship, and network needed to navigate the journey from concept to company.",
    "Whether you're a seasoned coder, a brilliant designer, a sharp marketer, or just have a spark of an idea, this is where you start."
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for Who We Are section
  useEffect(() => {
    if (currentTextIndex < whoWeAreText.length) {
      const currentText = whoWeAreText[currentTextIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= currentText.length) {
          setDisplayedText(currentText.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Wait before moving to next line
          setTimeout(() => {
            setCurrentTextIndex(prev => prev + 1);
            setDisplayedText("");
          }, 2000);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else {
      // Reset animation after completion
      setTimeout(() => {
        setCurrentTextIndex(0);
        setDisplayedText("");
      }, 3000);
    }
  }, [currentTextIndex]);

  const handleRegisterClick = () => {
    const params = new URLSearchParams({
      title: currentEvent.title,
      description: currentEvent.description,
      bgImage: currentEvent.img,
    }).toString();
    
    window.open(`/registration?${params}`, '_blank');
  };

  // Function to handle event title click
  const handleEventTitleClick = () => {
    // Create the event object that matches your EventDetail component structure
    // Note: You'll need to expand this for each event; for now, using a template based on the first event
    const eventDetails = {
      date: `${currentEvent.date} - ${currentEvent.date.replace('November', '30 November').replace('December', '16 December')}`, // Adjust dynamically if needed
      year: currentEvent.year,
      img: currentEvent.img, // Use event img or adjust path
      title: currentEvent.title,
      venue: "VIT Bhopal University",
      time: `${currentEvent.date} - ${currentEvent.date.replace('29', '30').replace('15', '16')} ${currentEvent.year}`,
      description: currentEvent.description,
      registrationFee: currentEvent.registrationFee,
      teamSize: currentEvent.teamSize,
      type: currentEvent.type,
      isUpcoming: true,
      bannerImages: currentEvent.bannerImages,
      day1: currentEvent.day1, // Assume structure matches
      day2: currentEvent.day2, // Assume structure matches
    };

    // Navigate to event details page with the event data
    navigate(`/eventstimeline/${currentEvent.title.replace(/\s+/g, '-')}`, { 
      state: { event: eventDetails } 
    });
  };

  const handleDotClick = (index) => {
    setCurrentEventIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const handleNextClick = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevClick();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNextClick();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      {/* Events Section - Fullscreen Carousel */}
      <div id="events-section" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden p-4">
        
        {/* Slides Container */}
        <div className="absolute inset-0">
          {events.map((event, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                index === currentEventIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${event.img})`
              }}
            />
          ))}
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevClick}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-20 text-2xl font-bold"
          aria-label="Previous Event"
        >
          ←
        </button>
        <button
          onClick={handleNextClick}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-20 text-2xl font-bold"
          aria-label="Next Event"
        >
          →
        </button>

        {/* Header Section */}
        <div className="text-center z-10 mb-4 md:mb-2 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            UPCOMING EVENTS
          </h1>
          <div className="w-40 h-2 bg-yellow-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl md:text-2xl text-blue-100 font-semibold drop-shadow-md">
            Register Now!
          </p>
        </div>

        {/* Event Content Box */}
        <div className="w-full max-w-3xl bg-white/20 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300 z-10 relative">
          
          {/* Event Content */}
          <div className="text-center">
            
            {/* Event Title - As Link */}
            <Link
              to="/eventstimeline/:id"
              state={{ event: currentEvent }}
              className="text-xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block hover:opacity-80 transition-opacity duration-200 select-none"
            >
              {currentEvent.title}
            </Link>
            
            {/* Date Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-base font-bold shadow-md">
                <span className="mr-2">📅</span>
                {currentEvent.subtitle}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
              <p className="text-sm md:text-base text-white leading-relaxed">
                {currentEvent.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Register Button */}
              <button
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Register Now
              </button>
              
              {/* View Details Button */}
              <button
                onClick={handleEventTitleClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
              >
                📖 View Details
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 text-white/80 text-xs">
              <p>📍 {currentEvent.venue}</p>
              <p className="mt-1 text-white/60">Click the event title or "View Details" to see full schedule. Use ← → arrows for navigation.</p>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentEventIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
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
                  {currentTextIndex === 0 ? (
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
                  {currentTextIndex === 1 ? (
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
                  {currentTextIndex === 2 ? (
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
                      index === currentTextIndex 
                        ? 'bg-blue-500 scale-125' 
                        : index < currentTextIndex 
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