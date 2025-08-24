import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const iconMap = {
  facebook: "fab fa-facebook-f",
  instagram: "fab fa-instagram",
  linkedin: "fab fa-linkedin-in",
  twitter: "fab fa-twitter",
  github: "fab fa-github",
  youtube: "fab fa-youtube",
};

const TeamCard = ({ name, role, image, socials }) => {
  const activeSocials = socials
    ? Object.entries(socials).filter(([_, url]) => url)
    : [];
  return (
    <div className="relative w-60 rounded-lg overflow-hidden shadow-lg group">
      <img src={image} alt={name} className="w-full h-80 object-cover" />
      {/* Social bar */}
      <div
        className="absolute top-0 right-0 w-12 bg-blue-500 flex flex-col items-center space-y-3 py-2
                   rounded-bl-lg transform -translate-y-full opacity-0
                   group-hover:translate-y-0 group-hover:opacity-100
                   transition-all duration-700 ease-in-out"
      >
        {activeSocials.map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200"
          >
            <i className={iconMap[platform] || "fas fa-link"}></i>
          </a>
        ))}
      </div>
      {/* Name & Role */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2
                   transform translate-y-full group-hover:translate-y-0
                   transition-transform duration-500 ease-in-out"
      >
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-blue-300">{role}</p>
      </div>
    </div>
  );
};

const AboutUs = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const members = [
    {
      name: "Albert Barnes",
      role: "Founder",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&h=300",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Patricia Stanley",
      role: "Product Lead",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=300",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "John Stanley",
      role: "Content Lead",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=300",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Evelyn Stone",
      role: "Photographer",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cf91f?auto=format&fit=crop&w=250&h=300",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
  ];

  // Card animation variants
  const cardVariants = {
    hidden: (i) => ({
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotate: i % 2 === 0 ? -10 : 10, // tilt like a stack
    }),
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: i * 0.2, // staggered reveal
      },
    }),
  };

  return (
    <div className="container mx-auto py-10 text-center" ref={ref}>
      <h2 className="text-3xl font-bold text-blue-900 mb-8">OUR TEAM</h2>

      {/* Motion Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {members.map((member, index) => (
          <motion.div key={index} custom={index} variants={cardVariants}>
            <TeamCard {...member} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AboutUs;
