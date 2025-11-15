// EventSelectionTech.jsx (New component for the second event - route to '/event-selection-tech')
import React from "react";

const EventSelectionTech = () => {
  // Define 3 sub-events for Day 2 of Tech Innovate Fest (based on event2 data)
  const subEvents = [
    {
      id: 1,
      title: "Innovation Pitch",
      description: "Pitch your groundbreaking tech ideas to a panel of industry experts. Get feedback and potential funding opportunities.",
      img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      venue: "Main Stage",
      time: "10 AM - 12 PM, Dec 6",
      registrationFee: "₹150 per team",
      teamSize: "1-3 members"
    },
    {
      id: 2,
      title: "Hackathon Finals",
      description: "Present your hackathon projects from Day 1. Compete for top prizes in categories like AI, Web Dev, and IoT.",
      img: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      venue: "Coding Labs",
      time: "2 PM - 4 PM, Dec 6",
      registrationFee: "Included in main fee",
      teamSize: "2-4 members"
    },
    {
      id: 3,
      title: "Tech Trivia Night",
      description: "Test your knowledge in a lively trivia competition covering tech history, trends, and fun facts. Prizes for winners!",
      img: "https://images.unsplash.com/photo-1570549717069-72e9c7fc9b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      venue: "Auditorium",
      time: "4:30 PM - 6 PM, Dec 6",
      registrationFee: "₹50 per individual",
      teamSize: "Individual or Team"
    }
  ];

  const handleRegisterClick = (subEvent) => {
    // Create params specific to this sub-event for the registration form
    const params = new URLSearchParams({
      title: subEvent.title,
      description: subEvent.description,
      bgImage: subEvent.img,
      venue: subEvent.venue,
      time: subEvent.time,
      registrationFee: subEvent.registrationFee,
      teamSize: subEvent.teamSize,
      parentEvent: "Tech Innovate Fest" // To link back to parent event
    }).toString();
    
    // Open specific registration form in a new tab
    window.open(`/registration?${params}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Day 2 Events: Select Your Challenge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dive into the exciting Day 2 lineup at Tech Innovate Fest. Each event has its own dedicated registration.
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subEvents.map((subEvent) => (
            <div
              key={subEvent.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200"
            >
              <img
                src={subEvent.img}
                alt={subEvent.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{subEvent.title}</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{subEvent.description}</p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p><span className="font-semibold">📍 Venue:</span> {subEvent.venue}</p>
                  <p><span className="font-semibold">⏰ Time:</span> {subEvent.time}</p>
                  <p><span className="font-semibold">💰 Fee:</span> {subEvent.registrationFee}</p>
                  <p><span className="font-semibold">👥 Team Size:</span> {subEvent.teamSize}</p>
                </div>
                <button
                  onClick={() => handleRegisterClick(subEvent)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  🚀 Register Now for {subEvent.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSelectionTech;