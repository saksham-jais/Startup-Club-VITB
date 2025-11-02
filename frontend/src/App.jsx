// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import HeroSection from "../components/herosection";
import Testimonial from "../components/testimonial";
import { EventTimeline } from '../components/eventTimeline';
import { EventDetail } from '../components/EventDetail';
import Teams from '../components/Teams';
import ClubDetails from '../components/ClubDetails.jsx';
import Footer from '../components/footer.jsx';
import FullscreenCarousel from '../components/FullscreenCarousel'; // Single import (remove AnimatedCards if duplicate)
import RegistrationPage from '../components/registration';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
// import Login_SignUp from '../components/login_signup';

function Home({ cards = [] }) {  // Add default [] to avoid undefined errors
  return (
    <>
      <HeroSection
        buildingImg="https://picsum.photos/300/200?random=1"
        personImg="https://picsum.photos/300/200?random=2"
        phoneImg="https://picsum.photos/300/200?random=3"
      />
      <div>
        <FullscreenCarousel cards={cards} />  {/* Use the correct imported component */}
      </div>
      <Testimonial cards={cards} />
      <Footer />  {/* Consistent self-closing */}
    </>
  );
}

function App({ cards = [] }) {  // Add default [] here too
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home cards={cards} />} />  {/* Home as index */}
        <Route path="admin" element={<AdminLogin />} />  {/* Relative path (no leading /) */}
        <Route path="dashboard" element={<AdminDashboard />} />  {/* Relative path */}
        <Route path="events" element={<FullscreenCarousel />} />
        <Route path="eventstimeline" element={<EventTimeline />} />
        <Route path="eventstimeline/:id" element={<EventDetail />} />
        <Route path="teams" element={<Teams />} />
        <Route path="ClubDetails" element={<ClubDetails />} />  {/* Consider lowercase for consistency */}
        <Route path="testimonials" element={<Testimonial />} />
        <Route path="registration" element={<RegistrationPage />} />
        {/* <Route path="login_signup" element={<Login_SignUp />} /> */}
        {/* 404 Fallback */}
        <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;