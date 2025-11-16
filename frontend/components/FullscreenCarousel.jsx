// FullscreenCarousel.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const startupEvent = {
  title: "S²-25 - StartUp Synergy Day-1",
  subtitle: "28 November 2025",
  description:
    "Opening Ceremony+Live Podcast Session, Coding Challenge, Ideathon, Meme War Competition",
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

const techFestEvent = {
  title: "S²-25 - StartUp Synergy Day-2",
  subtitle: "29 December 2025",
  description:
    "Featuring E-Sports, Cultural Performances, and Artists Performance.",
  img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  bannerImages: [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  ],
  type: "Tech Festival",
  collaboration: "With Campus Tech Society",
  time: "10:00 AM - 8:00 PM",
  venue: "VIT Bhopal University, Main Campus",
  date: "December 15",
  year: "2025",
  detailedDescription:
    "Dive into a world of technology with hands-on workshops, coding challenges, and inspiring talks from industry experts.",
  speaker: "Mr. Raj Patel",
  designation: "CTO, TechNova Solutions",
  judges: ["Dr. Sneha Rao", "Mr. Vikram Singh", "Prof. Anita Desai"],
  mentors: ["Alex Johnson, Tech Mentor", "Sara Lee, Innovation Coach"],
  day1: {
    title: "Day 1: Tech Workshops",
    description: "Introductory sessions and skill-building workshops.",
    events: [
      {
        time: "10:00 AM - 12:00 PM",
        name: "AI Workshop",
        venue: "Lab A",
        description: "Hands-on introduction to artificial intelligence.",
      },
      {
        time: "1:00 PM - 3:00 PM",
        name: "Web Dev Hackathon",
        venue: "Coding Lab",
        description: "Build and deploy web applications.",
      },
    ],
  },
  day2: {
    title: "Day 2: Competitions",
    description: "Hackathons and challenges.",
    events: [
      {
        time: "10:00 AM - 2:00 PM",
        name: "Hackathon Finals",
        venue: "Main Hall",
        description: "Present your projects to judges.",
      },
      {
        time: "3:00 PM - 5:00 PM",
        name: "Tech Quiz",
        venue: "Auditorium",
        description: "Test your tech knowledge.",
      },
    ],
  },
  day3: {
    title: "Day 3: Talks & Awards",
    description: "Keynotes and closing ceremony.",
    events: [
      {
        time: "10:00 AM - 12:00 PM",
        name: "Keynote Session",
        venue: "Auditorium",
        description: "Insights from industry leaders.",
      },
      {
        time: "2:00 PM - 4:00 PM",
        name: "Awards Ceremony",
        venue: "Main Stage",
        description: "Celebrate winners.",
      },
    ],
  },
  conclusion:
    "Join us for three days of tech excitement! See you at Tech Fest 2025.",
  registrationFee: "₹300 per participant",
  teamSize: "1-5 members",
};

const events = [startupEvent, techFestEvent];

const whoWeAreText = [
  "The StartUp Club is more than just a club; it's an ecosystem.",
  "We empower students by providing the resources, mentorship, and network needed to navigate the journey from concept to company.",
  "Whether you're a seasoned coder, a brilliant designer, a sharp marketer, or just have a spark of an idea, this is where you start.",
];

const FullscreenCarousel = () => {
  const navigate = useNavigate();

  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (currentIndex < whoWeAreText.length) {
      const currentText = whoWeAreText[currentIndex];
      let charIndex = 0;

      intervalRef.current = setInterval(() => {
        if (charIndex <= currentText.length) {
          setDisplayedText(currentText.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
            setDisplayedText("");
          }, 2000);
        }
      }, 30);
    } else {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText("");
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const handleRegisterClick = (eventIndex) => {
    if (eventIndex === 0) {
      navigate("/event-selection"); // Day 1 – Startup Synergy
    } else {
      navigate("/event-selection-tech"); // Day 2 – Tech Fest
    }
  };

  const getEventDetails = (index) => {
    if (index === 0) {
      return {
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
            "The event begins with an Opening Ceremony, featuring a keynote speaker who will set the stage with insights into emerging trends and industry advancements.",
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
                "Showcase research papers, patents, and innovative ideas on cutting-edge topics.",
            },
            {
              time: "1 PM - 5 PM",
              name: "Reverse Coding",
              venue: "AB1 307",
              description:
                "A unique coding challenge where participants decipher logic from given outputs.",
            },
            {
              time: "1 PM - 5 PM",
              name: "Ideathon",
              venue: "Coding Studio AB1",
              description:
                "Fast-paced brainstorming competition to develop innovative solutions.",
            },
            {
              time: "1 PM - 5 PM",
              name: "E-Sports Tournament",
              venue: "Arch 103",
              description:
                "Competitive gaming event featuring popular e-sports titles.",
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
                "A live podcast discussion with an expert guest on Entrepreneurship and relevant topics.",
            },
            {
              time: "2 PM - 3 PM",
              name: "Stand-Up Comedy",
              venue: "Auditorium 1",
              description:
                "A dedicated segment featuring a professional comedian for light-hearted entertainment.",
            },
            {
              time: "3 PM - 5 PM",
              name: "Meme War",
              venue: "Auditorium 1",
              description:
                "A meme creation competition judged on creativity, humor, and relevance.",
            },
            {
              time: "3 PM - 5 PM",
              name: "Cultural Performances",
              venue: "Auditorium 1",
              description:
                "A showcase of talent, including dance, music, and other artistic performances.",
            },
          ],
        },
      };
    } else {
      return {
        date: "Dec 15 - 17",
        year: "2025",
        img: "/event_timeline/Dec 15-17.jpg",
        title: "Tech Fest 2025",
        venue: "VIT Bhopal University",
        time: "15th - 17th Dec 2025",
        description:
          "Annual tech fest featuring workshops, hackathons, and tech talks.",
        registrationFee: "₹300 per participant",
        teamSize: "1-5 members",
        type: "Tech Festival",
        isUpcoming: true,
        bannerImages: [
          "/event_timeline/Dec 15-17.1.jpg",
          "/event_timeline/Dec 15-17.2.jpg",
        ],
        day1: {
          title: "Day 1: Tech Workshops",
          description: "Introductory sessions and skill-building workshops.",
          events: [
            {
              time: "10:00 AM - 12:00 PM",
              name: "AI Workshop",
              venue: "Lab A",
              description: "Hands-on introduction to artificial intelligence.",
            },
            {
              time: "1:00 PM - 3:00 PM",
              name: "Web Dev Hackathon",
              venue: "Coding Lab",
              description: "Build and deploy web applications.",
            },
          ],
        },
        day2: {
          title: "Day 2: Competitions",
          description: "Hackathons and challenges.",
          events: [
            {
              time: "10:00 AM - 2:00 PM",
              name: "Hackathon Finals",
              venue: "Main Hall",
              description: "Present your projects to judges.",
            },
            {
              time: "3:00 PM - 5:00 PM",
              name: "Tech Quiz",
              venue: "Auditorium",
              description: "Test your tech knowledge.",
            },
          ],
        },
        day3: {
          title: "Day 3: Talks & Awards",
          description: "Keynotes and closing ceremony.",
          events: [
            {
              time: "10:00 AM - 12:00 PM",
              name: "Keynote Session",
              venue: "Auditorium",
              description: "Insights from industry leaders.",
            },
            {
              time: "2:00 PM - 4:00 PM",
              name: "Awards Ceremony",
              venue: "Main Stage",
              description: "Celebrate winners.",
            },
          ],
        },
      };
    }
  };

  const handleEventTitleClick = (eventIndex) => {
    const eventDetails = getEventDetails(eventIndex);
    const eventTitle = events[eventIndex].title;

    navigate(`/eventstimeline/${eventTitle.replace(/\s+/g, "-")}`, {
      state: { event: eventDetails },
    });
  };

  const EventCard = ({ event, index }) => (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 md:p-8 relative z-20 pointer-events-auto">
      <div className="text-center">
        <button
          type="button"
          onClick={() => handleEventTitleClick(index)}
          className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block hover:opacity-80 transition-opacity duration-200 select-none w-full"
        >
          {event.title}
        </button>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-base font-bold shadow-md">
            <span className="mr-2">📅</span>
            {event.subtitle}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
          <p className="text-sm md:text-base text-white leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={() => handleRegisterClick(index)}
            className="relative z-30 pointer-events-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            🚀 Register Now
          </button>
        </div>

        <div className="mt-4 text-white/70 text-xs">
          <p>📍 VIT Bhopal University</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Events Section */}
      <div
        id="events-section"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4"
      >
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-8 w-full max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            UPCOMING EVENTS
          </h1>
          <div className="w-40 h-2 bg-yellow-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-blue-100 font-semibold">This two-day event is designed to foster innovation, collaboration, and intellectual engagement through a diverse range of activities including competitions, speaker sessions, and entertainment.</p>
        </div>

        {/* Event Cards */}
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <EventCard key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* We Build the Future Section - with Typewriter */}
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
