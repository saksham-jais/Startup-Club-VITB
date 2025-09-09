import React from "react";
import { useNavigate } from "react-router-dom";
export function EventTimeline() {
    const navigate = useNavigate();
  const events = [
    {
      date: "Jun 23",
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      title: "Title of the Risen Event",
      address: "1015 California Ave, Los Angeles CA",
      time: "7:00 pm — 8:00 pm",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eleifend urna turpis non lobortis tellus.",
    },
    {
      date: "Jul 04",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      title: "Title of the Risen Event",
      address: "1015 California Ave, Los Angeles CA",
      time: "7:00 pm — 8:00 pm",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eleifend urna turpis non lobortis tellus.",
    },
  ];

  const getMonthDay = (dateString) => {
    if (typeof dateString !== "string") return ["", ""];
    const parts = dateString.split(" ");
    return [parts[0] ? parts[0].toUpperCase() : "", parts[1] ? parts[1] : ""];
  };

  return (
    <div className="min-h-screen w-full max-w-7xl bg-gray-50 flex flex-col items-center overflow-x-hidden mx-auto my-20"
>
      {/* Banner wrapper set to w-full (not w-screen) to fit container */}
      <div className="w-full relative h-80 md:h-[32rem] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
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

      {/* Content (remove negative margin -mt-24 and add padding instead) */}
      <div className="w-full flex justify-center">
        <div className="relative w-full  bg-white shadow-2xl overflow-hidden py-12 px-8 md:px-16 rounded-3xl">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-6 mb-10">
            <span className="text-2xl font-semibold text-gray-900">Events</span>
            <div className="flex space-x-4">
              <button className="text-gray-500 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                LIST
              </button>
              <button className="text-gray-500 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                MONTH
              </button>
            </div>
          </div>

          {/* Event Cards */}
<ul>
  {events.map((event, idx) => {
    const [month, day] = getMonthDay(event.date);
    return (
      <React.Fragment key={idx}>
        <li className="flex flex-col md:flex-row gap-6 py-8 items-start">
          {/* Date */}
          <div className="flex flex-col items-center min-w-[70px] md:min-w-[90px] mx-2">
            <span className="text-gray-400 font-bold text-base md:text-lg">{month}</span>
            <span className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">{day}</span>
          </div>
          {/* Image */}
          <div className="flex-shrink-0 w-full md:w-64">
            <img
              src={event.img}
              alt={event.title}
              className="rounded-2xl shadow-lg w-full h-48 object-cover"
              loading="lazy"
            />
          </div>
          {/* Content */}
          <div className="flex-1 flex flex-col justify-between ml-0 md:ml-6 mt-4 md:mt-0">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{event.title}</h3>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{event.address}</p>
              <p className="text-gray-500 text-sm md:text-base">{event.time}</p>
              <p className="text-gray-700 mt-4 text-base leading-relaxed">{event.description}</p>
            </div>
<button
  className="mt-6 text-blue-600 font-semibold hover:underline text-base text-right md:text-left"
  onClick={() => navigate(`/events/${event.title}`, { state: { event } })}
>
  View Event Details &rarr;
</button>
          </div>
        </li>
        {/* Light Divider Line */}
        {idx !== events.length - 1 && (
          <hr className="border-t border-gray-200 my-2" />
        )}
      </React.Fragment>
    );
  })}
</ul>

        </div>
      </div>
    </div>
  );
}
