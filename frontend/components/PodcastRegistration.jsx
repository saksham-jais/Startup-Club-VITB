// src/components/PodcastRegistration.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'https://startup-club-dczt.onrender.com';

const PodcastRegistration = () => {
  const eventTitle = "Podcast Recording Session";
  const bgImage = "/public/Podcast_ban.jpg";

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    const missing = ['name', 'registrationNumber', 'email', 'phone'].filter(f => !formData[f].trim());
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
          phone: formData.phone.trim()
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");

      toast.success("Registered successfully for Podcast Recording Session!");
      setFormData({ name: '', registrationNumber: '', email: '', phone: '' });
    } catch (e) {
      toast.error(e.message || "Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Banner Section */}
          <div className="lg:flex-1 flex-shrink-0">
            <div className="relative">

              {/* Mobile Banner: full image visible, blurred sides */}
              <div className="block lg:hidden">
                <div className="relative h-96 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Blurred background fill */}
                  <div
                    className="absolute inset-0 scale-110 blur-md"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  {/* Actual image fully visible */}
                  <div className="relative h-full flex items-center justify-center px-4">
                    <img
                      src={bgImage}
                      alt="Podcast Session"
                      className="h-full w-auto object-contain rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop / Large Banner */}
              <div className="hidden lg:block">
                <div
                  className="h-[56rem] rounded-3xl shadow-2xl overflow-hidden relative"
                  style={bannerStyle}
                />
              </div>

            </div>
          </div>

          {/* Form Section */}
          <div className="lg:flex-1">
            <div className="flex justify-center -mt-4 lg:mt-0">
              <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform z-10">
                <span className="text-base font-bold text-white">FREE EVENT • LIMITED SEATS</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 mt-4 lg:mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="Registration Number *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="mb-8"></div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Register for Free'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default PodcastRegistration;
