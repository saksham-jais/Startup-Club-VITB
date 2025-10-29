import React, { useEffect, useState } from "react";
import cursorImg from '../src/assets/custom-cursor.png';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const mouseDown = () => setClicking(true);
    const mouseUp = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return (
    <>
      <style>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          width: 20px;
          height: 20px;
          background-size: contain;
          background-repeat: no-repeat;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease;
          z-index: 99999;
        }
        .custom-cursor.clicking {
          transform: translate(-50%, -50%) scale(0.8);
        }
      `}</style>
      <div
        className={`custom-cursor${clicking ? " clicking" : ""}`}
        style={{ 
          top: position.y, 
          left: position.x,
          backgroundImage: `url(${cursorImg})` // <-- dynamic path from imported module
        }}
      />
    </>
  );
}
