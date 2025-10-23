// App.jsx
import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/MainLayout";
import HeroSection from "../components/herosection";
import AnimatedCards from "../components/event";
import Testimonial from "../components/testimonial";
import { EventTimeline } from '../components/eventTimeline';
import { EventDetail } from '../components/EventDetail';
import Teams from '../components/Teams';
import ClubDetails from '../components/ClubDetails.jsx';
import Footer from '../components/footer.jsx';

function Home({ cards }) {
  return (
    <>
      <HeroSection
        buildingImg="https://picsum.photos/300/200?random=1"
        personImg="https://picsum.photos/300/200?random=2"
        phoneImg="https://picsum.photos/300/200?random=3"
      />
      <div>
        <AnimatedCards cards={cards} />
      </div>
      <Testimonial cards={cards} />
      <Footer></Footer>
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
        <Route path="/ClubDetails" element={<ClubDetails />} />
        <Route path="/testimonials" element={<Testimonial />} />
        {/* Add other routes here */}
      </Route>
    </Routes>
  );
}

export default App;
