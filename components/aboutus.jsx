import React, { useEffect } from "react";
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
	const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.001 });
	console.log("inView:", inView); // Debug inView state

	const members = [
		{
			name: "Albert Barnes",
			role: "Founder",
			image:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=300",
			socials: {
				facebook: "https://facebook.com/albert",
				instagram: "https://instagram.com/albert",
				linkedin: "https://linkedin.com/in/albert",
				twitter: "https://twitter.com/albert",
			},
		},
		{
			name: "Patricia Stanley",
			role: "Product Lead",
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=300",
			socials: {
				facebook: "https://facebook.com/patricia",
				instagram: "https://instagram.com/patricia",
				linkedin: "https://linkedin.com/in/patricia",
				twitter: "https://twitter.com/patricia",
			},
		},
		{
			name: "John Stanley",
			role: "Content Lead",
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=300",
			socials: {
				facebook: "https://facebook.com/john",
				instagram: "https://instagram.com/john",
				linkedin: "https://linkedin.com/in/john",
				twitter: "https://twitter.com/john",
			},
		},
		{
			name: "Evelyn Stone",
			role: "Photographer",
			image:
				"https://images.unsplash.com/photo-1529626455594-4ff0802cf91f?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=300",
			socials: {
				facebook: "https://facebook.com/evelyn",
				instagram: "https://instagram.com/evelyn",
				linkedin: "https://linkedin.com/in/evelyn",
				twitter: "https://twitter.com/evelyn",
			},
		},
	];

	const cardVariants = {
		hidden: (i) => ({
			opacity: 0.5,
			x: i * 15 - 22.5, // Tighter horizontal fanning
			y: i * 15 - 22.5, // Tighter vertical fanning
			rotate: i * 8 - 12, // Slightly more pronounced rotation
			scale: 0.85,
			zIndex: i,
			position: "absolute",
			left: "50%",
			top: "50%",
			transform: "translate(-50%, -50%)",
		}),
		visible: (i) => ({
			opacity: 1,
			x: 0,
			y: 0,
			rotate: 0,
			scale: 1,
			zIndex: 0,
			position: "relative",
			left: "auto",
			top: "auto",
			transform: "none",
			transition: {
				duration: 0.6,
				ease: "easeOut",
				delay: i * 0.15, // Faster sequential dealing
			},
		}),
	};

	return (
		<div className="container mx-auto py-10 text-center" ref={ref}>
			<h2 className="text-3xl font-bold text-blue-900 mb-8 no-underline hover:underline">
				OUR TEAM
			</h2>
			<div
				className="relative"
				style={{ minHeight: "400px" }} // Ensure container has enough height for stacking
			>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{members.map((member, index) => (
						<motion.div
							key={index}
							custom={index}
							variants={cardVariants}
							initial="hidden"
							animate={inView ? "visible" : "hidden"}
							style={{ originX: 0.5, originY: 0.5 }}
						>
							<TeamCard {...member} />
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AboutUs;
