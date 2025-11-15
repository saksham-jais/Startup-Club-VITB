// FullscreenCarousel.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const event1 = {
  title: "S²-25 - StartUp Synergy",
  subtitle: "29 - 30 November 2025",
  description:
    "This two-day event is designed to foster innovation, collaboration, and intellectual engagement through a diverse range of activities including competitions, speaker sessions, and entertainment.",
  img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  bannerImages: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1516321310764-9f3c2499b0b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  ],
  type: "Startup Summit",
  collaboration: "With Tech Innovators Inc.",
  time: "9:00 AM - 6:00 PM",
  venue: "VIT Bhopal University, Auditorium Hall",
  date: "November 29",
  year: "2025",
  detailedDescription:
    "Join us for an immersive experience where ideas turn into realities. From pitch sessions to networking galas, S²-25 is your gateway to the startup world.",
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
        description: "Welcome address and keynote by industry leaders.",
      },
      {
        time: "11:00 AM - 1:00 PM",
        name: "Ideathon",
        venue: "Workshop Room A",
        description: "Brainstorm and pitch innovative ideas.",
      },
      {
        time: "2:00 PM - 4:00 PM",
        name: "Paper Presentation",
        venue: "Conference Hall",
        description: "Showcase research and get expert feedback.",
      },
    ],
  },
  day2: {
    title: "Day 2: Synergy Showcase",
    description: "Final rounds, awards, and celebrations.",
    events: [
      {
        time: "9:00 AM - 11:00 AM",
        name: "Reverse Coding Challenge",
        venue: "Lab B",
        description: "Test your debugging and problem-solving skills.",
      },
      {
        time: "12:00 PM - 2:00 PM",
        name: "E-Sports Tournament",
        venue: "Gaming Arena",
        description: "Compete in high-energy gaming battles.",
      },
      {
        time: "3:00 PM - 5:00 PM",
        name: "Stand-Up Comedy",
        venue: "Main Stage",
        description: "Unwind with hilarious performances.",
      },
      {
        time: "5:30 PM - 7:00 PM",
        name: "Cultural Performances",
        venue: "Outdoor Plaza",
        description: "Celebrate with music and dance.",
      },
    ],
  },
  conclusion:
    "End the summit with lasting connections and actionable insights. See you at S²-25!",
  registrationFee: "₹500 per team",
  teamSize: "2-4 members",
};

const event2 = {
  title: "Tech Innovate Fest",
  subtitle: "5 - 6 December 2025",
  description:
    "A dynamic tech fest focusing on emerging technologies, workshops, and day 2 highlights in innovation and entertainment.",
  img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  bannerImages: [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  ],
  type: "Tech Fest",
  collaboration: "With Global Tech Partners",
  time: "10:00 AM - 7:00 PM",
  venue: "VIT Bhopal University, Tech Hall",
  date: "December 5",
  year: "2025",
  detailedDescription:
    "Dive into the future of tech with hands-on sessions and exciting day 2 events.",
  speaker: "Mr. Alex Rivera",
  designation: "CTO, FutureTech Labs",
  judges: ["Dr. Sarah Lee", "Mr. Vikram Desai", "Prof. Lisa Wong"],
  mentors: ["Mike Johnson, Tech Mentor", "Anna Chen, Innovation Coach"],
  day1: {
    title: "Day 1: Tech Foundations",
    description: "Introductory workshops and tech talks.",
    events: [
      {
        time: "10:00 AM - 12:00 PM",
        name: "Tech Keynote",
        venue: "Tech Hall A",
        description: "Inspiring talks on AI and blockchain.",
      },
      {
        time: "1:00 PM - 3:00 PM",
        name: "Workshop: AI Basics",
        venue: "Lab C",
        description: "Hands-on AI session.",
      },
    ],
  },
  day2: {
    title: "Day 2: Innovation & Entertainment",
    description: "Advanced competitions and fun activities.",
    events: [
      {
        time: "10:00 AM - 12:00 PM",
        name: "Innovation Pitch",
        venue: "Main Stage",
        description: "Pitch your tech ideas to experts.",
      },
      {
        time: "2:00 PM - 4:00 PM",
        name: "Hackathon Finals",
        venue: "Coding Labs",
        description: "Showcase your projects.",
      },
      {
        time: "4:30 PM - 6:00 PM",
        name: "Tech Trivia Night",
        venue: "Auditorium",
        description: "Fun quiz on tech history.",
      },
    ],
  },
  conclusion: "Wrap up with prizes and networking. Join Tech Innovate Fest!",
  registrationFee: "₹400 per participant",
  teamSize: "1-3 members",
};

const events = [event1, event2]; // Array for carousel

const FullscreenCarousel = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // For typewriter
  const [currentSlide, setCurrentSlide] = useState(0); // For carousel

  const whoWeAreText = [
    "The StartUp Club is more than just a club; it's an ecosystem.",
    "We empower students by providing the resources, mentorship, and network needed to navigate the journey from concept to company.",
    "Whether you're a seasoned coder, a brilliant designer, a sharp marketer, or just have a spark of an idea, this is where you start.",
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
            setCurrentIndex((prev) => prev + 1);
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

  // Auto-advance carousel every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentEvent = events[currentSlide];

  const handleRegisterClick = () => {
    if (currentSlide === 0) {
      window.open("/event-selection-s2", "_blank");
    } else {
      window.open("/event-selection-tech", "_blank");
    }
  };

  const handleEventTitleClick = () => {
    if (currentSlide === 0) {
      handleEventTitleClick1();
    } else {
      handleEventTitleClick2();
    }
  };

  // Function to handle event title click for event1
  const handleEventTitleClick1 = () => {
    const eventDetails = {
      date: "Nov 29 - 30",
      year: "2025",
      img: "/event_timeline/Nov 29-30.jpg",
      title: "S²-25 - StartUp Synergy",
      venue: "VIT Bhopal University",
      time: "29th - 30th Nov 2025",
      description:
        "A two-day event fostering innovation, collaboration, and intellectual engagement through competitions, speaker sessions, and entertainment activities.",
      registrationFee: "NA as of now",
      teamSize: "Individual & Team Events",
      type: "Multi-Event Competition",
      isUpcoming: true,
      bannerImages: [
        "/event_timeline/Nov 29-30.1.jpg",
        "/event_timeline/Nov 29-30.2.jpg",
      ],
      day1: {
        title:
          "Day 1: 29th Nov 2025 - Knowledge, Innovation, and Competition",
        description:
          "The event begins with an Opening Ceremony, featuring a keynote speaker who will set the stage with insights into emerging trends and industry advancements. This session aims to inspire participants and provide direction for the competitions and discussions that follow.",
        events: [
          {
            time: "10 AM - 1 PM",
            name: "Opening Ceremony & Keynote Session",
            venue: "Auditorium 1",
            description:
              "Setting the stage with insights into emerging trends and industry advancements",
          },
          {
            time: "1 PM - 5 PM",
            name: "Paper Presentation",
            venue: "Auditorium 1",
            description:
              "Showcase research papers, patents, and innovative ideas on cutting-edge topics. Connect with faculty and industry experts for publication support and idea refinement.",
          },
          {
            time: "1 PM - 5 PM",
            name: "Reverse Coding",
            venue: "AB1 307",
            description:
              "A unique coding challenge where participants decipher logic from given outputs. Tests analytical thinking, debugging skills, and algorithmic problem-solving.",
          },
          {
            time: "1 PM - 5 PM",
            name: "Ideathon",
            venue: "Coding Studio AB1",
            description:
              "Fast-paced brainstorming competition to develop innovative solutions to real-world problems. Teams pitch ideas to judges assessing creativity and feasibility.",
          },
          {
            time: "1 PM - 5 PM",
            name: "E-Sports Tournament",
            venue: "Arch 103",
            description:
              "Competitive gaming event featuring popular e-sports titles. Fosters teamwork, strategy, and sportsmanship in a structured tournament format.",
          },
        ],
      },
      day2: {
        title:
          "Day 2: 30th Nov 2025 - Inspiration, Engagement, and Entertainment",
        description:
          "The second day of the event shifts the focus toward thought-provoking discussions, creative expression, and entertainment.",
        events: [
          {
            time: "10 AM - 12 PM",
            name: "Podcast Session with Guest Speaker",
            venue: "Auditorium 1",
            description:
              "A live podcast discussion with an expert guest, offering an in-depth conversation on Entrepreneurship and relevant topics. This session is designed to be interactive, with an opportunity for the audience to engage with the speaker through questions and discussions.",
          },
          {
            time: "2 PM - 3 PM",
            name: "Stand-Up Comedy",
            venue: "Auditorium 1",
            description:
              "A dedicated segment featuring a professional well known comedian, bringing a refreshing break with humor and light-hearted entertainment. This segment aims to create a lively atmosphere and provide a space for relaxation and enjoyment.",
          },
          {
            time: "3 PM - 5 PM",
            name: "Meme War",
            venue: "Auditorium 1",
            description:
              "A unique competition where participants create and submit memes based on given themes. The memes will be judged based on creativity, humor, and relevance. The audience will participate in voting, and the winner will receive a special prize. This event encourages digital creativity and provides a fun and engaging experience.",
          },
          {
            time: "3 PM - 5 PM",
            name: "Cultural Performances",
            venue: "Auditorium 1",
            description:
              "A showcase of talent, including dance, music, and other artistic performances. This segment highlights the creative and cultural diversity of the participants and provides a platform for artistic expression.",
          },
        ],
      },
    };

    navigate(`/eventstimeline/${event1.title.replace(/\s+/g, "-")}`, {
      state: { event: eventDetails },
    });
  };

  // Function to handle event title click for event2
  const handleEventTitleClick2 = () => {
    const eventDetails = {
      date: "Dec 5 - 6",
      year: "2025",
      img: "/event_timeline/Dec 5-6.jpg",
      title: "Tech Innovate Fest",
      venue: "VIT Bhopal University",
      time: "5th - 6th Dec 2025",
      description:
        "A tech fest with focus on day 2 innovations and entertainment.",
      registrationFee: "NA as of now",
      teamSize: "Individual & Team Events",
      type: "Tech Competition",
      isUpcoming: true,
      bannerImages: [
        "/event_timeline/Dec 5-6.1.jpg",
        "/event_timeline/Dec 5-6.2.jpg",
      ],
      day1: {
        title: "Day 1: 5th Dec 2025 - Foundations",
        description: "Building blocks of tech innovation.",
        events: [
          {
            time: "10 AM - 12 PM",
            name: "Tech Keynote",
            venue: "Tech Hall A",
            description: "Inspiring talks on AI and blockchain.",
          },
          {
            time: "1 PM - 3 PM",
            name: "Workshop: AI Basics",
            venue: "Lab C",
            description: "Hands-on AI session.",
          },
        ],
      },
      day2: {
        title: "Day 2: 6th Dec 2025 - Innovation & Entertainment",
        description: "Advanced sessions and fun.",
        events: [
          {
            time: "10 AM - 12 PM",
            name: "Innovation Pitch",
            venue: "Main Stage",
            description: "Pitch your tech ideas to experts.",
          },
          {
            time: "2 PM - 4 PM",
            name: "Hackathon Finals",
            venue: "Coding Labs",
            description: "Showcase your projects.",
          },
          {
            time: "4:30 PM - 6 PM",
            name: "Tech Trivia Night",
            venue: "Auditorium",
            description: "Fun quiz on tech history.",
          },
        ],
      },
    };

    navigate(`/eventstimeline/${event2.title.replace(/\s+/g, "-")}`, {
      state: { event: eventDetails },
    });
  };

  // Reusable Event Card Component
  const EventCard = ({ eventData, onRegister, onViewDetails }) => (
    <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300">
      <div className="text-center">
        {/* Event Title - As Link */}
        <Link
          to={`/eventstimeline/${eventData.title.replace(/\s+/g, "-")}`}
          state={{ event: eventData }}
          className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block hover:opacity-80 transition-opacity duration-200 select-none"
        >
          {eventData.title}
        </Link>

        {/* Date Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-base font-bold shadow-md">
            <span className="mr-2">📅</span>
            {eventData.subtitle}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
          <p className="text-sm md:text-base text-white leading-relaxed">
            {eventData.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Register Button */}
          <button
            onClick={onRegister}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 Register Now
          </button>

          {/* View Details Button */}
          <button
            onClick={onViewDetails}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
          >
            📖 View Details
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-white/70 text-xs">
          <p>📍 {eventData.venue}</p>
          <p className="mt-1 text-white/50">
            Click the event title or "View Details" to see full schedule
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Events Section - Carousel with scrolling effect and pagination dots */}
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

        {/* Carousel Container */}
        <div className="relative w-full max-w-4xl h-96 flex items-center justify-center overflow-hidden rounded-xl shadow-xl">
          {/* Active Slide - clickable */}
          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100 z-10 pointer-events-auto">
            <EventCard
              eventData={currentEvent}
              onRegister={handleRegisterClick}
              onViewDetails={handleEventTitleClick}
            />
          </div>

          {/* Previous Slide - hidden and non-interactive */}
          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-0 pointer-events-none">
            <EventCard
              eventData={
                events[(currentSlide - 1 + events.length) % events.length]
              }
              onRegister={handleRegisterClick}
              onViewDetails={handleEventTitleClick}
            />
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex space-x-2 mt-6">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-yellow-400 scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
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
                        ? "bg-blue-500 scale-125"
                        : index < currentIndex
                        ? "bg-green-500"
                        : "bg-gray-300"
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
