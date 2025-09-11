import { useState, useRef, useEffect } from 'react';

// Use this mock data for the cards. In a real app, you would fetch this from an API.
const CARD_DATA = [
  {
    id: 1,
    title: 'What Makes Users Want to Share a Video on Social Media?',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+1',
  },
  {
    id: 2,
    title: 'What Makes Users Want to Share a Video on Social Media?',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+2',
  },
  {
    id: 3,
    title: 'Bumper Ads: How to Tell a Story in 6 Seconds',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+3',
  },
  {
    id: 4,
    title: 'A title for the Fourth Card',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'This is the description for the fourth card, which is also a blog post. Feel free to add more content here.',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+4',
  },
  {
    id: 5,
    title: 'Fifth Card Title',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'This is the description for the fifth card, which is also a blog post. Feel free to add more content here.',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+5',
  },
  {
    id: 6,
    title: 'Sixth Card Title',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'This is the description for the sixth card, which is also a blog post. Feel free to add more content here.',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+6',
  },
  {
    id: 7,
    title: 'Seventh Card Title',
    date: 'Jan 03, 2020',
    comment: '05 Comment',
    description: 'This is the description for the seventh card, which is also a blog post. Feel free to add more content here.',
    imageUrl: 'https://placehold.co/400x250/1e293b/d1d5db?text=Image+7',
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#11082c] text-gray-300 font-inter p-4">
      <div className="max-w-7xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">TESTIMONIALS</h1>
        <div className="w-16 h-1 bg-[#472c91] mx-auto mb-10"></div>
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
                bg-[#180a37]
                rounded-xl
                shadow-xl
                border-2
                border-white/5
                transition-all
                duration-500
                ease-out
                snap-center
                relative
                ${index === activeCardIndex ? 'z-10' : 'z-0'}
              `}
              style={{
                height: index === activeCardIndex ? '30.8rem' : '28rem', // 1.1 * 28rem = 30.8rem
                transform: `scale(${index === activeCardIndex ? '1.1' : '1.0'})`,
                transitionProperty: 'transform, height, z-index',
                transitionDuration: '500ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible',
              }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <div
                  className={`
                    absolute
                    inset-0
                    bg-cover
                    bg-center
                    transition-opacity
                    duration-500
                    ease-in-out
                    opacity-0
                    group-hover:opacity-100
                  `}
                  style={{ backgroundImage: `url(${card.imageUrl})` }}
                ></div>
                <div className="p-6 flex flex-col items-start text-left h-full justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 leading-snug">{card.title}</h3>
                    <p className="text-sm text-white/50 mb-4 flex items-center">
                      <span>{card.date}</span>
                      <span className="mx-2">/</span>
                      <span>{card.comment}</span>
                    </p>
                    <p className="text-base text-gray-400 mb-6">{card.description}</p>
                  </div>
                  <a
                    href="#"
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                  >
                    <span className="flex items-center">
                      Read more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </span>
                  </a>
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
              ${index === activeCardIndex ? 'bg-[#472c91]' : 'bg-gray-700'}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}