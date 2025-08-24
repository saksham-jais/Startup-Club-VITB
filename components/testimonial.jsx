import React, { useEffect, useRef, useState } from 'react';

const TestimonialComponent = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;
    const totalCards = 5;
    const cardWidth = slider.children[0].offsetWidth + parseInt(getComputedStyle(slider.children[0]).marginRight);

    const slide = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= cardWidth * totalCards) {
        scrollAmount = 0;
      }
      slider.scrollLeft = scrollAmount;
      requestAnimationFrame(slide);
    };

    const animationId = requestAnimationFrame(slide);

    return () => cancelAnimationFrame(animationId); // Cleanup on unmount
  }, []);

  const handleDotClick = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = slider.children[0].offsetWidth + parseInt(getComputedStyle(slider.children[0]).marginRight);
    slider.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const testimonials = [
    { text: "We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...", name: "Jane Smith", practice: "meditation" },
    { text: "We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...", name: "John Doe", practice: "relaxation" },
    { text: "We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...", name: "Bob Johnson", practice: "calming breathing" },
    { text: "We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...", name: "Alice Brown", practice: "practice" },
    { text: "We recently launched a new website for a Vital client and wanted to share some of the cool features we were able...", name: "Charlie Wilson", practice: "energizing practice" }
  ];

  return (
    <div className="bg-blue-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl font-light">TESTIMONIALS</h2>
        <p className="text-xl">because review matters...</p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex space-x-6 whitespace-nowrap" ref={sliderRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 h-80 p-6 bg-white text-blue-900 rounded-xl shadow-lg inline-block transition-all duration-300"
              style={{ backgroundImage: 'none', backgroundSize: 'cover' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundImage = `url(https://picsum.photos/300/200?random=${index + 1})`;
                e.currentTarget.style.backgroundSize = 'cover';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = 'none';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              <p className="text-lg mb-4">{testimonial.practice}</p>
              <div className="mt-auto">
                <p className="text-base mb-2">{testimonial.text}</p>
                <a href="#" className="text-blue-500 underline">Read more →</a>
                <div className="text-left font-bold mt-2">{testimonial.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialComponent;