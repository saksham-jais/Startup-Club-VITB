// components/StandupRegistration.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';

const API_BASE = 'https://startup-club-dczt.onrender.com';

function StandupRegistration({ title = 'Comedy Standup Night' }) {
  const qrCode = "/qr.jpg";

  /* ----------  EVENT DATA  ---------- */
  const [eventData, setEventData] = useState({
    title: title,
    bgImage:
      '/public/Podcast_ban.jpg',
  });

  /* ----------  SEATING FLAG  ---------- */
  const [hasSeating, setHasSeating] = useState(true); // Always true for standup

  /* ----------  FORM DATA  ---------- */
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: '',
    utrId: '',
    screenshot: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(new Set());

  /* ----------  ZOOM & PAN  ---------- */
  const [zoom, setZoom] = useState(() => (window.innerWidth < 768 ? 0.4 : 0.6));
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
      setIsDragging(true);
      setDragStart({
        x: touches[0].clientX - panOffset.x,
        y: touches[0].clientY - panOffset.y,
      });
    } else if (touches.length === 2) {
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
      setPanOffset({
        x: touches[0].clientX - dragStart.x,
        y: touches[0].clientY - dragStart.y,
      });
    } else if (touches.length === 2 && initialPinchDistance > 0) {
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
    fetchBookedSeats();
  }, []);

  const fetchBookedSeats = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/standup/booked/${encodeURIComponent(eventData.title)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const set = new Set();
      data.forEach((s) => set.add(`${s.row}-${s.col}`));
      setBookedSeats(set);
    } catch (err) {
      if (!errorShownRef.current.has(eventData.title)) {
        toast.error('Could not load booked seats');
        errorShownRef.current.add(eventData.title);
      }
    }
  };

  /* ----------  PRICE LOGIC  ---------- */
  const frontRows = ['A', 'B', 'C'];
  const normalRows = ['D', 'E', 'F', 'G'];
  const backRows = ['H', 'I', 'J'];
  const firstFloorRows = ['K', 'L', 'M', 'N', 'O'];

  const getPrice = (row) => {
    if (frontRows.includes(row)) return 699;
    if (normalRows.includes(row)) return 549;
    if (backRows.includes(row)) return 399;
    if (firstFloorRows.includes(row)) return 549;
    return 0;
  };

  const currentPrice = selectedSeat ? getPrice(selectedSeat.row) : 0;

  /* ----------  SEAT CLICK  ---------- */
  const handleSeatClick = (row, col) => {
    if (!hasSeating) return;
    const key = `${row}-${col}`;
    if (bookedSeats.has(key)) return;
    setSelectedSeat({ row, col });
  };

  /* ----------  RENDER ROW  ---------- */
  const renderRow = (row) => (
    <div key={row} className="flex gap-1 mb-1 justify-center">
      {Array.from({ length: 15 }, (_, col) => (
        <button
          key={`${row}-${col + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSeatClick(row, col + 1);
          }}
          className={getSeatClass(row, col + 1)}
        >
          {col + 1}
        </button>
      ))}
    </div>
  );

  const getSeatClass = (row, col) => {
    const key = `${row}-${col}`;
    const isBooked = bookedSeats.has(key);
    const isSelected = selectedSeat?.row === row && selectedSeat?.col === col;

    if (isBooked) {
      return 'w-6 h-6 rounded-md font-bold text-xs transition-all bg-red-500 opacity-60 text-white cursor-not-allowed';
    }

    if (isSelected) {
      return 'w-6 h-6 rounded-md font-bold text-xs transition-all bg-blue-600 text-white shadow-lg transform scale-110 cursor-pointer';
    }

    return 'w-6 h-6 rounded-md font-bold text-xs transition-all bg-green-500 text-white shadow-sm hover:shadow-md cursor-pointer';
  };

  /* ----------  FORM HANDLERS  ---------- */
  const handleInputChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, screenshot: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async () => {
    const requiredFieldsCheck = ['name', 'email', 'phone', 'utrId', 'screenshot'].filter(
      (field) => !formData[field]?.toString().trim()
    );
    let missing = requiredFieldsCheck.length > 0 ? requiredFieldsCheck : [];
    if (hasSeating && !selectedSeat) {
      missing.push('seat selection');
    }

    if (missing.length) {
      toast.error(`All fields ${hasSeating ? '+ seat selection' : ''} are required`);
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Invalid email');
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('title', eventData.title);
    fd.append('name', formData.name.trim());
    fd.append('registrationNumber', formData.registrationNumber.trim() || '');
    fd.append('email', formData.email.trim().toLowerCase());
    fd.append('phone', formData.phone.trim());
    fd.append('utrId', formData.utrId.trim());
    fd.append('screenshot', formData.screenshot);
    if (hasSeating && selectedSeat) {
      fd.append('seatRow', selectedSeat.row);
      fd.append('seatColumn', String(selectedSeat.col));
    }

    try {
      const r = await fetch(`${API_BASE}/standup/register`, {
        method: 'POST',
        body: fd,
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Registration failed');

      toast.success(
        `Registration successful! Seat ${selectedSeat?.row}${selectedSeat?.col} confirmed.`
      );

      setFormData({
        name: '',
        registrationNumber: '',
        email: '',
        phone: '',
        utrId: '',
        screenshot: null,
      });
      setSelectedSeat(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      fetchBookedSeats();
    } catch (e) {
      toast.error(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.4)), url(${eventData.bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Banner Section */}
          <div className="lg:flex-1 flex-shrink-0">
            <div className="relative">
              {/* Mobile Banner: full poster visible, blurred sides */}
              <div className="block lg:hidden">
                <div className="relative h-96 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Blurred background fill */}
                  <div
                    className="absolute inset-0 scale-110 blur-md"
                    style={{
                      backgroundImage: `url(${eventData.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Actual poster fully visible */}
                  <div className="relative h-full flex items-center justify-center px-4">
                    <img
                      src={eventData.bgImage}
                      alt={eventData.title}
                      className="h-full w-auto object-contain rounded-2xl"
                    />
                  </div>
                </div>
                
              </div>

              {/* Desktop Banner */}
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
            <div className="flex justify-center -mt-8 lg:-mt-4">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-8 py-3 rounded-full shadow-xl">
                  <span className="text-base font-bold text-white">PREMIUM SEATING • LIMITED AVAILABILITY</span>
                </div>
              </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 md:p-10">
                {/* SEAT SELECTION */}
                {hasSeating && (
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
                        touchAction: 'none',
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
                          {/* FIRST FLOOR BLOCK */}
                          <div className="mb-10">
                            <div className="text-center font-bold text-xl text-orange-700 mb-4 bg-orange-50 py-2 rounded-lg">
                              FIRST FLOOR ₹549
                            </div>
                            <div className="flex justify-center">
                              <div>{firstFloorRows.map(renderRow)}</div>
                            </div>
                          </div>
                          {/* BACK BLOCK */}
                          <div className="mb-10">
                            <div className="text-center font-bold text-xl text-red-700 mb-4 bg-red-50 py-2 rounded-lg">
                              BACK SEATS ₹399
                            </div>
                            <div className="flex justify-center">
                              <div>{backRows.map(renderRow)}</div>
                            </div>
                          </div>
                          {/* NORMAL BLOCK */}
                          <div className="mb-10">
                            <div className="text-center font-bold text-xl text-gray-700 mb-4 bg-gray-50 py-2 rounded-lg">
                              NORMAL SEATS ₹549
                            </div>
                            <div className="flex justify-center">
                              <div>{normalRows.map(renderRow)}</div>
                            </div>
                          </div>
                          {/* FRONT PREMIUM BLOCK */}
                          <div className="mb-10">
                            <div className="text-center font-bold text-xl text-indigo-700 mb-4 bg-indigo-50 py-2 rounded-lg">
                              FRONT PREMIUM ₹699
                            </div>
                            <div className="flex justify-center">
                              <div>{frontRows.map(renderRow)}</div>
                            </div>
                          </div>
                          {/* STAGE */}
                          <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-2xl w-full max-w-4xl h-16 flex items-center justify-center text-base font-bold text-white shadow-xl">
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
                            {selectedSeat.row}
                            {selectedSeat.col}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">Selected Seat</div>
                            <div className="text-green-600 font-bold text-xl">
                              ₹{getPrice(selectedSeat.row)}
                            </div>
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
                )}

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
                      onChange={handleInputChangeForm}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChangeForm}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter registration number (optional)"
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
                      onChange={handleInputChangeForm}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChangeForm}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="e.g. +91 9876543210"
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
                      onChange={handleInputChangeForm}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter UTR transaction ID"
                    />
                  </div>
                </div>

                {/* QR CODE */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Scan QR Code for Payment
                  </h3>
                  <p className="text-2xl font-bold text-green-600 mb-4">
                    Amount to Pay: ₹{currentPrice}
                  </p>
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
                  By submitting this form, I confirm that the information provided is accurate and
                  payment has been completed.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (hasSeating && !selectedSeat)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default StandupRegistration;
