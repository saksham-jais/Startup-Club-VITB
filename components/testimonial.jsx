import React, { useEffect, useRef, useState } from "react";

const TestimonialComponent = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null); // ✅ Track which card is hovered

  const testimonials = [
    {
      text: "We recently launched a new website for a Vital client and wanted to share some of the cool features we were able to implement, including faster load times, a fresh UI, and improved accessibility standards.",
      name: "Jane Smith",
      image: "https://picsum.photos/300/200?random=1",
    },
    {
      text: "Working with the team was fantastic! They helped us redesign our digital presence while ensuring brand consistency and user-friendliness. The project exceeded expectations.",
      name: "John Doe",
      image: "https://picsum.photos/300/200?random=2",
    },
    {
      text: "Our new platform has streamlined our operations significantly. From onboarding to client engagement, everything is now smoother, faster, and more reliable thanks to their expertise.",
      name: "Bob Johnson",
      image: "https://picsum.photos/300/200?random=3",
    },
  ];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const totalCards = testimonials.length;
    const cardWidth =
      slider.children[0].offsetWidth +
      parseInt(getComputedStyle(slider.children[0]).marginRight);

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const slide = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= cardWidth * totalCards) scrollAmount = 0;
      slider.scrollLeft = scrollAmount;

      const newIndex = Math.round(scrollAmount / cardWidth);
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);

      requestAnimationFrame(slide);
    };

    const animationId = requestAnimationFrame(slide);
    return () => cancelAnimationFrame(animationId);
  }, [currentIndex, testimonials.length]);

  const handleDotClick = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth =
      slider.children[0].offsetWidth +
      parseInt(getComputedStyle(slider.children[0]).marginRight);
    slider.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    setCurrentIndex(index);
  };

  return (
    <div className="bg-blue-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-hidden" ref={sliderRef}>
          <div className="flex space-x-6 whitespace-nowrap">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-96 h-80 p-6 bg-white text-blue-900 rounded-xl shadow-lg inline-block transition-all duration-300 ${
                  index === currentIndex ? "scale-110" : "scale-100"
                }`}
                style={{
                  backgroundImage:
                    hoveredCard === index ? `url(${testimonial.image})` : "none",
                  backgroundSize: "cover",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="h-full flex flex-col">
                  <p className="text-base flex-grow text-left leading-relaxed break-words line-clamp-4">
                    {testimonial.text}
                  </p>
                  <div className="text-left mt-auto">
                    <a href="#" className="text-blue-500 underline block">
                      Read more →
                    </a>
                    <div className="font-bold">{testimonial.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialComponent;
