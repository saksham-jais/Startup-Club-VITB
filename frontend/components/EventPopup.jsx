import { useEffect, useState } from "react";

export default function EventPopup({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRegister = () => {
  const eventSection = document.getElementById("events-section");

  if (eventSection) {
    const firstCard = eventSection.querySelector(".event-card");

    if (firstCard) {
      const cardHeight = firstCard.clientHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let offsetMultiplier = 0.5; // default for desktop

      // Very narrow + small height mobile screens
      if (screenWidth <= 430 && screenHeight <= 900) {
        offsetMultiplier = 0.95;  // <<< MAIN FIX
      }

      const target = eventSection.offsetTop + cardHeight * offsetMultiplier;

      window.scrollTo({
        top: target,
        behavior: "smooth",
      });
    } else {
      eventSection.scrollIntoView({ behavior: "smooth" });
    }
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
            src="https://res.cloudinary.com/dt83ijcjr/image/upload/v1768554045/Red_Black_Bold_Modern_Comedy_Night_Show_Instagram_Story_z6cmmh.jpg"
            alt="Event Poster"
            className="w-full rounded-xl mb-4"
          />

          {/* Register Now */}
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
