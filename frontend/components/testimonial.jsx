import { useState, useRef, useEffect } from 'react';

// Updated card data with Core Pillars content
const CARD_DATA = [
  {
    id: 1,
    title: 'Innovate & Create',
    icon: '💡',
    description: 'We host hackathons, idea-storming sessions, and design sprints that challenge you to build practical solutions for real problems.',
  },
  {
    id: 2,
    title: 'Learn & Grow',
    icon: '📚',
    description: 'Gain hands-on skills through workshops on everything from business modeling and pitching to prototyping and digital marketing.',
  },
  {
    id: 3,
    title: 'Connect & Network',
    icon: '🌐',
    description: 'Meet your co-founders, connect with industry leaders, and get one-on-one mentorship from experienced entrepreneurs and faculty.',
  },
];

export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [padding, setPadding] = useState(0);
  
  const scrollerRef = useRef(null);
  const cardRef = useRef(null);

  // Set dynamic padding to center cards
  useEffect(() => {
    const updatePadding = () => {
      if (scrollerRef.current && cardRef.current) {
        const containerWidth = scrollerRef.current.offsetWidth;
        const cardWidth = cardRef.current.offsetWidth;
        setPadding((containerWidth / 2) - (cardWidth / 2));
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  // Automatic scrolling effect
  useEffect(() => {
    if (isDragging || padding === 0) return; // Skip if dragging or padding not set

    const interval = setInterval(() => {
      if (scrollerRef.current && cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
        const gap = 32;
        const fullStep = cardWidth + gap;
        const nextIndex = (activeCardIndex + 1) % CARD_DATA.length;
        const targetPosition = nextIndex * fullStep;

        // Smoothly scroll to the next card
        scrollerRef.current.scrollTo({
          left: targetPosition,
          behavior: 'smooth',
        });
        setActiveCardIndex(nextIndex);
      }
    }, 3000); // 3-second delay

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isDragging, activeCardIndex, padding]);

  // This effect updates the active card index as the user scrolls
  useEffect(() => {
    const handleScrollUpdate = () => {
      if (scrollerRef.current && cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
        const gap = 32;
        const fullStep = cardWidth + gap;
        const scrollPosition = scrollerRef.current.scrollLeft;
        
        // Calculate the nearest card index based on the center
        const nearestIndex = Math.max(0, Math.min(
          Math.round(scrollPosition / fullStep),
          CARD_DATA.length - 1
        ));
        setActiveCardIndex(nearestIndex);
      }
    };
    
    const currentRef = scrollerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScrollUpdate);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScrollUpdate);
      }
    };
  }, [padding]);

  // Handle the start of a drag action
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollerRef.current.offsetLeft);
    setScrollX(scrollerRef.current.scrollLeft);
  };
  
  // Handle the drag movement
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX);
    
    scrollerRef.current.scrollLeft = scrollX - walk;
  };
  
  // Handle the end of a drag action
  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollerRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      const gap = 32;
      const fullStep = cardWidth + gap;
      const scrollPosition = scrollerRef.current.scrollLeft;
      const nearestIndex = Math.max(0, Math.min(
        Math.round(scrollPosition / fullStep),
        CARD_DATA.length - 1
      ));
      
      scrollerRef.current.scrollTo({
        left: nearestIndex * fullStep,
        behavior: 'smooth'
      });
      setActiveCardIndex(nearestIndex);
    }
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-white font-inter p-4">
      <div className="max-w-7xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Core Pillars</h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto mb-10"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Three fundamental pillars that drive our mission to empower student entrepreneurs
        </p>
      </div>

      <div
        ref={scrollerRef}
        className="relative flex overflow-x-scroll overflow-y-hidden w-full cursor-grab active:cursor-grabbing snap-x snap-mandatory py-8 px-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ 
          WebkitOverflowScrolling: 'touch', 
          msOverflowStyle: 'none', 
          scrollbarWidth: 'none', 
          '-ms-overflow-style': 'none'
        }}
      >
        <div 
          className="flex gap-8 overflow-visible"
          style={{ paddingLeft: `${padding}px`, paddingRight: `${padding}px` }}
        >
          {CARD_DATA.map((card, index) => (
            <div
              key={card.id}
              ref={index === 0 ? cardRef : null}
              className={`
                group
                flex-shrink-0
                w-80
                bg-blue-400
                rounded-xl
                shadow-xl
                border-4
                border-white/5
                transition-all
                duration-500
                ease-out
                snap-center
                relative
                ${index === activeCardIndex ? 'z-10' : 'z-0'}
              `}
              style={{
                height: index === activeCardIndex ? '30.8rem' : '28rem', 
                transform: `scale(${index === activeCardIndex ? '1.1' : '1.0'})`,
                transitionProperty: 'transform, height, z-index',
                transitionDuration: '500ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible',
              }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center h-full justify-between">
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 leading-snug">{card.title}</h3>
                    
                    {/* Description */}
                    <p className="text-base text-white/90 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination dots */}
      <div className="flex space-x-2 mt-8">
        {CARD_DATA.map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3
              rounded-full
              transition-colors
              duration-300
              ${index === activeCardIndex ? 'bg-blue-400' : 'bg-gray-700'}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}