import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function EventDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { event } = location.state || {};

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
                    <button 
                        onClick={() => navigate("/events")}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        ← Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const getMonthDay = (dateString) => {
        if (typeof dateString !== "string") return ["", ""];
        const parts = dateString.split(" ");
        return [parts[0] ? parts[0].toUpperCase() : "", parts[1] ? parts[1] : ""];
    };

    const [month, day] = getMonthDay(event.date);

    const handleImageError = (e) => {
        console.log("Image failed to load:", e.target.src);
        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/events")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
                >
                    <span className="text-xl">←</span>
                    <span className="font-medium">Back to Events</span>
                </button>

                {/* Event Header - Better handling for different aspect ratios */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
                    <div className="relative h-64 md:h-96 bg-gray-100">
                        <img
                            src={event.img}
                            alt={event.title}
                            className="w-full h-full object-contain bg-white"
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                    <span className="text-white text-sm font-medium">{event.type}</span>
                                </div>
                                {event.collaboration && (
                                    <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                        <span className="text-white text-sm font-medium">
                                            Collaboration: {event.collaboration}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                        </div>
                    </div>
                </div>

                {/* Rest of your EventDetail.jsx code remains the same... */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Event Details */}
                    <div className="space-y-6">
                        {/* Event Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                
                                {/* Speaker Information */}
                                {event.speaker && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <h3 className="font-semibold text-blue-900 mb-2">Featured Speaker</h3>
                                        <p className="text-blue-800 font-medium">{event.speaker}</p>
                                        {event.designation && (
                                            <p className="text-blue-700 text-sm">{event.designation}</p>
                                        )}
                                    </div>
                                )}

                                {/* Judges List */}
                                {event.judges && (
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                        <h3 className="font-semibold text-purple-900 mb-2">Judges Panel</h3>
                                        <ul className="space-y-2">
                                            {event.judges.map((judge, index) => (
                                                <li key={index} className="text-purple-800 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    {judge}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Mentors List */}
                                {event.mentors && (
                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                        <h3 className="font-semibold text-orange-900 mb-2">Mentors</h3>
                                        <ul className="space-y-2">
                                            {event.mentors.map((mentor, index) => (
                                                <li key={index} className="text-orange-800 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                    {mentor}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Event Information */}
                    <div className="space-y-6">
                        {/* Event Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Event Information</h3>
                            <div className="space-y-4">
                                {/* Date */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center bg-blue-100 rounded-xl p-3 min-w-[70px]">
                                        <span className="text-blue-600 font-bold text-sm uppercase">{month}</span>
                                        <span className="text-2xl font-black text-gray-900">{day}</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Date</p>
                                        <p className="font-semibold text-gray-900">{event.date} {event.year}</p>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="text-2xl text-gray-600">📍</span>
                                    <div>
                                        <p className="text-gray-600 text-sm">Venue</p>
                                        <p className="font-semibold text-gray-900">{event.venue}</p>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="text-2xl text-gray-600">⏰</span>
                                    <div>
                                        <p className="text-gray-600 text-sm">Time</p>
                                        <p className="font-semibold text-gray-900">{event.time}</p>
                                    </div>
                                </div>

                                {/* Registration Fee */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="text-2xl text-gray-600">💰</span>
                                    <div>
                                        <p className="text-gray-600 text-sm">Registration Fee</p>
                                        <p className="font-semibold text-gray-900">{event.registrationFee}</p>
                                    </div>
                                </div>

                                {/* Team Size */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="text-2xl text-gray-600">👥</span>
                                    <div>
                                        <p className="text-gray-600 text-sm">Team Size</p>
                                        <p className="font-semibold text-gray-900">{event.teamSize}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back to All Events Button */}
                        <button 
                            onClick={() => navigate("/eventstimeline")}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Back to All Events
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}