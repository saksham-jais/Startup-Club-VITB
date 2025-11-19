// src/components/PodcastRegistration.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'https://startup-club-dczt.onrender.com';

const PodcastRegistration = () => {
  const eventTitle = "Podcast Recording Session";
  const bgImage = "https://res.cloudinary.com/dt83ijcjr/image/upload/v1763305362/hackathon_screenshots/zedpjaxutcdgev4afgyt.png";

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(0.6); // fallback ratio
  const bannerRef = useRef(null);

  // Load image aspect ratio
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAspectRatio(img.naturalHeight / img.naturalWidth);
    img.onerror = () => console.error('Failed to load banner image');
    img.src = bgImage;
  }, []);

  // Maintain aspect ratio on resize
  useEffect(() => {
    const updateHeight = () => {
      if (bannerRef.current && aspectRatio > 0) {
        const width = bannerRef.current.offsetWidth;
        bannerRef.current.style.height = `${width * aspectRatio}px`;
      }
    };
    const timeout = setTimeout(updateHeight, 100);
    window.addEventListener('resize', updateHeight);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateHeight);
    };
  }, [aspectRatio]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const missing = ['name', 'registrationNumber', 'email', 'phone'].filter(f => !formData[f].trim());
    if (missing.length) return toast.error("All fields are required");
    if (!formData.email.includes('@')) return toast.error("Invalid email");

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/podcast/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          ...formData,
          phone: formData.phone.trim()
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      toast.success("Registered successfully for Podcast Recording Session!");
      setFormData({ name: '', registrationNumber: '', email: '', phone: '' });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4 flex items-center justify-center">
      {/* Single Cohesive Card Container */}
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* 1. Banner */}
        <div ref={bannerRef} className="relative w-full h-48 md:h-56" style={bannerStyle}>
          {/* Optional dark overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        {/* 2. Badge – Overlaps banner slightly */}
        <div className="relative -mt-6 flex justify-center px-4">
          <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 
                          px-6 py-3 rounded-full shadow-xl 
                          text-white font-bold text-sm md:text-base 
                          border-4 border-white">
            FREE EVENT • LIMITED SEATS
          </div>
        </div>

        {/* 3. Form Body */}
        <div className="px-6 pb-8 pt-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name *"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="Registration Number *"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address *"
              className="md:col-span-2 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number *"
              className="md:col-span-2 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 
                       hover:from-emerald-600 hover:to-green-700 
                       disabled:from-gray-400 disabled:to-gray-500 
                       text-white font-bold py-4 rounded-xl 
                       transition-all transform hover:scale-[1.02] 
                       focus:ring-4 focus:ring-emerald-300 shadow-lg 
                       text-lg disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Register for Free'}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default PodcastRegistration;