import React from "react";

const iconMap = {
	facebook: "fab fa-facebook-f",
	instagram: "fab fa-instagram",
	linkedin: "fab fa-linkedin-in",
	twitter: "fab fa-twitter",
	github: "fab fa-github",
	youtube: "fab fa-youtube",
};

const TeamCard = ({ name, role, image, socials }) => {
	// Calculate padding to center icons vertically
	const activeSocials = socials
    ? Object.entries(socials).filter(([_, url]) => url)
    : [];
	return (
		<div className="relative w-64 rounded-lg overflow-hidden shadow-lg group">
			{/* Image */}
			<img src={image} alt={name} className="w-full h-80 object-cover" />

			{/* Social bar (thin top bar that slides down) */}
			<div
				className={`absolute top-0 right-0 w-12 bg-pink-500 flex flex-col items-center space-y-3 py-2
                 rounded-bl-lg
                  transform -translate-y-full opacity-0
                 group-hover:translate-y-0 group-hover:opacity-100
                 transition-all duration-700 ease-in-out`}
			
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
							)
					)}
			</div>

			{/* Name & Role at bottom */}
			<div
				className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4
                 transform translate-y-full group-hover:translate-y-0
                 transition-transform duration-500 ease-in-out"
			>
				<h3 className="text-xl font-bold">{name}</h3>
				<p className="text-pink-300">{role}</p>
			</div>
		</div>
	);
};

const AboutUs = () => {
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
				twitter: "https://twitter.com/patricia"
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
	return (
		<div className="container mx-auto py-10 text-center">
			<h2 className="text-3xl font-bold text-blue-900 mb-8">OUR TEAM</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{members.map((member, index) => (
					<TeamCard key={index} {...member} />
				))}
			</div>
		</div>
	);
};

export default AboutUs;
