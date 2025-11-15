// src/components/CulturalPerformanceRegistration.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000'||'https://startup-club-dczt.onrender.com';

const CulturalPerformanceRegistration = () => {
  const eventTitle = "Cultural Performance 2025";
  const bgImage = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: ''
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

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/cultural/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          name: formData.name,
          registrationNumber: formData.registrationNumber,
          email: formData.email
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("You're registered for Cultural Performance 2025!");
      setFormData({ name: '', registrationNumber: '', email: '' });

    } catch (e) {
      toast.error(e.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="relative mb-8">
          <div className="h-64 md:h-80 rounded-3xl shadow-2xl overflow-hidden" style={bannerStyle}>
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-2xl">
                Cultural Performance 2025
              </h1>
            </div>
          </div>
          <div className="flex justify-center -mt-8">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-8 py-3 rounded-full shadow-xl">
              <span className="text-base font-bold text-white">FREE REGISTRATION • LIMITED SEATS</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Full Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Registration Number *</label>
              <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="e.g. 22BCS123" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">Email Address *</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="your.email@vitbhopal.ac.in" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 px-6 md:px-10 py-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Secure Your Spot!</h3>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 text-white font-bold py-4 rounded-xl shadow-lg text-lg disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? 'Registering...' : 'Register Now — Free Entry'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </div>
  );
};

export default CulturalPerformanceRegistration;