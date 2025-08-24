import { useState } from "react";
import Navbar from "../components/navbar";
import "./App.css";
import "./index.css";
import HeroSection from "../components/herosection";
import AboutUs from "../components/aboutus";
import AnimatedCards from "../components/event";
import CustomCursor from "../components/cursor";
import TestimonialComponent from "../components/testimonial";

function App() {
	return (
		<>
			<CustomCursor />
			<Navbar />
			<HeroSection
				buildingImg="https://picsum.photos/300/200?random=3"
				personImg="https://picsum.photos/300/200?random=2"
				phoneImg="https://picsum.photos/300/200?random=1"
			/>
			<AboutUs />
			<div className="max-h-[600px] bg-gray-900 flex items-center justify-center">
				<AnimatedCards />
			</div>
			<TestimonialComponent />
		</>
	);
}

export default App;
