import React, { useState, useEffect, useRef } from "react";

const cards = [
  { title: "calming breathing", bg: "from-blue-400 to-blue-200" },
  { title: "nighttime practice", bg: "from-pink-400 to-purple-200" },
  { title: "energizing practice", bg: "from-cyan-400 to-blue-200" },
  { title: "meditation", bg: "from-purple-300 to-indigo-200" },
  { title: "relaxation", bg: "from-indigo-300 to-purple-400" },
  { title: "calming breathing", bg: "from-blue-400 to-blue-200" },
  { title: "nighttime practice", bg: "from-pink-400 to-purple-200" },
  { title: "energizing practice", bg: "from-cyan-400 to-blue-200" },
  { title: "meditation", bg: "from-purple-300 to-indigo-200" },
  { title: "relaxation", bg: "from-indigo-300 to-purple-400" },
  { title: "calming breathing", bg: "from-blue-400 to-blue-200" },
  { title: "nighttime practice", bg: "from-pink-400 to-purple-200" },
  { title: "energizing practice", bg: "from-cyan-400 to-blue-200" },
  { title: "meditation", bg: "from-purple-300 to-indigo-200" },
  { title: "relaxation", bg: "from-indigo-300 to-purple-400" },
  { title: "calming breathing", bg: "from-blue-400 to-blue-200" },
  { title: "nighttime practice", bg: "from-pink-400 to-purple-200" },
  { title: "energizing practice", bg: "from-cyan-400 to-blue-200" },
  { title: "meditation", bg: "from-purple-300 to-indigo-200" },
  { title: "relaxation", bg: "from-indigo-300 to-purple-400" },
];

export default function AnimatedCards() {
  const [activeIndex, setActiveIndex] = useState(7);
  const intervalRef = useRef();
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev === cards.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Drag handlers
  const onDragStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.type === "touchstart" ? e.touches.clientX : e.clientX;
    clearInterval(intervalRef.current);
  };
  const onDragMove = (e) => {
  if (!isDragging.current) return;
  const clientX = e.type === "touchmove" ? e.touches.clientX : e.clientX;
  const deltaX = clientX - dragStartX.current;
  // Faster response with 30px threshold
  if (Math.abs(deltaX) > 30) {
    if (deltaX < 0 && activeIndex < cards.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (deltaX > 0 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    isDragging.current = false;
  }
};

  const onDragEnd = () => {
    isDragging.current = false;
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev === cards.length - 1 ? 0 : prev + 1));
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center w-full py-10 bg-white max-h-[600px]">
      <h1 className="text-4xl md:text-5xl font-bold text-[#140e6e] mb-6">EVENTS</h1>
      <div
        className="relative overflow-hidden"
        style={{ width: "1000px", height: "500px" }}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        <div className="relative w-full h-full">
          {cards.map((card, idx) => {
            const offset = idx - activeIndex;
            const isActive = offset === 0;
            const style = {
              position: "absolute",
              left: "50%",
              zIndex: 20 - Math.abs(offset),
              transform: `
                translate(-50%, -50%)
                translateX(${offset * 140}px)
                scale(${isActive ? 1.1 : 0.85})
                rotate(${offset * 4}deg)
              `,
              opacity: Math.abs(offset) > 2 ? 0 : 1,
              transition: "all 0.7s cubic-bezier(.52,.07,.36,1)",
              top: isActive ? "50%" : "calc(50% + 20px)",
            };

            return (
              <div
                key={idx}
                className={`w-64 h-80 rounded-xl text-white shadow-2xl
                  bg-gradient-to-br ${card.bg} flex flex-col justify-end p-6
                  border-2 border-white/10 select-none`}
                style={style}
              >
                <h2 className="text-xl font-bold mb-4">{card.title}</h2>
                <button className="self-end bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-100 transition">
                  &#9654;
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
