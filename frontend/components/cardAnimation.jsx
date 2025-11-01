import React, { useEffect, useState } from "react";

const cards = [
  { id: 1, label: "calming breathing" },
  { id: 2, label: "calming breathing" },
  { id: 3, label: "calming breathing" },
  { id: 4, label: "calming breathing" },
];

const fanAngles = [-30, -15, 0, 15, 30, -10, 10];

export default function ScrollingFanCards() {
  // tracks which cards have "animated out"
  const [revealedCards, setRevealedCards] = useState([false, false, false, false, false, false, false]);

  useEffect(() => {
    function onScroll() {
      // Find how far we've scrolled
      const scrollY = window.scrollY;
      // Set a threshold for each card for its animation trigger (80px + 60px per card, tune as needed)
      const newRevealed = cards.map((_, idx) => scrollY > 80 + idx * 60);
      setRevealedCards(newRevealed);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rowCardsCount = 4; // first 4 go to row

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-24 pb-72" style={{ overflowX: "hidden" }}>
      <div className="relative w-full h-[600px] flex items-start justify-center">
        {cards.map((card, idx) => {
          // Initial stacked/fanned position
          let style = {
            position: "absolute",
            left: "50%",
            top: "60px",
            transform: `translateX(-50%) rotate(${fanAngles[idx % fanAngles.length]}deg) scale(0.97)`,
            zIndex: cards.length - idx,
            opacity: 0.8,
            transition: "all 700ms cubic-bezier(.86,.01,.49,.99)",
            transitionDelay: `${idx * 120}ms`,
          };
          // When revealed: animate out to final slots
          if (revealedCards[idx]) {
            if (idx < rowCardsCount) {
              style = {
                ...style,
                left: `calc(50% - 305px + ${idx * 203}px)`, // tune width/spacing if needed
                top: "60px",
                transform: "rotate(0deg) scale(1.02)",
                opacity: 1,
                zIndex: 30 - idx,
              };
            } else {
              style = {
                ...style,
                left: "50%",
                top: `${180 + (idx - rowCardsCount) * 80}px`, // vertical fan below row
                transform: `translateX(-50%) rotate(${fanAngles[idx % fanAngles.length]}deg) scale(1.02)`,
                opacity: 1,
                zIndex: 30 - idx,
              };
            }
          }
          return (
            <div
              key={card.id}
              className="w-48 h-64 bg-gradient-to-br from-blue-400 to-blue-200 rounded-xl flex items-end justify-between text-white font-bold px-6 py-6 absolute shadow-lg"
              style={style}
            >
              <span className="text-lg">{card.label}</span>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          );
        })}
      </div>
      {/* Add enough bottom padding so you can scroll! */}
      <div style={{ height: "1200px", width: "100%" }}></div>
    </div>
  );
}
