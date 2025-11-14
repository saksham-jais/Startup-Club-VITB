// FullscreenCarousel.js
import React, { useState, useEffect } from "react";
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
  {
    title: "TechFest 2025",
    subtitle: "5 December 2025",
    description: "A one-day extravaganza of cutting-edge technology workshops, demos, and interactive sessions to ignite your passion for tech innovation.",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    bannerImages: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "Tech Workshop Series",
    collaboration: "With Google Developer Group",
    time: "10:00 AM - 5:00 PM",
    venue: "VIT Bhopal University, Tech Labs",
    date: "December 5",
    year: "2025",
    detailedDescription: "Dive deep into emerging technologies with hands-on sessions on AI, blockchain, and cloud computing. Perfect for students and professionals alike.",
    speaker: "Rahul Sharma",
    designation: "Lead Developer, Google Cloud",
    judges: ["Dr. Priya Mehta", "Mr. Vikram Singh"],
    mentors: ["Alice Johnson, AI Specialist", "Bob Lee, Blockchain Expert"],
    day1: {
      title: "Full Day: Tech Immersion",
      description: "Non-stop learning and networking throughout the day.",
      events: [
        {
          time: "10:00 AM - 12:00 PM",
          name: "AI Workshop",
          venue: "Lab A",
          description: "Build your first neural network with TensorFlow."
        },
        {
          time: "1:00 PM - 3:00 PM",
          name: "Blockchain Basics",
          venue: "Lab B",
          description: "Explore smart contracts and decentralized apps."
        },
        {
          time: "3:30 PM - 5:00 PM",
          name: "Cloud Computing Demo",
          venue: "Auditorium",
          description: "Hands-on with AWS and Google Cloud services."
        }
      ]
    },
    conclusion: "Leave with new skills and connections that propel your career forward. Join TechFest 2025!",
    registrationFee: "₹200 per person",
    teamSize: "Individual"
  },
  {
    title: "Hackathon Winter Edition",
    subtitle: "15 - 16 December 2025",
    description: "24-hour coding marathon where teams tackle real-world problems and compete for prizes and glory in the startup ecosystem.",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    bannerImages: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ],
    type: "Coding Hackathon",
    collaboration: "With Microsoft Azure",
    time: "9:00 AM - 9:00 AM (Next Day)",
    venue: "VIT Bhopal University, Innovation Hub",
    date: "December 15",
    year: "2025",
    detailedDescription: "Code, collaborate, and create solutions that matter. Mentorship from industry pros and judging by venture capitalists.",
    speaker: "Lisa Chen",
    designation: "CTO, Azure Innovations",
    judges: ["Dr. Sanjay Gupta", "Ms. Neha Rao", "Prof. Arjun Patel"],
    mentors: ["Mike Davis, Full-Stack Dev", "Sara Kim, Product Manager"],
    day1: {
      title: "Day 1: Kickoff & Building",
      description: "Launch into the challenge with ideation and development.",
      events: [
        {
          time: "9:00 AM - 10:00 AM",
          name: "Opening & Problem Statement",
          venue: "Main Hall",
          description: "Get the challenges and form teams."
        },
        {
          time: "10:00 AM - 12:00 AM",
          name: "Hacking Session",
          venue: "Coding Labs",
          description: "Build prototypes with mentor support."
        }
      ]
    },
    day2: {
      title: "Day 2: Pitches & Winners",
      description: "Present your solutions and celebrate the victors.",
      events: [
        {
          time: "9:00 AM - 12:00 PM",
          name: "Demo & Pitch Rounds",
          venue: "Auditorium",
          description: "Showcase your hack to judges."
        },
        {
          time: "12:00 PM - 2:00 PM",
          name: "Awards Ceremony",
          venue: "Main Stage",
          description: "Announce winners and distribute prizes."
        }
      ]
    },
    conclusion: "Push your limits and emerge as the next big innovator. Winter Hackathon awaits!",
    registrationFee: "₹300 per team",
    teamSize: "3-5 members"
  }
];

const FullscreenCarousel = () => {
  const navigate = useNavigate();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEvent = events[currentEventIndex];

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
      title: currentEvent.title
      // No seating param - determined by title in RegistrationPage
    }).toString();
    
    window.open(`/registration?${params}`, '_blank');
  };

  // Function to handle event title click
  const handleEventTitleClick = () => {
    // Create the event object that matches your EventDetail component structure
    // Note: For dummy events, adjust paths and details as needed
    const eventDetails = {
      date: currentEvent.subtitle.includes('-') ? `${currentEvent.subtitle.split(' - ')[0]} - ${currentEvent.subtitle.split(' - ')[1]}` : currentEvent.subtitle,
      year: currentEvent.year,
      img: `/event_timeline/${currentEvent.date.replace(' ', '')}.jpg`, // Dummy path
      title: currentEvent.title,
      venue: currentEvent.venue,
      time: currentEvent.time,
      description: currentEvent.description,
      registrationFee: currentEvent.registrationFee,
      teamSize: currentEvent.teamSize,
      type: currentEvent.type,
      isUpcoming: true,
      bannerImages: currentEvent.bannerImages.map((img, idx) => `/event_timeline/${currentEvent.date.replace(' ', '')}.${idx + 1}.jpg`), // Dummy paths
      day1: currentEvent.day1,
      ...(currentEvent.day2 && { day2: currentEvent.day2 }), // Only if exists
    };

    // Navigate to event details page with the event data
    navigate(`/eventstimeline/${currentEvent.title.replace(/\s+/g, '-')}`, { 
      state: { event: eventDetails } 
    });
  };

  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 + events.length) % events.length);
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

        {/* Navigation Dots */}
        <div className="flex justify-center mb-4 space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEventIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentEventIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Event Content Box */}
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300">
          
          {/* Event Content */}
          <div className="text-center">
            
            {/* Event Title - As Link */}
            <Link
              to={`/eventstimeline/${currentEvent.title.replace(/\s+/g, '-')}`}
              state={{ event: currentEvent }}
              className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block hover:opacity-80 transition-opacity duration-200 select-none cursor-pointer"
              onClick={handleEventTitleClick}
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
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
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
            <div className="mt-4 text-white/70 text-xs">
              <p>📍 {currentEvent.venue}</p>
              <p className="mt-1 text-white/50">Click the event title or "View Details" to see full schedule</p>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl">
          <button
            onClick={prevEvent}
            className="bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
          >
            ‹
          </button>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl">
          <button
            onClick={nextEvent}
            className="bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
          >
            ›
          </button>
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