import { useState } from "react";
import Navbar from "../components/navbar";
import "./App.css";
import HeroSection from "../components/herosection";
import AboutUs from "../components/aboutus";

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
		</>
	);
}

export default App;
