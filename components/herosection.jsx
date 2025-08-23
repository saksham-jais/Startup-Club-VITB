import React, { useEffect,useState } from "react";

const HeroSection = ({ buildingImg, personImg, phoneImg }) => {
	const defaultBuildingImg =
		"https://via.placeholder.com/300x200?text=Building";
	const defaultPersonImg = "https://via.placeholder.com/300x400?text=Person";
	const defaultPhoneImg = "https://via.placeholder.com/300x200?text=Phone";
	const [isLoading, setIsLoading] = useState(true);
	const [glowEffect, setGlowEffect] = useState(false);

	useEffect(() => {
		// Trigger animation on mount or refresh
		const elements = document.querySelectorAll(".animate-land");
		elements.forEach((el, index) => {
			el.style.animationDelay = `${index * 0.2}s`; // Staggered delay for landing effect
		});
	}, []);

	useEffect(() => {
		// Start flash immediately
		setGlowEffect(true);
	  
		// Hide loading screen after desired time
		const loadingTimer = setTimeout(() => {
		  setIsLoading(false);
		}, 2000); // adjust duration as needed
	  
		return () => clearTimeout(loadingTimer);
	  }, []);
	  

	return (
		<>
		      {/* Loading Screen */}
			  {isLoading && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
    <div className="flex items-center justify-center w-full h-full">
      <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${glowEffect ? "animate-flash" : ""}`}>
        <img src="/src/assets/sc.png" alt="VITERA Club Logo" className="w-[250px] h-auto" />
      </div>
    </div>
  </div>
)}

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
						<div className="md:w-1/2 mb-10 md:mb-0 animate-land">
							<h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
								Bank Smarter.
								<br />
								Live Better.
							</h1>
							<p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg">
								Manage your finances effortlessly with our advanced banking
								solutions. Safe, fast, and designed for your everyday needs.
							</p>
							<div className="mt-8 flex items-center space-x-4">
								<button className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-600 transition duration-300">
									Get Started Today
								</button>
								<a
									href="#"
									className="text-blue-500 font-medium hover:underline"
								>
									Learn More &gt;
								</a>
							</div>
							<div className="mt-10 flex space-x-6 text-sm text-gray-500">
								<a href="#" className="hover:text-blue-500">
									Personalized Finance
								</a>
								<a href="#" className="hover:text-blue-500">
									Investment Tools
								</a>
								{/* Add more links as needed */}
							</div>
						</div>

						{/* Right side: Image collage with animation */}
						<div className="md:w-1/2 relative h-80 md:h-96 animate-land">
							{/* Placeholder for building image */}
							<img
								src={buildingImg || defaultBuildingImg}
								alt="Building"
								className="absolute top-0 left-0 w-2/3 md:w-1/2 rounded-lg shadow-lg"
							/>
							{/* Placeholder for person image */}
							<img
								src={personImg || defaultPersonImg}
								alt="Person"
								className="absolute top-0 right-0 w-2/3 md:w-1/2 h-full rounded-lg shadow-lg object-cover"
							/>
							{/* Placeholder for phone image */}
							<img
								src={phoneImg || defaultPhoneImg}
								alt="Phone"
								className="absolute bottom-0 left-0 w-2/3 md:w-1/2 rounded-lg shadow-lg"
							/>
							<div className="absolute bottom-0 right-0 bg-blue-200/75 text-blue-800 p-4 rounded-lg shadow-lg font-bold text-lg">
								WE PROVIDE
								<br />
								BEST SERVICES
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
