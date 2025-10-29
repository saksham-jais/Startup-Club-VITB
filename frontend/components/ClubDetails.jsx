import React, { useState, useEffect, useRef } from 'react';
import { Users, Building, Heart, Trophy, Zap, Star } from 'lucide-react';

// A custom hook to detect if an element is in the viewport
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// AnimatedCounter component
const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [isVisible] = useOnScreen({ threshold: 0.5 });

    useEffect(() => {
        if (isVisible) {
            let start = 0;
            const endValue = parseInt(end.replace(/,/g, '').replace(/\+/g, ''));
            if (start === endValue) return;

            let startTime = null;
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentCount = Math.floor(progress * (endValue - start) + start);
                setCount(currentCount);
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [end, duration, isVisible]);
    
    // Add comma formatting and the plus sign back
    const formatCount = (num) => {
        let formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (String(end).includes('+')) {
            formatted += '+';
        }
        return formatted;
    };

    return <span ref={ref}>{formatCount(count)}</span>;
};


// Main Component - Now without the Header
const ClubDetails = () => {
    const [aboutRef, aboutVisible] = useOnScreen({ threshold: 0.2 });
    const [missionRef, missionVisible] = useOnScreen({ threshold: 0.3 });
    const [storyRef, storyVisible] = useOnScreen({ threshold: 0.3 });
    const [numbersRef, numbersVisible] = useOnScreen({ threshold: 0.2 });
    const [awardsRef, awardsVisible] = useOnScreen({ threshold: 0.4 });

    const stats = [
        { icon: <Building className="w-10 h-10 text-orange-500" />, number: "12", label: "Global Offices" },
        { icon: <Users className="w-10 h-10 text-orange-500" />, number: "7,600+", label: "Employees" },
        { icon: <Heart className="w-10 h-10 text-orange-500" />, number: "205,000+", label: "Customers" },
    ];
    const awards = [
        { icon: <Trophy />, label: "Best Results", year: 2024 },
        { icon: <Star />, label: "Easiest Admin", year: 2024 },
        { icon: <Users />, label: "Best Relationship", year: 2024 },
        { icon: <Zap />, label: "Best Usability", year: 2024 },
        { icon: <Heart />, label: "Users Love Us", year: 2024 },
    ];

    return (
        <div className="bg-white font-sans text-gray-800 overflow-x-hidden">
            {/* The original header is removed */}

            <main className="pt-28 md:pt-32"> {/* Increased padding-top to account for your fixed navbar */}
                {/* About Us Section */}
                <section ref={aboutRef} className="container mx-auto px-6 py-20 relative">
                    <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gray-50 rounded-bl-full"></div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className={`space-y-6 transition-all duration-1000 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">About Us</h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                HubSpot's company and culture are a lot like our product. They're crafted, not cobbled, for a delightful experience.
                            </p>
                        </div>
                        <div className={`transition-all duration-1000 delay-200 ${aboutVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-3'}`}>
                            <img src="https://placehold.co/600x400/F472B6/FFFFFF?text=Team+HubSpot" alt="HubSpot Team" className="rounded-2xl shadow-2xl w-full" />
                        </div>
                    </div>
                </section>

                {/* Our Mission Section */}
                <section ref={missionRef} className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className={`transition-all duration-1000 ease-in-out ${missionVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'}`}>
                                <img src="https://placehold.co/600x400/818CF8/FFFFFF?text=Grow+Better" alt="Grow Better" className="rounded-2xl shadow-2xl w-full" />
                            </div>
                            <div className={`space-y-6 transition-all duration-1000 delay-200 ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                                <h2 className="text-4xl font-bold text-gray-900">Our Mission: Helping Millions of Organizations Grow Better</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    We believe not just in growing bigger, but in growing better. And growing better means aligning the success of your own business with the success of your customers. Win-win!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story Section */}
                <section ref={storyRef} className="py-24 bg-gray-50 overflow-hidden">
                     <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className={`space-y-6 transition-all duration-1000 delay-200 ${storyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                                <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    In 2004, fellow MIT graduate students Brian Halligan and Dharmesh Shah saw a revolutionary shift in the way people work and purchase products. Buyers didn't want to be interrupted by ads, they wanted helpful information. In 2006, they founded HubSpot to help companies see that shift to grow better with inbound marketing.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Along the way, HubSpot expanded beyond marketing into a crafted, not cobbled suite of products that create the frictionless customer experience that buyers expect today. Expertly led by our new CEO, Yamini Rangan, HubSpot uses its customer platform built on an AI-powered Smart CRM to help millions of scaling organizations grow better.
                                </p>
                            </div>
                             <div className={`transition-all duration-1000 ease-in-out ${storyVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'}`}>
                                <img src="https://placehold.co/600x400/34D399/FFFFFF?text=Founders" alt="HubSpot Founders" className="rounded-2xl shadow-2xl w-full" />
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* By the Numbers Section */}
                <section ref={numbersRef} className="py-24 text-center">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-gray-900 mb-16 transition-all duration-1000 delay-100 ${numbersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}">HubSpot By the Numbers</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className={`bg-white p-10 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-1000 hover:-translate-y-2 hover:shadow-2xl delay-${index * 150} ${numbersVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                    <div className="mb-4 inline-block p-4 bg-orange-100 rounded-full">{stat.icon}</div>
                                    <div className="text-5xl font-extrabold text-orange-500 mb-2">
                                        <AnimatedCounter end={stat.number} />
                                    </div>
                                    <p className="text-lg text-gray-600 font-medium">{stat.label}</p>
                                    <a href="#" className="text-orange-500 font-semibold mt-4 inline-block hover:underline">Learn more</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Voted #1 Section */}
                <section ref={awardsRef} className="py-24 bg-gray-50">
                    <div className="container mx-auto px-6 text-center">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="flex flex-wrap justify-center gap-6">
                                {awards.map((award, index) => (
                                    <div key={index} className={`bg-white p-4 rounded-lg shadow-md border w-36 text-center transition-all duration-700 ease-out delay-${index * 100} ${awardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        <div className="text-orange-500 mb-2 inline-block bg-orange-100 p-2 rounded-full">{award.icon}</div>
                                        <p className="font-semibold text-sm text-gray-700">{award.label}</p>
                                        <p className="text-xs text-gray-500">{award.year}</p>
                                    </div>
                                ))}
                            </div>
                             <div className={`space-y-4 transition-all duration-1000 delay-500 ${awardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                                <h3 className="text-3xl font-bold text-gray-900">Voted #1 in 318 categories</h3>
                                <a href="#" className="text-orange-500 font-semibold text-lg hover:underline">Learn more</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                 <div className="container mx-auto px-6 py-8 text-center">
                    <p>&copy; {new Date().getFullYear()} HubSpot, Inc. All rights reserved.</p>
                    <p className="text-sm text-gray-400 mt-2">This is a conceptual redesign for demonstration purposes.</p>
                 </div>
            </footer>
        </div>
    );
};

export default ClubDetails;

