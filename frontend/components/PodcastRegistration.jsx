// src/components/PodcastRegistration.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';

const API_BASE = 'https://startup-club-dczt.onrender.com';

const PodcastRegistration = () => {
  const eventTitle = "Podcast Recording Session";
  const bgImage = "https://res.cloudinary.com/dt83ijcjr/image/upload/v1763290378/event-registrations/memewar/memes/WhatsApp_Image_2025-11-16_at_4.18.35_PM_2_nvdppn.jpg";

  const [formData, setFormData] = useState({
    name: '', 
    registrationNumber: '', 
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    const missing = ['name', 'registrationNumber', 'email'].filter(f => !formData[f]);
    if (missing.length > 0) return toast.error("All fields are required");
    if (!formData.email.includes('@')) return toast.error("Invalid email");

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/podcast/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          name: formData.name,
          registrationNumber: formData.registrationNumber,
          email: formData.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");

      toast.success("Registered successfully for Podcast Recording Session!");
      setFormData({ name: '', registrationNumber: '', email: '' });
    } catch (e) {
      toast.error(e.message || "Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${bgImage})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative mb-8">
          <div className="h-64 md:h-80 rounded-3xl shadow-2xl overflow-hidden relative" style={bannerStyle}>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-2xl mb-4">
                Opening Ceremony+Live Podcast Session
              </h1>
            </div>
          </div>
          <div className="flex justify-center -mt-8">
            <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform z-10">
              <span className="text-base font-bold text-white">FREE EVENT • LIMITED SEATS</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div><input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" /></div>
            <div><input name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="Registration Number *" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" /></div>
            <div className="md:col-span-2">
              <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address *" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>

          {/* Removed QR, UTR, and Upload — but keeping spacing intact with empty div */}
          <div className="mb-8"></div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Register for Free'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default PodcastRegistration;