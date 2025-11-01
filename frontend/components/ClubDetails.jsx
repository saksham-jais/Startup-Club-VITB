import React, { useState, useRef } from 'react';
import { Users, Target, Zap, Lightbulb, Heart, Gem, Sparkles } from 'lucide-react';

// A custom hook to detect if an element is in the viewport with re-triggering
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // Always update visibility state when intersection changes
            setIsVisible(entry.isIntersecting);
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// Floating Element Component
const FloatingElement = ({ delay = 0, position = "top-20 left-10" }) => (
    <div 
        className={`absolute w-4 h-4 bg-blue-400/20 rounded-full animate-float ${position}`}
        style={{ animationDelay: `${delay}s` }}
    />
);

// Animated Section Wrapper
const AnimatedSection = ({ children, isVisible, direction = "bottom", delay = 0 }) => {
    const getAnimationClass = () => {
        switch (direction) {
            case 'left': return 'animate-slide-left';
            case 'right': return 'animate-slide-right';
            case 'bottom': return 'animate-slide-bottom';
            default: return 'animate-slide-bottom';
        }
    };

    const getInitialState = () => {
        switch (direction) {
            case 'left': return 'opacity-30 translate-x-[-20px]';
            case 'right': return 'opacity-30 translate-x-[20px]';
            case 'bottom': return 'opacity-30 translate-y-[20px]';
            default: return 'opacity-30 translate-y-[20px]';
        }
    };

    return (
        <div 
            className={`transition-all duration-700 ease-out ${
                isVisible ? getAnimationClass() : getInitialState()
            }`}
            style={{ animationDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

// Main Component
const ClubDetails = () => {
    const [aboutRef, aboutVisible] = useOnScreen({ threshold: 0.2, rootMargin: '-50px' });
    const [missionRef, missionVisible] = useOnScreen({ threshold: 0.2, rootMargin: '-50px' });
    const [valuesRef, valuesVisible] = useOnScreen({ threshold: 0.1, rootMargin: '-50px' });
    const [benefitsRef, benefitsVisible] = useOnScreen({ threshold: 0.1, rootMargin: '-50px' });

    const values = [
        { 
            icon: <Users className="w-6 h-6" />, 
            title: "Collaboration is Key", 
            description: "We believe the best ideas are built together. Our community is built on teamwork, mutual respect, and shared goals.",
            gradient: "from-blue-500 to-cyan-500",
        },
        { 
            icon: <Zap className="w-6 h-6" />, 
            title: "Bias for Action", 
            description: "Ideas are easy; execution is everything. We encourage our members to stop talking and start building, testing, and iterating.",
            gradient: "from-purple-500 to-pink-500",
        },
        { 
            icon: <Heart className="w-6 h-6" />, 
            title: "Embrace Failure", 
            description: "We see failure not as an end, but as a crucial data point on the path to success. We create a safe space to experiment, fail fast, and learn.",
            gradient: "from-pink-500 to-rose-500",
        },
        { 
            icon: <Lightbulb className="w-6 h-6" />, 
            title: "Think Big", 
            description: "We challenge the status quo and encourage moonshot thinking. No idea is too ambitious, and no problem is too big to solve.",
            gradient: "from-orange-500 to-yellow-500",
        }
    ];

    const benefits = [
        { 
            icon: "🎯",
            title: "Skill Development", 
            description: "Access workshops that teach you the hard skills (coding, finance) and soft skills (pitching, leadership) you can't learn in a classroom.",
            features: ["Technical Workshops", "Leadership Training", "Mentorship Programs"],
        },
        { 
            icon: "🌐",
            title: "Exclusive Networking", 
            description: "Connect with successful alumni, venture capitalists, and guest speakers who are leaders in their fields.",
            features: ["VC Meetups", "Alumni Network", "Industry Leaders"],
        },
        { 
            icon: "👥",
            title: "Find Your Team", 
            description: "Meet like-minded students from diverse backgrounds and find the perfect co-founder for your next big idea.",
            features: ["Team Matching", "Perfect Co-founder", "Project Collaboration"],
        },
        { 
            icon: "💼",
            title: "Real-World Experience", 
            description: "Participate in pitch competitions, build real projects for your portfolio, and get a head-start on your career.",
            features: ["Pitch Competitions", "Portfolio Projects", "Internship Opportunities"],
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 font-sans text-gray-800 overflow-x-hidden">
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes slideInFromLeft {
                    from {
                        opacity: 0.3;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideInFromRight {
                    from {
                        opacity: 0.3;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideInFromBottom {
                    from {
                        opacity: 0.3;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }
                .animate-slide-left {
                    animation: slideInFromLeft 0.8s ease-out forwards;
                }
                .animate-slide-right {
                    animation: slideInFromRight 0.8s ease-out forwards;
                }
                .animate-slide-bottom {
                    animation: slideInFromBottom 0.8s ease-out forwards;
                }
                .gradient-text {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    background-size: 200% auto;
                }
            `}</style>

            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <FloatingElement position="top-20 left-10" delay={0} />
                <FloatingElement position="top-40 right-20" delay={1} />
                <FloatingElement position="bottom-20 left-20" delay={2} />
                <FloatingElement position="bottom-40 right-10" delay={1.5} />
            </div>

            <main className="relative">
                {/* Hero Section */}
                <section ref={aboutRef} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <AnimatedSection isVisible={aboutVisible} direction="left" delay={0.1}>
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-lg mb-4">
                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">Where Innovation Meets Execution</span>
                                    </div>
                                    <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
                                        <span className="gradient-text animate-shimmer">About The</span>
                                        <br />
                                        <span className="text-gray-900">StartUp Club</span>
                                    </h1>
                                    <p className="text-2xl text-gray-600 leading-relaxed font-light bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                                        We are the central hub for student entrepreneurship on campus, united by a passion for innovation.
                                    </p>
                                </div>
                            </AnimatedSection>
                            
                            <AnimatedSection isVisible={aboutVisible} direction="right" delay={0.3}>
                                <div className="relative">
                                    <img 
                                        src="/abtus/abtus.jpeg" 
                                        alt="Startup Team Collaboration" 
                                        className="relative rounded-3xl shadow-2xl w-full border-4 border-white/20 backdrop-blur-sm"
                                    />
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section ref={missionRef} className="relative py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <AnimatedSection isVisible={missionVisible} direction="bottom" delay={0.1}>
                                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                            Our Mission
                                        </h2>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        To foster a dynamic culture of entrepreneurship and innovation by providing students with the essential tools, 
                                        unwavering support, and collaborative community required to transform their ambitious ideas into successful ventures.
                                    </p>
                                </div>
                            </AnimatedSection>
                            
                            <AnimatedSection isVisible={missionVisible} direction="bottom" delay={0.3}>
                                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                            <Gem className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            Our Vision
                                        </h2>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        To be the launchpad for the next generation of industry-defining startups and visionary leaders, 
                                        creating a powerful entrepreneurial ecosystem that extends far beyond our campus walls.
                                    </p>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section ref={valuesRef} className="relative py-24 px-6 bg-white/50 backdrop-blur-sm">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <AnimatedSection isVisible={valuesVisible} direction="bottom" delay={0.1}>
                                <h2 className="text-5xl font-black text-gray-900 mb-6">
                                    What We <span className="gradient-text animate-shimmer">Stand For</span>
                                </h2>
                            </AnimatedSection>
                            <AnimatedSection isVisible={valuesVisible} direction="bottom" delay={0.2}>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Our core principles guide everything we do and define who we are as a community.
                                </p>
                            </AnimatedSection>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <AnimatedSection 
                                    key={index} 
                                    isVisible={valuesVisible} 
                                    direction="bottom" 
                                    delay={0.3 + (index * 0.1)}
                                >
                                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                                        <div className="flex items-center mb-4">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                                                {value.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            {value.description}
                                        </p>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section ref={benefitsRef} className="relative py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <AnimatedSection isVisible={benefitsVisible} direction="bottom" delay={0.1}>
                                <h2 className="text-5xl font-black text-gray-900 mb-6">
                                    Your <span className="gradient-text animate-shimmer">Unfair Advantage</span>
                                </h2>
                            </AnimatedSection>
                            <AnimatedSection isVisible={benefitsVisible} direction="bottom" delay={0.2}>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Everything you need to accelerate your entrepreneurial journey
                                </p>
                            </AnimatedSection>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-8">
                            {benefits.map((benefit, index) => (
                                <AnimatedSection 
                                    key={index} 
                                    isVisible={benefitsVisible} 
                                    direction="bottom" 
                                    delay={0.3 + (index * 0.15)}
                                >
                                    <div className="bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                                        <div className="flex items-start mb-6">
                                            <div className="text-5xl">
                                                {benefit.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {benefit.features.map((feature, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="bg-white text-gray-700 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 shadow-sm"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="text-3xl font-black mb-6">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                StartUp Club
                            </span>
                        </div>
                        <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                            Building the next generation of entrepreneurs and innovators. Join us in shaping the future of innovation.
                        </p>
                        
                        <div className="border-t border-white/10 pt-8 text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} The StartUp Club. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClubDetails;