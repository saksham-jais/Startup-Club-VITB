import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function EventDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { event } = location.state || {};
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
                    <button 
                        onClick={() => navigate("/eventstimeline")}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        ← Back to Events
                    </button>
                </div>
            </div>
        );
    }

    // Use bannerImages if available, otherwise use single image in array
    const images = event.bannerImages || [event.img];
    
    // Auto-rotate carousel
    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => 
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000); // Change image every 5 seconds

            return () => clearInterval(interval);
        }
    }, [images.length]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

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

    const handleRegisterClick = () => {
        const params = new URLSearchParams({
            title: event.title,
            description: event.description,
            bgImage: event.img || (event.bannerImages && event.bannerImages[0]),
        }).toString();
        
        window.open(`/registration?${params}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/eventstimeline")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
                >
                    <span className="text-xl">←</span>
                    <span className="font-medium">Back to Events</span>
                </button>

                {/* Carousel Banner - Shows complete images without stretching */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 relative">
                    <div className="relative bg-gray-100 overflow-hidden flex items-center justify-center min-h-[400px]">
                        {/* Carousel Images - Show complete images as they are */}
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex items-center justify-center ${
                                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <div className="relative flex items-center justify-center w-full h-full p-4">
                                    <img
                                        src={image}
                                        alt={`${event.title} - Image ${index + 1}`}
                                        className="mx-auto"
                                        style={{ 
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            width: 'auto',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        ))}
                        
                        {/* Carousel Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 z-10"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 z-10"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Image Indicators */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToImage(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === currentImageIndex 
                                                ? 'bg-white scale-125' 
                                                : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Event Info Overlay */}
                        <div className="absolute bottom-6 left-6 right-6 z-10">
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
                            <p className="text-white/90 text-lg">{event.time} • {event.venue}</p>
                        </div>
                    </div>
                </div>

                {/* Event Overview Section */}
                {event.detailedDescription && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Overview</h2>
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
                            {event.detailedDescription}
                        </div>
                    </div>
                )}

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

                        {/* Day 1 Schedule */}
                        {event.day1 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">{event.day1.title}</h2>
                                <p className="text-gray-700 mb-6">{event.day1.description}</p>
                                
                                <div className="space-y-4">
                                    {event.day1.events.map((session, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <span className="font-semibold text-blue-600 bg-white px-2 py-1 rounded text-sm">{session.time}</span>
                                                <span className="font-bold text-gray-800 text-lg">{session.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                                <span>📍</span>
                                                <span>{session.venue}</span>
                                            </div>
                                            <p className="text-gray-700">{session.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Day 2 Schedule */}
                        {event.day2 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">{event.day2.title}</h2>
                                <p className="text-gray-700 mb-6">{event.day2.description}</p>
                                
                                <div className="space-y-4">
                                    {event.day2.events.map((session, index) => (
                                        <div key={index} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <span className="font-semibold text-green-600 bg-white px-2 py-1 rounded text-sm">{session.time}</span>
                                                <span className="font-bold text-gray-800 text-lg">{session.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                                <span>📍</span>
                                                <span>{session.venue}</span>
                                            </div>
                                            <p className="text-gray-700">{session.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Conclusion */}
                        {event.conclusion && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                                <p className="text-gray-700 leading-relaxed">{event.conclusion}</p>
                            </div>
                        )}
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

                                {/* Register Now Button - Inside Event Info Card, after Team Size */}
                                <div className="flex justify-center pt-4">
                                    <button 
                                        onClick={handleRegisterClick}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 max-w-md"
                                    >
                                        🚀 Register Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Competition Highlights */}
                        {(event.day1 || event.day2) && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Competition Highlights</h3>
                                <div className="space-y-3">
                                    {event.day1 && event.day1.events.filter(e => 
                                        e.name === "Paper Presentation" || 
                                        e.name === "Reverse Coding" || 
                                        e.name === "Ideathon" ||
                                        e.name === "E-Sports Tournament"
                                    ).map((competition, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                                            <span className="text-blue-600 text-lg">
                                                {competition.name === "Paper Presentation" && "📄"}
                                                {competition.name === "Reverse Coding" && "💻"}
                                                {competition.name === "Ideathon" && "💡"}
                                                {competition.name === "E-Sports Tournament" && "🎮"}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{competition.name}</p>
                                                <p className="text-gray-600 text-sm">{competition.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Entertainment Highlights */}
                        {event.day2 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Entertainment Highlights</h3>
                                <div className="space-y-3">
                                    {event.day2.events.filter(e => 
                                        e.name === "Stand-Up Comedy" || 
                                        e.name === "Meme War" || 
                                        e.name === "Cultural Performances"
                                    ).map((entertainment, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl border border-green-200">
                                            <span className="text-green-600 text-lg">
                                                {entertainment.name === "Stand-Up Comedy" && "😂"}
                                                {entertainment.name === "Meme War" && "🖼️"}
                                                {entertainment.name === "Cultural Performances" && "💃"}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{entertainment.name}</p>
                                                <p className="text-gray-600 text-sm">{entertainment.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to All Events Button - Restored to full width */}
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