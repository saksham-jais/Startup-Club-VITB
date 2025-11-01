import React, { useEffect, useState } from "react";
import cursorImg from '../src/assets/custom-cursor.png';
import cursorHandImg from '../src/assets/cursor-hand-2.png';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobileRegex.test(navigator.userAgent) || window.innerWidth <= 768;
    };

    setIsMobile(checkMobile());

    if (checkMobile()) {
      document.body.style.cursor = 'auto';
      return;
    }

    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const mouseDown = () => setClicking(true);
    const mouseUp = () => setClicking(false);

    const handleHover = (e) => {
      const isInteractive = e.target.closest('a, button, input, [role="button"]');
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mouseover", handleHover);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Debug: Log to confirm events
    console.log("Custom cursor initialized");

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mouseover", handleHover);
      document.body.style.cursor = 'auto';
      console.log("Custom cursor cleaned up");
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          width: 32px;
          height: 32px;
          background-size: contain;
          background-repeat: no-repeat;
          transform: translate(-50%, -50%);
          transition: transform 0.15s ease, opacity 0.2s ease, visibility 0.2s ease;
          z-index: 99999;
          opacity: ${hovering ? 0 : 0.9}; /* Hide when hovering */
          visibility: ${hovering ? 'hidden' : 'visible'};
          will-change: transform, opacity, visibility;
        }
        .custom-cursor.clicking {
          transform: translate(-50%, -50%) scale(0.7);
          opacity: 1;
        }
        .custom-cursor.hovering {
          transform: translate(-50%, -50%) scale(1.2);
          filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.5));
        }
        .custom-cursor-hand {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          width: 28px;
          height: 28px;
          background-size: contain;
          background-repeat: no-repeat;
          transform: translate(-50%, -50%) rotate(10deg);
          transition: transform 0.15s ease, opacity 0.2s ease, visibility 0.2s ease;
          z-index: 99998;
          opacity: ${hovering ? 0.7 : 0}; /* Show only on clickable elements */
          visibility: ${hovering ? 'visible' : 'hidden'};
          will-change: transform, opacity, visibility;
        }
        .custom-cursor-hand.clicking {
          transform: translate(-50%, -50%) scale(0.65) rotate(10deg);
          opacity: 0.9;
        }
        .custom-cursor-hand.hovering {
          transform: translate(-50%, -50%) scale(1.15) rotate(10deg);
          filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.7));
        }
        @media (max-width: 768px) {
          .custom-cursor, .custom-cursor-hand {
            display: none;
          }
        }
      `}</style>
      <div
        className={`custom-cursor${clicking ? " clicking" : ""}${hovering ? " hovering" : ""}`}
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          backgroundImage: `url(${cursorImg})`,
        }}
      />
      <div
        className={`custom-cursor-hand${clicking ? " clicking" : ""}${hovering ? " hovering" : ""}`}
        style={{
          top: `${position.y + 10}px`,
          left: `${position.x + 10}px`,
          backgroundImage: `url(${cursorHandImg})`,
        }}
      />
    </>
  );
}