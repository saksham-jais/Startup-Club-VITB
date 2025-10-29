import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationPage({ title, description, bgImage }) {
  const navigate = useNavigate();
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
      alert('Please fill all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Email must contain @ symbol');
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
      const response = await fetch('http://localhost:5000/api/registration/submit', {
        method: 'POST',
        body: formDataToSend, // Use FormData for file upload
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      console.log('Form submitted:', result);
      alert('Registration submitted successfully!');
      
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
      alert('Error submitting registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI://pay?pa=yourpaymentid@upi';

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 md:py-20 px-3 md:px-6 lg:px-8 max-w-[1500px] mx-auto">
      {/* Header Banner */}
      <div className="relative w-full max-w-5xl mx-auto mb-6 md:mb-10">
        <div
          className="bg-cover bg-center h-48 sm:h-56 md:h-72 lg:h-96 rounded-lg shadow-2xl overflow-hidden relative w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${eventData.bgImage}")`,
            backgroundColor: '#e5e7eb',
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center drop-shadow-2xl mb-2 md:mb-4 leading-tight">
              {eventData.title}
            </h1>
            {eventData.description && (
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white text-center max-w-3xl mx-auto drop-shadow-lg opacity-95 leading-relaxed px-2">
                {eventData.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Decorative banner strip - now relative for better alignment */}
        <div className="flex justify-center -mt-6 md:-mt-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg z-10">
            <span className="text-sm md:text-base font-semibold text-white whitespace-nowrap">🎉 EVENT REGISTRATION 🎉</span>
          </div>
        </div>
      </div>

      {/* Form Container - matched width to banner for desktop alignment */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Athlete Information Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
            Athlete Information
          </h2>
          
          {/* Grid layout for better desktop alignment: 1-col mobile, 2-col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 space-y-4 md:space-y-0">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base bg-white"
                placeholder="Enter your full name"
              />
            </div>

            {/* Registration Number */}
            <div>
              <label htmlFor="registrationNumber" className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                id="registrationNumber"
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base bg-white"
                placeholder="Enter registration number"
              />
            </div>

            {/* Email ID */}
            <div>
              <label htmlFor="email" className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base bg-white"
                placeholder="your.email@example.com"
              />
            </div>

            {/* UTR ID */}
            <div>
              <label htmlFor="utrId" className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                UTR ID <span className="text-red-500">*</span>
              </label>
              <input
                id="utrId"
                type="text"
                name="utrId"
                required
                value={formData.utrId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base bg-white"
                placeholder="Enter UTR transaction ID"
              />
            </div>
          </div>

          {/* QR Code for Payment - full width */}
          <div className="pt-6 pb-4 bg-gray-50 rounded-lg p-4 md:p-6 mt-6 md:mt-8">
            <label className="block text-sm md:text-base font-semibold text-gray-700 mb-3 md:mb-4 text-center">
              Scan QR Code for Payment
            </label>
            <div className="flex justify-center">
              <img
                src={qrCodeUrl}
                alt="Payment QR Code"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-green-500 rounded-lg shadow-lg"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 text-center mt-3 md:mt-4">
              📱 Scan the QR code to complete payment before submission
            </p>
          </div>

          {/* Screenshot Upload - full width */}
          <div className="mt-6 md:mt-8">
            <label htmlFor="screenshot" className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
              Upload Payment Screenshot <span className="text-red-500">*</span>
            </label>
            <input
              id="screenshot"
              type="file"
              name="screenshot"
              required
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
            {formData.screenshot && (
              <p className="text-xs md:text-sm text-green-600 mt-2 flex items-center gap-1">
                ✓ File selected: <span className="font-semibold">{formData.screenshot.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Confirmation Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 bg-gradient-to-br from-gray-50 to-blue-50">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
            Confirmation
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-5 md:mb-6 leading-relaxed">
            By submitting this form, I confirm that the information provided is accurate and that payment has been completed via the QR code above. The uploaded screenshot serves as proof of payment.
          </p>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none text-white font-bold py-3 md:py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg text-sm md:text-base"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;