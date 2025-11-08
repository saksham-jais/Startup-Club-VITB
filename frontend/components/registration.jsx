import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';

const API_BASE = 'http://localhost:5000'
// const API_BASE = 'https://startup-club-dczt.onrender.com'

function RegistrationPage({ title, description, bgImage }) {
  const qrCode = "/qr.jpg";

  /* ----------  EVENT DATA  ---------- */
  const [eventData, setEventData] = useState({
    title: title || 'Event Registration',
    description: description || '',
    bgImage:
      bgImage ||
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop',
  });

  /* ----------  FORM DATA  ---------- */
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    utrId: '',
    screenshot: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(new Set());

  /* ----------  ZOOM & PAN  ---------- */
  const [zoom, setZoom] = useState(() => window.innerWidth < 768 ? 0.4 : 0.6);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [baseZoomForPinch, setBaseZoomForPinch] = useState(1);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const mapContainerRef = useRef(null);
  const mapContentRef = useRef(null);
  const errorShownRef = useRef(new Set());

  const zoomStep = 0.15;
  const minZoom = 0.5;
  const maxZoom = 2.5;

  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    return Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - zoomStep, minZoom));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    const touches = Array.from(e.touches);
    if (touches.length === 1) {
      // Start panning
      setIsDragging(true);
      setDragStart({
        x: touches[0].clientX - panOffset.x,
        y: touches[0].clientY - panOffset.y,
      });
    } else if (touches.length === 2) {
      // Start pinching
      setInitialPinchDistance(getDistance(touches));
      setBaseZoomForPinch(zoom);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    const touches = Array.from(e.touches);
    if (touches.length === 1 && isDragging) {
      // Continue panning
      setPanOffset({
        x: touches[0].clientX - dragStart.x,
        y: touches[0].clientY - dragStart.y,
      });
    } else if (touches.length === 2 && initialPinchDistance > 0) {
      // Continue pinching
      const currentDistance = getDistance(touches);
      const delta = currentDistance / initialPinchDistance;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, baseZoomForPinch * delta));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    if (e.touches.length === 0) {
      setInitialPinchDistance(0);
    }
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(window.innerWidth < 768 ? 0.4 : 0.6);
    setPanOffset({ x: 0, y: 0 });
    setInitialPinchDistance(0);
  };

  /* ----------  FETCH BOOKED SEATS  ---------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTitle = params.get('title');
    const urlDesc = params.get('description');
    const urlBg = params.get('bgImage');

    if ((urlTitle || urlDesc || urlBg) && !title && !description && !bgImage) {
      setEventData({
        title: urlTitle || 'Event Registration',
        description: urlDesc || '',
        bgImage:
          urlBg ||
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop',
      });
    }
  }, [title, description, bgImage]);

  useEffect(() => {
    if (!eventData.title) return;
    fetch(
      `${API_BASE}/registration/booked/${encodeURIComponent(
        eventData.title
      )}`
    )
      .then((r) => r.json())
      .then((data) => {
        const set = new Set();
        data.forEach((s) => set.add(`${s.row}-${s.col}`));
        setBookedSeats(set);
      })
      .catch(() => {
        if (!errorShownRef.current.has(eventData.title)) {
          toast.error('Could not load booked seats');
          errorShownRef.current.add(eventData.title);
        }
      });
  }, [eventData.title]);

  /* ----------  PRICE LOGIC  ---------- */
  const priceMap = {
    N: 230, M: 230, L: 230,
    K: 230, J: 230, H: 230, G: 230, F: 230, E: 230, D: 230,
  };

  const getPrice = (row) => priceMap[row] || 0;

  /* ----------  SEAT CLICK  ---------- */
  const handleSeatClick = (row, col) => {
    const key = `${row}-${col}`;
    if (bookedSeats.has(key)) return;
    setSelectedSeat({ row, col });
  };

  /* ----------  FORM HANDLERS  ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, screenshot: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.registrationNumber ||
      !formData.email ||
      !formData.utrId ||
      !formData.screenshot ||
      !selectedSeat
    ) {
      toast.error('All fields + seat selection are required');
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Invalid email');
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('title', eventData.title);
    fd.append('name', formData.name);
    fd.append('registrationNumber', formData.registrationNumber);
    fd.append('email', formData.email);
    fd.append('utrId', formData.utrId);
    fd.append('screenshot', formData.screenshot);
    fd.append('seatRow', selectedSeat.row); // Send as string (letter)
    fd.append('seatColumn', String(selectedSeat.col)); // Send as string number

    try {
      const r = await fetch(`${API_BASE}/registration/submit`, {
        method: 'POST',
        body: fd,
      });
      
      const data = await r.json();
      
      if (!r.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      
      toast.success('Registration successful!');
      
      // Refresh booked seats
      const bookedResponse = await fetch(
        `${API_BASE}/registration/booked/${encodeURIComponent(
          eventData.title
        )}`
      );
      const bookedData = await bookedResponse.json();
      const set = new Set();
      bookedData.forEach((s) => set.add(`${s.row}-${s.col}`));
      setBookedSeats(set);
      
      // Reset form
      setFormData({
        name: '',
        registrationNumber: '',
        email: '',
        utrId: '',
        screenshot: null,
      });
      setSelectedSeat(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (e) {
      console.error('Submission error:', e);
      toast.error(e.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------  SEAT MAP DATA  ---------- */
  const premiumRows = ['N', 'M', 'L'];
  const executiveRows = ['K', 'J', 'H', 'G', 'F', 'E', 'D'];

  const seatsInRow = (row) => {
    if (premiumRows.includes(row)) return { left: 8, right: 6 };
    return { left: 8, right: 8 };
  };

  const renderRow = (rowLabel) => {
    const { left, right } = seatsInRow(rowLabel);
    const isPremium = premiumRows.includes(rowLabel);

    return (
      <div key={rowLabel} className="flex items-center gap-2 my-1">
        <div className="w-8 text-center font-semibold text-gray-700">{rowLabel}</div>
        <div className="flex gap-1">
          {Array.from({ length: left }, (_, i) => i + 1).map((col) => {
            const key = `${rowLabel}-${col}`;
            const booked = bookedSeats.has(key);
            const selected = selectedSeat?.row === rowLabel && selectedSeat?.col === col;
            return (
              <button
                key={col}
                onClick={() => handleSeatClick(rowLabel, col)}
                disabled={booked}
                className={clsx(
                  'w-10 h-10 rounded-lg text-xs font-bold text-white transition-all duration-200 shadow-sm',
                  booked
                    ? 'bg-red-500 cursor-not-allowed opacity-60'
                    : selected
                    ? 'bg-blue-600 scale-110 shadow-lg ring-2 ring-blue-300'
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105 hover:shadow-md'
                )}
              >
                {col}
              </button>
            );
          })}
        </div>
        {isPremium && <div className="w-16" />}
        <div className="flex gap-1">
          {Array.from({ length: right }, (_, i) => i + 1 + left).map((col) => {
            const key = `${rowLabel}-${col}`;
            const booked = bookedSeats.has(key);
            const selected = selectedSeat?.row === rowLabel && selectedSeat?.col === col;
            return (
              <button
                key={col}
                onClick={() => handleSeatClick(rowLabel, col)}
                disabled={booked}
                className={clsx(
                  'w-10 h-10 rounded-lg text-xs font-bold text-white transition-all duration-200 shadow-sm',
                  booked
                    ? 'bg-red-500 cursor-not-allowed opacity-60'
                    : selected
                    ? 'bg-blue-600 scale-110 shadow-lg ring-2 ring-blue-300'
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105 hover:shadow-md'
                )}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${eventData.bgImage})`,
    backgroundColor: '#e5e7eb',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* BANNER */}
        <div className="relative mb-8">
          <div
            className="h-64 md:h-80 rounded-3xl shadow-2xl overflow-hidden relative"
            style={bannerStyle}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-2xl mb-4">
                Registration Form
              </h1>
              {eventData.description && (
                <p className="text-lg md:text-2xl text-white text-center max-w-3xl drop-shadow-lg">
                  {eventData.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center -mt-8">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform z-10">
              <span className="text-base font-bold text-white">EVENT REGISTRATION</span>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10">
            {/* SEAT SELECTION */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Select Your Seat
              </h2>

              {/* Legend */}
              <div className="flex justify-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <span className="text-sm font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded opacity-60"></div>
                  <span className="text-sm font-medium">Booked</span>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={handleZoomOut}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                >
                  − Zoom Out
                </button>
                <button
                  onClick={resetView}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  Reset View
                </button>
                <button
                  onClick={handleZoomIn}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                >
                  + Zoom In
                </button>
              </div>

              {/* Seat Map */}
              <div
                ref={mapContainerRef}
                className="relative overflow-hidden border-2 border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner"
                style={{ 
                  height: '500px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none'
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  ref={mapContentRef}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                >
                  <div className="inline-block p-8">
                    {/* PREMIUM BLOCK */}
                    <div className="mb-10">
                      <div className="text-center font-bold text-xl text-indigo-700 mb-4 bg-indigo-50 py-2 rounded-lg">
                        ₹230 PREMIUM
                      </div>
                      <div className="flex justify-center">
                        <div>{premiumRows.map(renderRow)}</div>
                      </div>
                    </div>

                    {/* EXECUTIVE BLOCK */}
                    <div className="mb-10">
                      <div className="text-center font-bold text-xl text-purple-700 mb-4 bg-purple-50 py-2 rounded-lg">
                        ₹230 EXECUTIVE
                      </div>
                      <div className="flex justify-center">
                        <div>{executiveRows.map(renderRow)}</div>
                      </div>
                    </div>

                    {/* STAGE */}
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-2xl w-full max-w-md h-16 flex items-center justify-center text-base font-bold text-white shadow-xl">
                        🎭 STAGE - All Eyes This Way 🎭
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mt-3">
                💡 Use mouse wheel to zoom, drag to pan. On mobile: pinch to zoom, drag to pan
              </p>

              {/* Selected Seat Info */}
              {selectedSeat && (
                <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl flex items-center justify-between border-2 border-green-300 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                      {selectedSeat.row}{selectedSeat.col}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Selected Seat</div>
                      <div className="text-green-600 font-bold text-xl">₹{getPrice(selectedSeat.row)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSeat(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </section>

            {/* PERSONAL INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  UTR ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="utrId"
                  value={formData.utrId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter UTR transaction ID"
                />
              </div>
            </div>

            {/* QR CODE */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Scan QR Code for Payment</h3>
              {selectedSeat && (
                <p className="text-2xl font-bold text-green-600 mb-4">
                  Amount to Pay: ₹{getPrice(selectedSeat.row)}
                </p>
              )}
              <div className="flex justify-center mb-4">
                <img
                  src={qrCode}
                  alt="Payment QR"
                  className="w-56 h-56 border-4 border-white rounded-2xl shadow-2xl"
                />
              </div>
              <p className="text-sm text-gray-600">
                Scan the QR code to complete payment before submission
              </p>
            </div>

            {/* SCREENSHOT */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Upload Payment Screenshot <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
              />
              {formData.screenshot && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ File selected: {formData.screenshot.name}
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Confirmation</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              By submitting this form, I confirm that the information provided is accurate and payment has been completed.
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default RegistrationPage;