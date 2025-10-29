import { useLocation, useNavigate } from "react-router-dom";

export function EventDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>No event data found. Please return to events list.</p>
        <button onClick={() => navigate("/events")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-7xl bg-gray-50 flex flex-col items-center overflow-x-hidden mx-auto my-20">
      <div className="w-full relative h-80 md:h-[32rem] flex items-center justify-center overflow-hidden">
        <img
          src={event.img}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover brightness-75"
          loading="lazy"
        />
        <div className="relative z-10 w-full text-center px-6 md:px-12">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-widest leading-tight mb-3 md:mb-6 drop-shadow-lg">
            {event.title}
          </h1>
          <p className="text-white text-lg md:text-2xl max-w-4xl mx-auto drop-shadow-md">
            Rise with us to actively engage our community with fellowship and love.
          </p>
        </div>
      </div>

      <div className="w-full flex justify-center ">
        <div className="w-full bg-white p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Event Details</h2>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p className="mt-4">{event.description}</p>
            <p className="mt-6 text-gray-600"><strong>Address:</strong> {event.address}</p>
          </div>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            All Events
          </button>
        </div>
      </div>
    </div>
  );
}
