import { useEffect, useState } from "react";

export default function EventPopup({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // show popup with animation
    setIsVisible(true);
  }, []);

  const handleRegister = () => {
  const eventSection = document.getElementById("events-section");
  if (eventSection) {
    eventSection.scrollIntoView({ behavior: "smooth" });
  }
  onClose();
};

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999] animate-fadeIn">
        <div
          className={`
            bg-white/10 backdrop-blur-xl border border-white/30
            rounded-2xl shadow-2xl p-4 w-[90%] max-w-md relative
            transition-all duration-300
            ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}
          `}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-400"
          >
            ×
          </button>

          {/* Poster Image */}
          <img
            src="https://res.cloudinary.com/dt83ijcjr/image/upload/v1763544172/event-registrations/standup/zkn1whqjmofjvm3cjgpi.jpg"
            alt="Event Poster"
            className="w-full rounded-xl mb-4"
          />

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600
              text-white py-3 rounded-full font-bold shadow-md
              hover:from-green-600 hover:to-emerald-700 transition"
          >
            🚀 Register Now
          </button>
        </div>
      </div>
    </>
  );
}
