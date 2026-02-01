import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function EventTimeline() {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState("newToOld");
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [activeTab, setActiveTab] = useState("all"); // "all" or "upcoming"
    
    const events = [
        {
            date: "Feb 04",
            year: "2026",
            img: "https://res.cloudinary.com/djtn57e6e/image/upload/v1769964954/WhatsApp_Image_2026-02-01_at_10.22.11_PM_n7dibc.jpg",
            title: "S²-25 - StartUp Synergy",
            venue: "AUDITORIUM 1",
            time: "04th Feb 2026",
            description: "A One-day event fostering innovation, collaboration, and intellectual engagement through competitions, speaker sessions, and entertainment activities.",
            type: "Multi-Event Competition",
            registrationFee: "499-1298",
            teamSize: "Individual",
            isUpcoming: true,
            bannerImages: [
                "/event_timeline/Nov 29-30.1.jpg",
                "/event_timeline/Nov 29-30.2.jpg"
            ],
            day1: {
                title: "Day 1: 04th Feb 2026 - Inspiration, Engagement, and Entertainment",
                description: "The second day of the event shifts the focus toward thought-provoking discussions, creative expression, and entertainment.",
                events: [
                    {
                        time: "10 AM - 01 PM",
                        name: "Podcast Session with Guest Speaker",
                        venue: "Auditorium 1",
                        description: "A live podcast discussion with an expert guest, offering an in-depth conversation on Entrepreneurship and relevant topics. This session is designed to be interactive, with an opportunity for the audience to engage with the speaker through questions and discussions."
                    },
                    {
                        time: "2 PM - 3 PM",
                        name: "Stand-Up Comedy",
                        venue: "Auditorium 1",
                        description: "A dedicated segment featuring a professional well known comedian, bringing a refreshing break with humor and light-hearted entertainment. This segment aims to create a lively atmosphere and provide a space for relaxation and enjoyment."
                    },
                    {
                        time: "3 PM - 5 PM",
                        name: "Cultural Performances",
                        venue: "Auditorium 1",
                        description: "A showcase of talent, including dance, music, and other artistic performances. This segment highlights the creative and cultural diversity of the participants and provides a platform for artistic expression."
                    }
                ]
            },
        },
        {
            date: "Apr 18",
            year: "2024",
            img: "/event_timeline/Apr 18.jpg",
            title: "StartX",
            venue: "Auditorium",
            time: "10:00 AM – 4:00 PM",
            description: "The event featured a TEDx Talk by Yash Kulshrestha (CEO, Feedbox) followed by an ideathon encouraging participants to innovate and make a difference.",
            registrationFee: "₹200",
            teamSize: "3 members per team",
            type: "Ideathon",
            speaker: "Yash Kulshrestha",
            designation: "CEO, Feedbox",
            isUpcoming: false,
            bannerImages: [
                "/event_timeline/Apr 18.1.JPG",
                "/event_timeline/Apr 18.2.JPG"
            ]
        },
        {
            date: "Sep 28",
            year: "2024",
            img: "/event_timeline/Sep 28.jpg",
            title: "Nirmaan 1.0 – Round 1: Pitch Deck Prastuti",
            venue: "Online Mode",
            time: "10:00 AM – 4:00 PM",
            description: "Introducing brilliant minds from diverse industries who shared their expertise to guide participants in refining their startup ideas. Judges included Mr. Piyush Nagar, Ms. Tamosi Moitra Sarkar, Mr. Utkarsh Jyotishi, and Mr. Amitesh.",
            registrationFee: "₹120 per team",
            teamSize: "2–4 participants",
            type: "Pitch Competition",
            judges: ["Mr. Piyush Nagar", "Ms. Tamosi Moitra Sarkar", "Mr. Utkarsh Jyotishi", "Mr. Amitesh"],
            isUpcoming: false,
            bannerImages: [
                "/event_timeline/Sep 28.1.JPG",
                "/event_timeline/Sep 28.2.JPG"
            ]
        },
        {
            date: "Oct 23",
            year: "2024",
            img: "/event_timeline/Oct 23.jpg",
            title: "Nirmaan 1.0 – Episode 1: Finance Gyaan",
            venue: "Auditorium 1",
            time: "10:00 AM – 1:00 PM",
            description: "An exclusive offline event on Finance by Piyush Nagar, Founder & CEO of Fayda Ecosystem. The session provided deep insights into Finance, Budgeting, and Revenue Models, helping participants evaluate their skills in the world of Finance and Startups.",
            registrationFee: "₹99",
            teamSize: "Individual",
            type: "Workshop",
            speaker: "Piyush Nagar",
            designation: "Founder & CEO of Fayda Ecosystem",
            isUpcoming: false,
            bannerImages: [
                "/event_timeline/Oct 23.1.JPG",
                "/event_timeline/Oct 23.2.JPG"
            ]
        },
        {
            date: "Dec 14",
            year: "2024",
            img: "/event_timeline/Dec 14.jpg",
            title: "Nirmaan 1.0 – Mentor Milap",
            venue: "Online Mode",
            time: "Full Day Event",
            description: "A golden opportunity for participants to gain Brahmastra from mentors for their startup journey. Esteemed mentors included Rahul Bhargava, Rakshit Khandelwal, Narendra Govil, Prashant Patel, and Shawez Shaikh. A revolutionary event fostering guidance, collaboration, and growth.",
            registrationFee: "Free",
            teamSize: "One-to-One",
            type: "Mentorship",
            mentors: ["Rahul Bhargava", "Rakshit Khandelwal", "Narendra Govil", "Prashant Patel", "Shawez Shaikh"],
            isUpcoming: false,
            bannerImages: [
                "/event_timeline/Dec 14.jpg",
                "/event_timeline/Dec 14.jpg"
            ]
        },
        {
            date: "Feb 21",
            year: "2025",
            img: "/event_timeline/Feb 21.jpg",
            title: "Jugaad Junction",
            venue: "Outside MPH",
            time: "10:00 AM – 1:00 PM",
            description: "A creative startup challenge with no limits—just pure entrepreneurial energy! Participants took on challenges, pitched innovative ideas, and showcased their problem-solving and sales skills in this thrilling, real-world startup experience.",
            registrationFee: "₹66",
            teamSize: "1–3 members",
            type: "Startup Challenge",
            isUpcoming: false,
            bannerImages: [
                "/event_timeline/Feb 21.1.JPG",
                "/event_timeline/Feb 21.2.JPG"
            ]
        },
        {
            date: "Aug 02",
            year: "2025",
            img: "/event_timeline/Aug 02.jpg",
            title: "Smart Post-Grad Choices for Engineers",
            venue: "Zoom (Online)",
            time: "6:30 PM – 7:30 PM",
            description: "A session focused on navigating post-graduate options like MBA, GATE, Placements, and Higher Studies. Topics included 2025 Job Market Insights, Mastering MBA & Competitive Exams, Higher Studies vs Placements, and Live Q&A Session with actionable career steps.",
            registrationFee: "Free",
            teamSize: "Individual",
            type: "Career Guidance",
            collaboration: "HitBullseye",
            speaker: "Rajeev Markanday",
            designation: "Verbal Wizard",
            isUpcoming: false,
            bannerImages: [
                "/event_timeline/Aug 02.1.jpg",
                "/event_timeline/Aug 02.2.jpg"
            ]
        }
    ];

   
    // Get unique months from events
    const allMonths = ["All", ...new Set(events.map(event => {
        const monthNames = {
            "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
            "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
            "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
        };
        const monthAbbr = event.date.split(" ")[0];
        return monthNames[monthAbbr] || monthAbbr;
    }))];

    // Filter events based on active tab
    const filteredByTab = activeTab === "upcoming" 
        ? events.filter(event => event.isUpcoming)
        : events;

    // Filter events by selected month
    const filteredEvents = selectedMonth === "All" 
        ? filteredByTab 
        : filteredByTab.filter(event => {
            const monthNames = {
                "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
                "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
                "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"
            };
            const eventMonthAbbr = event.date.split(" ")[0];
            const selectedMonthAbbr = monthNames[selectedMonth];
            return eventMonthAbbr === selectedMonthAbbr;
        });

    // Sort events based on selected order
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const months = {
            "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
            "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
        };
        
        const getDateValue = (event) => {
            const [month, day] = event.date.split(" ");
            return parseInt(event.year) * 10000 + months[month] * 100 + parseInt(day);
        };
        
        const aValue = getDateValue(a);
        const bValue = getDateValue(b);
        
        return sortOrder === "newToOld" ? bValue - aValue : aValue - bValue;
    });

    const getMonthDay = (dateString) => {
        if (typeof dateString !== "string") return ["", ""];
        const parts = dateString.split(" ");
        return [parts[0] ? parts[0].toUpperCase() : "", parts[1] ? parts[1] : ""];
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "newToOld" ? "oldToNew" : "newToOld");
    };

    const upcomingEventsCount = events.filter(event => event.isUpcoming).length;

    const handleViewDetails = (event) => {
        if (event.title === "S²-25 - StartUp Synergy") {
            navigate('/events');
        } else {
            navigate(`/eventstimeline/${event.title.replace(/\s+/g, '-')}`, { state: { event } });
        }
    };

    return (
        <div className="min-h-screen w-full max-w-7xl bg-gray-50 flex flex-col items-center overflow-x-hidden mx-auto my-20">
            {/* Banner */}
            <div className="w-full relative h-80 md:h-[32rem] flex items-center justify-center overflow-hidden">
                <img
                    src="/event_timeline/events.JPG"
                    alt="Events Banner"
                    className="absolute inset-0 h-full w-full object-cover brightness-75"
                    loading="lazy"
                />
                <div className="relative z-10 w-full text-center px-6 md:px-12">
                    <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-widest leading-tight mb-3 md:mb-6 drop-shadow-lg">
                        EVENTS
                    </h1>
                    <p className="text-white text-lg md:text-2xl max-w-4xl mx-auto drop-shadow-md">
                        Rise with us to actively engage our community with fellowship and love. Below you will find a list of upcoming events that you can attend, volunteer, and share with others.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="w-full flex justify-center">
                <div className="relative w-full bg-white shadow-2xl overflow-hidden py-12 px-8 md:px-16 rounded-3xl">
                    {/* Header with Tabs */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-6 mb-10 gap-4">
                        <div className="flex space-x-4">
                            <button
                                className={`text-2xl font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                                    activeTab === "all" 
                                        ? "text-gray-900 bg-blue-50 border border-blue-200" 
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab("all")}
                            >
                                All Events
                            </button>
                            <button
                                className={`text-2xl font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                                    activeTab === "upcoming" 
                                        ? "text-gray-900 bg-blue-50 border border-blue-200" 
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab("upcoming")}
                            >
                                Upcoming Events {upcomingEventsCount > 0 && `(${upcomingEventsCount})`}
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            {/* Sort Order Button */}
                            <div className="relative">
                                <button 
                                    className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                                        sortOrder === "newToOld" 
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                    onClick={toggleSortOrder}
                                >
                                    <span className={`transition-transform duration-300 ${sortOrder === "newToOld" ? '' : 'rotate-180'}`}>
                                        ⬆️
                                    </span>
                                    {sortOrder === "newToOld" ? "Newest First" : "Oldest First"}
                                </button>
                            </div>

                            {/* Month Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 cursor-pointer pr-8"
                                >
                                    {allMonths.map(month => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <span className="transform rotate-90">›</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Cards */}
                    <ul>
                        {sortedEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {activeTab === "upcoming" 
                                            ? "No Upcoming Events" 
                                            : "No Events Found"
                                        }
                                    </h3>
                                    <p className="text-gray-500">
                                        {activeTab === "upcoming" 
                                            ? "Check back later for exciting upcoming events!" 
                                            : "No events match your current filters."
                                        }
                                    </p>
                                    {activeTab === "upcoming" && (
                                        <button
                                            className="mt-4 text-blue-600 font-semibold hover:underline"
                                            onClick={() => setActiveTab("all")}
                                        >
                                            View All Events &rarr;
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            sortedEvents.map((event, idx) => {
                                const [month, day] = getMonthDay(event.date);
                                return (
                                    <React.Fragment key={idx}>
                                        <li className="flex flex-col md:flex-row gap-6 py-8 items-start">
                                            {/* Date */}
                                            <div className="flex flex-col items-center min-w-[70px] md:min-w-[90px] mx-2">
                                                <span className="text-gray-400 font-bold text-base md:text-lg">{month}</span>
                                                <span className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">{day}</span>
                                                <span className="text-gray-500 text-sm mt-1">{event.year}</span>
                                            </div>
                                            {/* Image Container - Better handling for different aspect ratios */}
                                            <div className="flex-shrink-0 w-full md:w-64">
                                                <div className="rounded-2xl shadow-lg overflow-hidden w-full h-48 bg-gray-100">
                                                    <img
                                                        src={event.img}
                                                        alt={event.title}
                                                        className="w-full h-full object-contain bg-white"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-between ml-0 md:ml-6 mt-4 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{event.title}</h3>
                                                    
                                                    {/* Venue and Time with Icons */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-1">
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                                                            <span className="text-lg">📍</span>
                                                            <span>{event.venue}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                                                            <span className="text-lg">⏰</span>
                                                            <span>{event.time}</span>
                                                        </div>
                                                    </div>

                                                    {/* Fee and Team Size */}
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                            Fee: {event.registrationFee}
                                                        </span>
                                                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                            Team: {event.teamSize}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Description */}
                                                    <p className="text-gray-700 mt-4 text-base leading-relaxed">{event.description}</p>
                                                </div>
                                                
                                                {/* View Details Button */}
                                                <button
                                                    className="mt-6 text-blue-600 font-semibold hover:underline text-base text-right md:text-left"
                                                    onClick={() => handleViewDetails(event)}
                                                >
                                                    View Event Details &rarr;
                                                </button>
                                            </div>
                                        </li>
                                        {/* Light Divider Line */}
                                        {idx !== sortedEvents.length - 1 && (
                                            <hr className="border-t border-gray-200 my-2" />
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}