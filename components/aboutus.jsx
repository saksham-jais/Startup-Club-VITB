import React, { useState } from "react";
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
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [showAll, setShowAll] = useState(false);

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
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&h=300",
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
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&h=300",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        twitter: "#",
      },
    }
  ];

  const cardVariants = {
    hidden: (i) => {
      const mid = (members.length - 1) / 2;
      const cardWidth = 240; // px, from w-60 (15rem = 240px)
      const gap = 32; // px, from gap-8 (2rem = 32px)
      const naturalLeft = i * (cardWidth + gap);
      const center = (members.length * cardWidth + (members.length - 1) * gap) / 2;
      const targetLeft = center - cardWidth / 2 + (i - mid) * 20; // fan spread
      const x = targetLeft - naturalLeft;
      return {
        scale: 0.8,
        y: 50,
        rotate: (i - mid) * 10,
        x,
        opacity: 0.8,
      };
    },
    visible: (i) => ({
      scale: 1,
      y: 0,
      rotate: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: i * 0.2, // staggered reveal
      },
    }),
  };

  const displayedMembers = showAll ? members : members.slice(0, 4);

  return (
    <div className="container mx-auto py-10 text-center" ref={ref}>
      <h2 className="text-3xl font-bold text-blue-900 mb-8">OUR TEAM</h2>

      {/* Motion Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {displayedMembers.map((member, index) => (
          <motion.div key={index} custom={index} variants={cardVariants}>
            <TeamCard {...member} />
          </motion.div>
        ))}
      </motion.div>

      {/* View More/Less Button */}
      <div className="flex justify-center mt-8">
        <button
          className="relative border-none block py-3 px-8 text-xl bg-transparent cursor-pointer select-none overflow-hidden text-blue-600 z-10 font-inherit font-medium hover:text-white active:[&>span]:before:bg-blue-700"
          onClick={() => setShowAll(!showAll)}
        >
          <span className="absolute inset-0 bg-transparent z-[-1] border-4 border-blue-600 before:content-[''] before:block before:absolute before:w-[8%] before:h-[500%] before:bg-white before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-[60deg] before:transition-all before:duration-300 hover:before:-rotate-90 hover:before:w-full hover:before:bg-blue-600 group-hover:before:-rotate-90 group-hover:before:w-full group-hover:before:bg-blue-600" />
          {showAll ? "View Less" : "View More"}
        </button>
      </div>
    </div>
  );
};

export default AboutUs;