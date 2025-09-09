// App.jsx
import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/MainLayout";
import HeroSection from "../components/herosection";
import AboutUs from "../components/aboutus";
import AnimatedCards from "../components/event";
import Testimonial from "../components/testimonial";
import { EventTimeline } from '../components/eventTimeline';
import { EventDetail } from '../components/EventDetail';
import Teams from '../components/Teams';

function Home({ cards }) {
  return (
    <>
      <HeroSection
        buildingImg="https://picsum.photos/300/200?random=1"
        personImg="https://picsum.photos/300/200?random=2"
        phoneImg="https://picsum.photos/300/200?random=3"
      />
      <AboutUs />
      <div className="min-h-[600px] bg-gray-900 flex items-center justify-center">
        <AnimatedCards cards={cards} />
      </div>
      <Testimonial cards={cards} />
    </>
  );
}

function App({ cards }) {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home cards={cards} />} />
        <Route path="/events" element={<EventTimeline />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/teams" element={<Teams />} />
        {/* Add other routes here */}
      </Route>
    </Routes>
  );
}

export default App;
