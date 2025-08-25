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

// Helper function to get the nearest card index to the center of the scroller
const getNearestCardIndex = (translateX, cardWidth) => {
  // Calculate how many cards have been scrolled past, roughly.
  // The sign is important: -translateX means we are dragging to the left.
  const scrolledCards = -translateX / (cardWidth + 32); // 32px is the gap
  // Round to the nearest whole number to find the closest card index
  return Math.round(scrolledCards);
};

export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  const scrollerRef = useRef(null);
  const cardRef = useRef(null);
  
  // This effect updates the active card index as the user scrolls
  useEffect(() => {
    const handleScrollUpdate = () => {
      if (scrollerRef.current && cardRef.current) {
        // Get the width of a single card
        const cardWidth = cardRef.current.offsetWidth;
        // Get the scroll position of the scroller container
        const scrollPosition = scrollerRef.current.scrollLeft;
        // Calculate the center position of the scroller relative to the total width
        const centerOffset = scrollerRef.current.offsetWidth / 2;
        // Find which card is closest to the center
        const nearestIndex = Math.floor((scrollPosition + centerOffset - (cardWidth / 2)) / (cardWidth + 32)); // 32px is the gap
        
        // Update the active card index, making sure it's within bounds
        setActiveCardIndex(Math.max(0, Math.min(nearestIndex, CARD_DATA.length - 1)));
      }
    };
    
    // Add event listener to track scrolling
    const currentRef = scrollerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScrollUpdate);
    }
    
    // Cleanup function to remove the event listener
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScrollUpdate);
      }
    };
  }, []);

  // Handle the start of a drag action
  const handleMouseDown = (e) => {
    setIsDragging(true);
    // Record the initial X position of the mouse click
    setStartX(e.pageX - scrollerRef.current.offsetLeft);
    // Record the initial scroll position
    setScrollX(scrollerRef.current.scrollLeft);
  };
  
  // Handle the drag movement
  const handleMouseMove = (e) => {
    // Only proceed if a drag is in progress
    if (!isDragging) return;
    e.preventDefault();
    
    // Calculate the distance the cursor has moved
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX);
    
    // Update the scroll position of the container
    scrollerRef.current.scrollLeft = scrollX - walk;
  };
  
  // Handle the end of a drag action
  const handleMouseUp = () => {
    setIsDragging(false);
    // After dragging, find the closest card and snap to it
    if (scrollerRef.current && cardRef.current) {
      const scrollPosition = scrollerRef.current.scrollLeft;
      const cardWidth = cardRef.current.offsetWidth + 32; // Add gap
      const targetIndex = Math.round(scrollPosition / cardWidth);
      
      // Smoothly scroll to the new position
      scrollerRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth'
      });
      setActiveCardIndex(targetIndex);
    }
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#11082c] text-gray-300 font-inter p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">TESTIMONIALS</h1>
        <div className="w-16 h-1 bg-[#472c91] mx-auto mb-10"></div>
      </div>

      <div
        ref={scrollerRef}
        className="flex overflow-x-hidden w-full cursor-grab active:cursor-grabbing snap-x snap-mandatory py-8 px-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-8 pl-[50vw] pr-[50vw] overflow-visible">
          {CARD_DATA.map((card, index) => (
            <div
              key={card.id}
              ref={cardRef}
              className={`
                group
                flex-shrink-0
                w-80 h-[28rem]
                bg-[#180a37]
                rounded-xl
                shadow-xl
                border-2
                border-white/5
                transition-transform
                duration-500
                ease-out
                transform
                ${index === activeCardIndex ? 'scale-110' : 'scale-100'}
                snap-center
              `}
              style={{
                transform: `scale(${index === activeCardIndex ? '1.1' : '1.0'})`,
                transitionProperty: 'transform, opacity',
                transitionDuration: '500ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
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
              </div>
              <div className="p-6 flex flex-col items-start text-left">
                <h3 className="text-xl font-semibold mb-2 leading-snug">{card.title}</h3>
                <p className="text-sm text-white/50 mb-4 flex items-center">
                  <span>{card.date}</span>
                  <span className="mx-2">/</span>
                  <span>{card.comment}</span>
                </p>
                <p className="text-base text-gray-400 mb-6">{card.description}</p>
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
