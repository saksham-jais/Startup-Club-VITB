// EventSelectionEntertainment.jsx (New component for entertainment events - route to '/event-selection-entertainment')
import React from "react";

const subEvents = [
  {
    id: 1,
    title: "Esports Tournament",
    description: "Compete in high-stakes esports matches across popular titles. Showcase your gaming prowess and claim victory.",
    img: "/Day 2-images/e-sports.avif",
    venue: "Lab Complex",
    time: "11:00 Am - 1:00 PM",
    registrationFee: "₹149 per player",
    teamSize: "Individual",
    route: "https://unstop.com/events/s2-esports-tournament-vit-bhopal-university-vit-bhopal-1598015?lb=hxH3aCkc&utm_medium=Share&utm_source=WhatsApp"
  },
  {
    id: 2,
    title: "StandUp Comedy",
    description: "Get inspired, laugh loud, experience art & creativity together. Secure your seat for an evening of non-stop laughter.",
    img: "https://res.cloudinary.com/dt83ijcjr/image/upload/v1763729598/Copy_of_STARTUP_SYNERGY_Banner_Landscape_rwheiq.png",
    venue: "AB1, Auditorium-1",
    time: "3:00 PM",
    registrationFee: "₹399-₹549",
    teamSize: "Individual",
    route: "/register-standup"
  },
  {
    id: 3,
    title: "Cultural Performance Showcase",
    description: "Celebrate diversity through dance, music, and drama performances. Register to perform or attend as an audience member.",
    img: "https://www.shutterstock.com/image-photo/staff-treble-clef-musical-notes-600nw-2271621591.jpg",
    venue: "Cultural Hall",
    time: "1:00 PM - 2:00 PM",
    registrationFee: "Free for performers and audience",
    // teamSize: "NA",
    route: "https://unstop.com/events/music-performance-competition-vit-bhopal-university-vit-bhopal-1598020?lb=hxH3aCkc&utm_medium=Share&utm_source=WhatsApp"
  }
];

const EventSelectionEntertainment = () => {
  const handleRegisterClick = (route) => {
    window.open(route, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Entertainment Events: Select Your Fun
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Unwind and showcase your talents in our entertainment lineup at S²-25 - StartUp Synergy. From gaming battles to cultural celebrations and comedy nights. Each event has its own dedicated registration.
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <p><span className="font-semibold">📍 Venue:</span> {subEvent.venue}</p>
                  <p><span className="font-semibold">⏰ Time:</span> {subEvent.time}</p>
                  <p><span className="font-semibold">💰 Fee:</span> {subEvent.registrationFee}</p>
                  {/* <p><span className="font-semibold">👥 Team Size:</span> {subEvent.teamSize}</p> */}
                </div>

                {/* Push button to bottom so all align horizontally */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleRegisterClick(subEvent.route)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    🚀 Register Now for {subEvent.title}
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

export default EventSelectionEntertainment;
