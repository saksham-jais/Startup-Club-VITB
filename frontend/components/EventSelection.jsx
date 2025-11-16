// src/components/EventSelection.jsx
import React from "react";

const subEvents = [
  {
    id: 1,
    title: "Live Podcast Session",
    description: "Join a live podcast session with top speakers and get a chance to ask questions and interact in real-time.",
    img: "/Day 1-images/podcast.jpg",
    venue: "AB2-Audi2",
    time: "10:00 AM - 1:00 PM",
    registrationFee: "Free",
    teamSize: "Individual",
    route: "/register-podcast"
  },
  // {
  //   id: 2,
  //   title: "Reverse Coding",
  //   description: "Decode logic → Build solutions",
  //   img: "/Day 1-images/reverse coding.jpg",
  //   venue: "AB1-307",
  //   time: "1:00 PM - 5:00 PM",
  //   registrationFee: "₹80 per person",
  //   teamSize: "Maximum 3 members",
  //   route: "/register-hackathon"
  // },
  {
    id: 3,
    title: "Meme War Championship",
    description: "Create the funniest, most relatable memes on given themes. Audience votes + judges decide the ultimate Meme Lord!",
    img: "/Day 1-images/meme war.jpg",
    venue: "Online/Offline Hybrid",
    time: "1:00 PM - 5:00 PM",
    registrationFee: "₹50 per person",
    teamSize: "Individual",
    route: "/register-memewar"
  },
  {
    id: 4,
    title: "Ideathon 2025",
    description: "Solve real-world problems through innovation.",
    img: "/Day 1-images/ideathon.jpg",
    venue: "AB1 Coding Studio",
    time: "1:00 PM - 5:00 PM",
    registrationFee: "₹50 per person(in team)",
    teamSize: "1-6 members",
    route: "/register-ideathon"
  }
];

const EventSelection = () => {
  const handleRegisterClick = (route) => {
    window.open(route, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Select Your Event
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Choose from our exciting lineup at S²-25 - StartUp Synergy. Each event has its own dedicated registration form.
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {subEvents.map((subEvent) => (
            <div
              key={subEvent.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200 flex flex-col h-full"
            >
              <img
                src={subEvent.img}
                alt={subEvent.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {subEvent.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {subEvent.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p><span className="font-semibold">Venue:</span> {subEvent.venue}</p>
                  <p><span className="font-semibold">Time:</span> {subEvent.time}</p>
                  <p><span className="font-semibold">Fee:</span> {subEvent.registrationFee}</p>
                  <p><span className="font-semibold">Team Size:</span> {subEvent.teamSize}</p>
                </div>

                {/* Push button to bottom so all align horizontally */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleRegisterClick(subEvent.route)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Register Now for {subEvent.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSelection;
