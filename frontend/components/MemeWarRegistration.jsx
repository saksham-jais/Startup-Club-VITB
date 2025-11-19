// src/components/MemeWarRegistration.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const API_BASE = 'http://localhost:5000';
const API_BASE = 'https://startup-club-dczt.onrender.com';

const MemeWarRegistration = () => {
  const eventTitle = "Meme War Championship";
  const pricePricePerMeme = 50;
  const bgImage = "/public/Podcast_ban.jpg";

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: '',
    utrId: '',
    screenshot: null,
    memes: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalMemes = formData.memes.length;
  const totalPrice = totalMemes * 50;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleScreenshot = (e) => {
    setFormData(p => ({ ...p, screenshot: e.target.files[0] || null }));
  };

  const handleMemeUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setFormData(p => ({
      ...p,
      memes: [...p.memes, ...files]
    }));
    e.target.value = '';
  };

  const removeMeme = (index) => {
    setFormData(p => ({
      ...p,
      memes: p.memes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.registrationNumber.trim()) return toast.error("Registration number required");
    if (!formData.email.includes('@')) return toast.error("Valid email required");
    if (!formData.phone.trim()) return toast.error("Phone is required");
    if (!formData.utrId.trim()) return toast.error("UTR ID required");
    if (!formData.screenshot) return toast.error("Payment screenshot required");
    if (totalMemes === 0) return toast.error("Upload at least 1 meme!");

    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('title', eventTitle);
    fd.append('name', formData.name.trim());
    fd.append('registrationNumber', formData.registrationNumber.trim());
    fd.append('email', formData.email.trim());
    fd.append('phone', formData.phone.trim());
    fd.append('utrId', formData.utrId.trim());
    fd.append('screenshot', formData.screenshot);
    formData.memes.forEach(meme => fd.append('memeFile', meme));

    try {
      const r = await fetch(`${API_BASE}/memewar/register`, { method: 'POST', body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");

      toast.success(`${totalMemes} memes submitted! Total: ₹${totalPrice}. You're in the war!`);

      setFormData({
        name: '',
        registrationNumber: '',
        email: '',
        phone: '',
        utrId: '',
        screenshot: null,
        memes: []
      });
      document.querySelectorAll('input[type="file"]').forEach(el => el.value = '');

    } catch (e) {
      toast.error(e.message || "Try again");
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
                      alt="Meme War"
                      className="h-full w-auto object-contain rounded-2xl"
                    />
                    {/* Title overlay */}
                    
                  </div>
                </div>
                
              </div>

              {/* Desktop / Large Banner: original style */}
              <div className="hidden lg:block">
                <div
                  className="h-[56rem] rounded-3xl shadow-2xl overflow-hidden relative"
                  style={bannerStyle}
                >
                  
                </div>
                
              </div>

            </div>
          </div>

          {/* Form Section */}
          <div className="lg:flex-1">
            <div className="flex justify-center -mt-4">
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform z-10">
                    <span className="text-base font-bold text-white">UNLIMITED MEMES • PAY PER MEME</span>
                  </div>
                </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 md:p-10">

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 22BCS420"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      UTR ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="utrId"
                      value={formData.utrId}
                      onChange={handleInputChange}
                      placeholder="Enter UTR transaction ID"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Pay Per Meme — No Limit!</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">Total: ₹{totalPrice}</p>
                  <p className="text-lg text-gray-700 mb-6">
                    ₹50 × {totalMemes} meme{totalMemes !== 1 ? 's' : ''}
                  </p>
                  <div className="flex justify-center mb-4">
                    <img
                      src="/qr.jpg"
                      alt="Payment QR"
                      className="w-56 h-56 border-4 border-white rounded-2xl shadow-2xl"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Upload as many memes as you want — each costs ₹50
                  </p>
                </div>

                {/* Payment Screenshot */}
                <div className="mb-8">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Upload Payment Screenshot <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshot}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                  {formData.screenshot && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      Selected: {formData.screenshot.name}
                    </p>
                  )}
                </div>

                {/* Meme Uploads */}
                <div className="mb-8">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Upload Memes (Unlimited) <span className="text-red-500">*</span>
                    <span className="text-purple-600 font-bold ml-3">{totalMemes} added</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.gif"
                    multiple
                    onChange={handleMemeUpload}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 transition file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  <div className="mt-4 space-y-2">
                    {formData.memes.map((meme, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-lg border border-purple-200"
                      >
                        <span className="text-sm font-medium text-purple-800 truncate max-w-md">
                          {meme.name}
                        </span>
                        <button
                          onClick={() => removeMeme(i)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Dominate?</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Submitting <strong>{totalMemes} meme{totalMemes !== 1 ? 's' : ''}</strong> for{' '}
                  <strong>₹{totalPrice}</strong>
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || totalMemes === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : `Submit ${totalMemes} Meme${totalMemes !== 1 ? 's' : ''} & Enter War!`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </div>
  );
};

export default MemeWarRegistration;
