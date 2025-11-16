// src/components/EsportsRegistration.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000';
// const API_BASE = 'https://startup-club-dczt.onrender.com';

const EsportsRegistration = () => {
  const eventTitle = "Esports Championship 2025";
  const bgImage = "https://res.cloudinary.com/dt83ijcjr/image/upload/v1763291700/hackathon_screenshots/ad8jkvag1ioh2xe7f3ec.avif";

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: '',
    utrId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.registrationNumber.trim()) return toast.error("Registration number required");
    if (!formData.email.includes('@')) return toast.error("Valid email required");
    if (!formData.phone.trim()) return toast.error("Phone is required");
    if (!formData.utrId.trim()) return toast.error("UTR ID required");

    const screenshotFile = document.getElementById('screenshot').files[0];
    if (!screenshotFile) return toast.error("Payment screenshot required");

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', eventTitle);
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('registrationNumber', formData.registrationNumber.trim());
    formDataToSend.append('email', formData.email.trim());
    formDataToSend.append('phone', formData.phone.trim());
    formDataToSend.append('utrId', formData.utrId.trim());
    formDataToSend.append('screenshot', screenshotFile);

    try {
      const res = await fetch(`${API_BASE}/esports/register`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("You're registered for Esports Championship 2025!");
      setFormData({ name: '', registrationNumber: '', email: '', phone: '', utrId: '' });
      document.getElementById('screenshot').value = '';

    } catch (e) {
      toast.error(e.message || "Try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        <div className="relative mb-8">
          <div className="h-64 md:h-80 rounded-3xl shadow-2xl overflow-hidden relative" style={bannerStyle}>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-2xl mb-4">
                ESPORTS CHAMPIONSHIP
              </h1>
            </div>
          </div>
          <div className="flex justify-center -mt-8">
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform z-10">
              <span className="text-base font-bold text-white">₹149 • LIMITED SEATS</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Player Name <span className="text-red-500">*</span></label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Registration Number <span className="text-red-500">*</span></label>
              <input 
                name="registrationNumber" 
                value={formData.registrationNumber} 
                onChange={handleChange} 
                placeholder="e.g. 22BCS123" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="your.email@vitbhopal.ac.in" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="e.g. +91 9876543210" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">UTR ID <span className="text-red-500">*</span></label>
              <input 
                name="utrId" 
                value={formData.utrId} 
                onChange={handleChange} 
                placeholder="Enter your UTR transaction ID" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">Payment Screenshot <span className="text-red-500">*</span></label>
              <input 
                id="screenshot"
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    // Optional: preview image or validate size
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
              />
              <p className="text-sm text-gray-500 mt-1">Upload screenshot of your payment (UPI/Google Pay)</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 px-6 md:px-10 py-8 rounded-2xl mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎮 Secure Your Gaming Spot!</h3>
            <p className="text-center text-gray-600 mb-6">₹149 per player • Submit payment proof</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register Now (₹149)'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </div>
  );
};

export default EsportsRegistration;