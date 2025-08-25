import Navbar from "../components/navbar";
  import "./App.css";
  import "./index.css";
  import HeroSection from "../components/herosection";
  import AboutUs from "../components/aboutus";
  import AnimatedCards from "../components/event";
  import CustomCursor from "../components/cursor";
  import Testimonial from "../components/testimonial"; // Updated import

  function App({ cards }) {
    return (
      <>
        <CustomCursor />
        <Navbar />
        <HeroSection
          buildingImg="https://picsum.photos/300/200?random=1"
          personImg="https://picsum.photos/300/200?random=2"
          phoneImg="https://picsum.photos/300/200?random=3"
        />
        <AboutUs />
        <div className="min-h-[600px] bg-gray-900 flex items-center justify-center">
          <AnimatedCards cards={cards} />
        </div>
        <Testimonial cards={cards} /> {/* Updated component */}
      </>
    );
  }

  export default App;