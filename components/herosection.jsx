import React, {useEffect} from "react";

const HeroSection = ({ buildingImg, personImg, phoneImg }) => {
	const defaultBuildingImg =
		"https://via.placeholder.com/300x200?text=Building";
	const defaultPersonImg = "https://via.placeholder.com/300x400?text=Person";
	const defaultPhoneImg = "https://via.placeholder.com/300x200?text=Phone";

	useEffect(() => {
		// Trigger animation on mount or refresh
		const elements = document.querySelectorAll(".animate-land");
		elements.forEach((el, index) => {
			el.style.animationDelay = `${index * 0.2}s`; // Staggered delay for landing effect
		});
	}, []);

	return (
		<>
			{" "}
			<style>
				{`
          @keyframes land {
            0% { transform: translateY(-100vh); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-land {
            animation: land 1s ease-out forwards;
          }
        `}
			</style>
			<section className="bg-gradient-to-b from-white to-gray-50 py-20 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center justify-between">
						{/* Left side: Details with animation */}
						<div className="md:w-1/2 mb-10 md:mb-0">
							<h1 className="text-5xl md:text-6xl font-bold text-black leading-tight animate-land">
								Bank Smarter.
								<br />
								Live Better.
							</h1>
							<p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg animate-land">
								Manage your finances effortlessly with our advanced banking
								solutions. Safe, fast, and designed for your everyday needs.
							</p>
							<div className="mt-8 flex items-center space-x-4">
								<button className="bg-purple-500 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-600 transition duration-300 animate-land">
									Get Started Today
								</button>
								<a
									href="#"
									className="text-purple-500 font-medium hover:underline animate-land"
								>
									Learn More &gt;
								</a>
							</div>
							<div className="mt-10 flex space-x-6 text-sm text-gray-500">
								<a href="#" className="hover:text-purple-500 animate-land">
									Personalized Finance
								</a>
								<a href="#" className="hover:text-purple-500 animate-land">
									Investment Tools
								</a>
								{/* Add more links as needed */}
							</div>
						</div>

						{/* Right side: Image collage with animation */}
						<div className="md:w-1/2 relative h-80 md:h-96">
							{/* Placeholder for building image */}
							<img
								src={buildingImg || defaultBuildingImg}
								alt="Building"
								className="absolute top-0 left-0 w-2/3 md:w-1/2 rounded-lg shadow-lg animate-land"
							/>
							{/* Placeholder for person image */}
							<img
								src={personImg || defaultPersonImg}
								alt="Person"
								className="absolute top-0 right-0 w-2/3 md:w-1/2 h-full rounded-lg shadow-lg object-cover animate-land"
							/>
							{/* Placeholder for phone image */}
							<img
								src={phoneImg || defaultPhoneImg}
								alt="Phone"
								className="absolute bottom-0 left-0 w-2/3 md:w-1/2 rounded-lg shadow-lg animate-land"
							/>
							{/* Best Services box */}
							<div className="absolute bottom-0 right-0 bg-purple-200 text-purple-800 p-4 rounded-lg shadow-lg font-bold text-lg animate-land">
								WE PROVIDE
								<br />
								BEST SERVICES
							</div>
							{/* Example overlay bubbles - adjust positions as needed */}
							<div className="absolute top-10 left-20 bg-white p-2 rounded-full shadow-md flex items-center space-x-2 text-sm animate-land">
								<span className="bg-blue-100 p-1 rounded">🇺🇸</span>
								<span>New Loan</span>
							</div>
							<div className="absolute top-20 right-10 bg-white p-2 rounded-full shadow-md text-sm animate-land">
								Pedro Neto $50.00
							</div>
							{/* Arrow or other elements */}
							<div className="absolute bottom-10 right-20 text-purple-500 text-2xl animate-land">
								&rarr;
							</div>
						</div>
					</div>
					{/* Bottom collaboration note */}
					<div className="text-center text-gray-500 text-sm mt-10 animate-land">
						We collaborate with 1000+ company
					</div>
				</div>
			</section>
		</>
	);
};

export default HeroSection;
