import { useState } from "react";
import Navbar from "../components/navbar";
import "./App.css";
import "./index.css";
import HeroSection from "../components/herosection";
import AboutUs from "../components/aboutus";
import AnimatedCards from "../components/event";

function App() {
	return (
		<>
			<Navbar />
			<HeroSection
				buildingImg="/vite.svg"
				personImg="/src/assets/react.svg"
				phoneImg="https://example.com/phone.jpg"
			/>
			<AboutUs/>
			<div className="max-h-[600px] bg-gray-900 flex items-center justify-center">
      <AnimatedCards />
    </div>
		</>
	);
}

export default App;
