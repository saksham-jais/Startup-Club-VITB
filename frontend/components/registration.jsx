import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrationPage({ title, description, bgImage }) {
  const navigate = useNavigate();
  const qrCode = "/qr.jpg";
  const [eventData, setEventData] = useState({
    title: title || 'Event Registration',
    description: description || '',
    bgImage: bgImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop'
  });

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    utrId: '',
    screenshot: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTitle = params.get('title');
    const urlDescription = params.get('description');
    const urlBgImage = params.get('bgImage');

    if ((urlTitle || urlDescription || urlBgImage) && !title && !description && !bgImage) {
      setEventData({
        title: urlTitle || 'Event Registration',
        description: urlDescription || '',
        bgImage: urlBgImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop'
      });
    }
  }, [title, description, bgImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, screenshot: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.registrationNumber || !formData.email || !formData.utrId || !formData.screenshot) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', eventData.title);
    formDataToSend.append('description', eventData.description);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('registrationNumber', formData.registrationNumber);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('utrId', formData.utrId);
    formDataToSend.append('screenshot', formData.screenshot);

    try {
      const response = await fetch('http://localhost:5000/registration/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      console.log('Form submitted:', result);
      toast.success('Registration submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        registrationNumber: '',
        email: '',
        utrId: '',
        screenshot: null,
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${eventData.bgImage})`,
    backgroundColor: '#e5e7eb',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  };

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-4 md:py-20 px-3 md:px-6 lg:px-8 max-w-[1500px] mx-auto">
      <div className="relative w-full max-w-6xl mx-auto mb-0">
        <div
          className="bg-cover bg-center h-48 sm:h-56 md:h-80 lg:h-96 xl:h-[28rem] rounded-t-3xl shadow-2xl overflow-hidden relative w-full"
          style={bannerStyle}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center drop-shadow-2xl mb-2 md:mb-4 leading-tight">
              Registration Form
            </h1>
            {eventData.description && (
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white text-center max-w-3xl mx-auto drop-shadow-lg opacity-95 leading-relaxed px-2">
                {eventData.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center -mt-6 md:-mt-8 lg:-mt-10">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-6 md:px-10 lg:px-12 py-2 md:py-3 lg:py-4 rounded-full shadow-xl z-10 transform hover:scale-105 transition-transform duration-200">
            <span className="text-sm md:text-base lg:text-lg font-bold text-white whitespace-nowrap">🎉 EVENT REGISTRATION 🎉</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-b-3xl shadow-2xl overflow-hidden ring-1 ring-gray-200/50 -mt-4">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 md:py-8 lg:py-12 border-b border-gray-200/50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 space-y-4 md:space-y-0">
            <div>
              <label htmlFor="name" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-3 lg:mb-4">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-4 md:py-4.5 lg:py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base lg:text-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-3 lg:mb-4">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                id="registrationNumber"
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-4 md:py-4.5 lg:py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base lg:text-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
                placeholder="Enter registration number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-3 lg:mb-4">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-4 md:py-4.5 lg:py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base lg:text-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="utrId" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-3 lg:mb-4">
                UTR ID <span className="text-red-500">*</span>
              </label>
              <input
                id="utrId"
                type="text"
                name="utrId"
                required
                value={formData.utrId}
                onChange={handleInputChange}
                className="w-full px-4 py-4 md:py-4.5 lg:py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base lg:text-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
                placeholder="Enter UTR transaction ID"
              />
            </div>
          </div>

          <div className="pt-8 pb-6 lg:pt-10 lg:pb-8 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-3xl p-6 md:p-8 lg:p-10 mt-8 lg:mt-12 ring-1 ring-gray-200/50">
            <label className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-4 lg:mb-6 text-center">
              Scan QR Code for Payment
            </label>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={qrCode}
                  alt="Payment QR Code"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 border-2 border-gray-300 rounded-2xl shadow-xl bg-white p-2"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center mt-4 lg:mt-6 leading-relaxed">
              📱 Scan the QR code to complete payment before submission
            </p>
          </div>

          <div className="mt-8 lg:mt-10">
            <label htmlFor="screenshot" className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-3 lg:mb-4">
              Upload Payment Screenshot <span className="text-red-500">*</span>
            </label>
            <input
              id="screenshot"
              type="file"
              name="screenshot"
              required
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base lg:text-lg file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm lg:file:text-base file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500 file:text-white hover:file:from-blue-600 hover:file:to-indigo-600 file:cursor-pointer file:shadow-md hover:file:shadow-lg"
            />
            {formData.screenshot && (
              <p className="text-xs md:text-sm lg:text-base text-green-600 mt-3 lg:mt-4 flex items-center gap-2 bg-green-50/50 p-3 rounded-xl">
                <span className="text-green-500">✓</span> File selected: <span className="font-semibold">{formData.screenshot.name}</span>
              </p>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12 lg:py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50/30 ring-1 ring-gray-200/50">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-4 lg:mb-6 tracking-tight">
            Confirmation
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 leading-relaxed max-w-2xl">
            By submitting this form, I confirm that the information provided is accurate and that payment has been completed via the QR code above. The uploaded screenshot serves as proof of payment.
          </p>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none text-white font-bold py-4 md:py-5 lg:py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl hover:shadow-2xl text-base md:text-lg lg:text-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration ✓'}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" hideProgressBar closeOnClick />
    </div>
  );
}

export default RegistrationPage;