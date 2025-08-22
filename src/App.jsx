import { useState } from "react";
import Navbar from "../components/navbar";
import "./App.css";
import HeroSection from "../components/herosection";

function App() {
	return (
		<>
			<Navbar />
			<HeroSection
				buildingImg="https://example.com/building.jpg"
				personImg="https://example.com/person.jpg"
				phoneImg="https://example.com/phone.jpg"
			/>
		</>
	);
}

export default App;
