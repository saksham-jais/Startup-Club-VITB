// src/components/StandupRegistration.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://nonphonetical-renae-tanked.ngrok-free.dev';

function StandupRegistration({ title = 'Comedy Standup Night' }) {
  const qrCode = "/qr.jpg";
  
  // --- RESPONSIVE BANNER URLS ---
  const desktopBanner = 'https://res.cloudinary.com/dt83ijcjr/image/upload/v1763540574/event-registrations/standup/spvcn3o6uepxxqdautpp.jpg';
  const mobileBanner = 'https://res.cloudinary.com/dt83ijcjr/image/upload/v1763544172/event-registrations/standup/zkn1whqjmofjvm3cjgpi.jpg'; // Mobile-specific banner

  const [eventData] = useState({
    title,
    bgImage: desktopBanner
  });
  const [hasSeating] = useState(true);

  const [formData, setFormData] = useState({
    name: '', 
    registrationNumber: '', // Compulsory Field
    email: '', 
    phone: '', 
    utrId: '', 
    screenshot: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  /* -------------------- ZOOM & PAN -------------------- */
  const [zoom, setZoom] = useState(() => (window.innerWidth < 768 ? 0.4 : 0.6));
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [baseZoomForPinch, setBaseZoomForPinch] = useState(1);

  const zoomStep = 0.15;
  const minZoom = 0.4;
  const maxZoom = 2.5;

  const getDistance = (touches) => {
    const [t1, t2] = touches;
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + zoomStep, maxZoom));
  const handleZoomOut = () => setZoom(z => Math.max(z - zoomStep, minZoom));
  const handleWheel = (e) => { e.preventDefault(); setZoom(z => Math.max(minZoom, Math.min(maxZoom, z - e.deltaY * 0.001))); };
  const handleMouseDown = (e) => { if (e.target.tagName === 'BUTTON') return; setIsDragging(true); setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }); };
  const handleMouseMove = (e) => { if (!isDragging) return; setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    const touches = e.touches;
    if (touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: touches[0].clientX - panOffset.x, y: touches[0].clientY - panOffset.y });
    } else if (touches.length === 2) {
      setInitialPinchDistance(getDistance(touches));
      setBaseZoomForPinch(zoom);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    const touches = e.touches;
    if (touches.length === 1 && isDragging) {
      setPanOffset({ x: touches[0].clientX - dragStart.x, y: touches[0].clientY - dragStart.y });
    } else if (touches.length === 2 && initialPinchDistance > 0) {
      const scale = getDistance(touches) / initialPinchDistance;
      setZoom(Math.max(minZoom, Math.min(maxZoom, baseZoomForPinch * scale)));
    }
  };

  const handleTouchEnd = () => { setInitialPinchDistance(0); setIsDragging(false); };
  const resetView = () => { setZoom(window.innerWidth < 768 ? 0.4 : 0.6); setPanOffset({ x: 0, y: 0 }); };

  /* -------------------- FETCH BOOKED SEATS -------------------- */
  useEffect(() => {
    const loadSeats = async () => {
      try {
        const res = await fetch(`${API_BASE}/standup/booked/${encodeURIComponent(eventData.title)}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });

        if (!res.ok) throw new Error('Failed to load seats');

        const data = await res.json();
        const seatSet = new Set();
        data.forEach(seat => {
          if (seat.row && seat.col) seatSet.add(`${seat.row}-${seat.col}`);
        });
        setBookedSeats(seatSet);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load seats. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSeats();
  }, [eventData.title]);

  /* -------------------- PRICE LOGIC -------------------- */
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

  /* -------------------- SEAT HANDLERS -------------------- */
  const handleSeatClick = (row, col) => {
    if (!hasSeating || bookedSeats.has(`${row}-${col}`)) return;
    setSelectedSeat({ row, col });
  };

  const getSeatClass = (row, col) => {
    const key = `${row}-${col}`;
    const booked = bookedSeats.has(key);
    const selected = selectedSeat?.row === row && selectedSeat?.col === col;

    if (booked) return 'w-10 h-10 rounded-xl text-sm font-bold text-white bg-red-600 opacity-70 cursor-not-allowed';
    if (selected) return 'w-10 h-10 rounded-xl text-sm font-bold text-white bg-blue-600 scale-125 shadow-2xl ring-4 ring-blue-400 z-10';
    return 'w-10 h-10 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 hover:scale-110 shadow-lg cursor-pointer transition-all duration-200';
  };

  const renderRow = (row) => (
    <div key={row} className="flex items-center gap-4 my-4">
      <span className="w-12 text-center font-bold text-gray-800 text-lg">{row}</span>
      <div className="flex gap-3">
        {Array.from({ length: 15 }, (_, i) => i + 1).map(col => (
          <button
            key={`${row}-${col}`}
            onClick={() => handleSeatClick(row, col)}
            disabled={bookedSeats.has(`${row}-${col}`)}
            className={getSeatClass(row, col)}
          >
            {col}
          </button>
        ))}
        </div>
    </div>
  );

  /* -------------------- FORM HANDLERS -------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, screenshot: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async () => {
    // registrationNumber is now required
    const required = ['name', 'registrationNumber', 'email', 'phone', 'utrId', 'screenshot'];
    const missing = required.filter(f => !formData[f]?.toString().trim());
    if (hasSeating && !selectedSeat) missing.push('seat');

    if (missing.length) {
      toast.error('Please fill all required fields and select a seat');
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
    // Send registration number as compulsory
    fd.append('registrationNumber', formData.registrationNumber.trim()); 
    fd.append('email', formData.email.trim().toLowerCase());
    fd.append('phone', formData.phone.trim());
    fd.append('utrId', formData.utrId.trim());
    fd.append('screenshot', formData.screenshot);
    if (hasSeating && selectedSeat) {
      fd.append('seatRow', selectedSeat.row);
      fd.append('seatColumn', String(selectedSeat.col));
    }

    fetch(`${API_BASE}/standup/register`, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: fd,
    })
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Registration failed');
        toast.success(`Successfully Booked! Seat ${selectedSeat.row}${selectedSeat.col}`);
        setBookedSeats(prev => new Set(prev).add(`${selectedSeat.row}-${selectedSeat.col}`));
        setSelectedSeat(null);
        setFormData({ name: '', registrationNumber: '', email: '', phone: '', utrId: '', screenshot: null });
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      })
      .catch(e => toast.error(e.message || 'Submission failed'))
      .finally(() => setIsSubmitting(false));
  };

  /* -------------------- LOADING STATE -------------------- */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-8 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-medium text-gray-700">Loading seats...</p>
      </div>
    );
  }

  /* -------------------- MAIN RENDER -------------------- */
  return (
    <>
      {/* ====================== HERO BANNER (MOBILE/DESKTOP SWITCH) ====================== */}
      <section className="relative w-full overflow-hidden">
        {/* Dark Overlay (Reduced opacity for better image visibility) */}
        <div className="absolute inset-0 z-10" />

        {/* Background Image Container */}
        <div className="relative w-full">
          {/* DESKTOP BANNER (Hidden on small screens) */}
          <img
            src={desktopBanner}
            alt={title + " Desktop Banner"}
            className="w-full h-auto object-cover block opacity-0 transition-opacity duration-1000 hidden md:block"
            style={{ minHeight: '60vh' }}
            onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
          />

          {/* MOBILE BANNER (Hidden on medium/large screens) */}
          <img
            src={mobileBanner}
            alt={title + " Mobile Banner"}
            className="w-full h-auto object-cover block opacity-0 transition-opacity duration-1000 md:hidden"
            style={{ minHeight: '40vh' }}
            onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
          />
        </div>

        {/* MODIFIED BANNER CHIP POSITIONING (Overlapping effect) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30">
          {/* Adjusted mobile padding for the chip: px-4 py-2 text-xl on mobile */}
          <div className="bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 px-4 py-2 md:px-10 md:py-5 rounded-full shadow-2xl animate-pulse transform translate-y-1/2">
            <span className="text-xl md:text-3xl font-bold text-white tracking-wider">
              LIMITED PREMIUM SEATS
            </span>
          </div>
        </div>
      </section>

      {/* ====================== MAIN CONTENT (Fixed Overlap by adding responsive padding) ====================== */}
      <section className="w-full bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 py-10 lg:py-16"> {/* Reduced overall vertical padding on mobile */}
        {/* Adjusted top padding: pt-24 on mobile, pt-32 on desktop */}
        <div className="max-w-7xl mx-auto px-6"> 
          
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12">

            {/* [ORDER 1: SEAT MAP on MOBILE, LEFT on DESKTOP] */}
            <div className="order-1 lg:order-1">
              <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Choose Your Seat</h2>

              <div className="flex justify-center gap-4 mb-6 text-base flex-wrap"> {/* Reduced gap and text size for mobile */}
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-500 rounded-lg"></div> Available</div> {/* Reduced chip size */}
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-600 rounded-lg"></div> Selected</div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-600 opacity-70 rounded-lg"></div> Booked</div>
              </div>

              <div className="flex justify-center gap-4 mb-10 flex-wrap">
                <button onClick={handleZoomOut} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-medium">Zoom Out</button> {/* Reduced button size */}
                <button onClick={resetView} className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold">Reset View</button>
                <button onClick={handleZoomIn} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-medium">Zoom In</button>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl border-4 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl"
                style={{ height: '680px', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
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
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  }}
                >
                  <div className="space-y-14 p-12">
                    <div className="text-center">
                      <div className="inline-block px-10 py-3 bg-orange-100 text-orange-700 font-bold rounded-xl mb-4 text-xl">FIRST FLOOR ₹549</div>
                      {firstFloorRows.map(renderRow)}
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-10 py-3 bg-red-100 text-red-700 font-bold rounded-xl mb-4 text-xl">BACK ₹399</div>
                      {backRows.map(renderRow)}
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-10 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl mb-4 text-xl">NORMAL ₹549</div>
                      {normalRows.map(renderRow)}
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-10 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl mb-4 text-xl">FRONT PREMIUM ₹699</div>
                      {frontRows.map(renderRow)}
                    </div>
                    <div className="flex justify-center pt-12">
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-32 py-12 rounded-t-3xl text-4xl font-bold text-white shadow-2xl">
                        STAGE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSeat && (
                <div className="mt-8 p-6 md:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-4 border-emerald-300 shadow-2xl text-center"> {/* Reduced padding and margin on mobile */}
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">{selectedSeat.row}{selectedSeat.col}</div>
                  <div className="text-3xl md:text-4xl font-bold text-green-600">₹{getPrice(selectedSeat.row)}</div>
                  <button onClick={() => setSelectedSeat(null)} className="mt-4 px-6 py-2 text-base bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-all">
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            {/* [ORDER 2: FORM on MOBILE, RIGHT on DESKTOP] */}
            <div className="order-2 lg:order-2">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-purple-200">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-gray-800">Complete Your Booking</h2> {/* Reduced margin on mobile */}

                <div className="space-y-4 md:space-y-6"> {/* Reduced space on mobile */}
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" 
                         className="w-full px-4 py-3 md:px-5 md:py-4 border-2 border-gray-300 rounded-lg text-base md:text-lg placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm" required />
                    
                    {/* Registration Number is now required */}
                  <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="Registration Number *" 
                         className="w-full px-4 py-3 md:px-5 md:py-4 border-2 border-gray-300 rounded-lg text-base md:text-lg placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm" required />

                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address *" 
                         className="w-full px-4 py-3 md:px-5 md:py-4 border-2 border-gray-300 rounded-lg text-base md:text-lg placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm" required />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number *" 
                         className="w-full px-4 py-3 md:px-5 md:py-4 border-2 border-gray-300 rounded-lg text-base md:text-lg placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm" required />
                  <input type="text" name="utrId" value={formData.utrId} onChange={handleInputChange} placeholder="UTR / Transaction ID *" 
                         className="w-full px-4 py-3 md:px-5 md:py-4 border-2 border-gray-300 rounded-lg text-base md:text-lg placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm" required />
                </div>

                {/* Reduced padding and margin */}
                <div className="mt-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 md:p-8 text-center border border-pink-200 shadow-inner">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-700 mb-4 md:mb-6">Scan & Pay Securely</h3>
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-6 md:mb-8 p-2 bg-white rounded-xl inline-block shadow-md">₹{currentPrice || 'Select a seat'}</div>
                  <img src={qrCode} alt="Payment QR" className="w-56 h-56 md:w-80 md:h-80 mx-auto rounded-xl shadow-2xl border-4 border-white" /> {/* Reduced QR size on mobile */}

                  {/* ADDED BANK DETAILS */}
                  <div className="mt-4 md:mt-6 text-left inline-block p-4 bg-white/70 rounded-lg shadow-inner border border-pink-300">
                    <p className="text-base md:text-lg font-bold text-gray-800">Bank Transfer Details:</p>
                    <p className="text-sm md:text-md text-gray-700 mt-1">
                      <span className="font-semibold">Bank:</span> INDIAN BANK, VIT, BHOPAL
                    </p>
                    <p className="text-sm md:text-md text-gray-700">
                      <span className="font-semibold">Account Number:</span> 8093736714
                    </p>
                    <p className="text-sm md:text-md text-gray-700">
                      <span className="font-semibold">IFSC Code:</span> IDIB000V143
                    </p>
                  </div>
                </div>

                {/* Reduced margin */}
                <div className="mt-8"> 
                  <label className="block text-lg md:text-xl font-bold mb-3 text-gray-700">Upload Payment Screenshot *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white file:font-semibold file:text-sm md:file:text-base hover:file:from-indigo-700 hover:file:to-purple-700 file:cursor-pointer transition duration-300 border-2 border-gray-300 rounded-xl p-2"
                  />
                  {formData.screenshot && (
                    <p className="mt-3 text-green-600 font-bold text-base">Selected: {formData.screenshot.name}</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (hasSeating && !selectedSeat)}
                  className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-extrabold text-xl md:text-2xl py-4 md:py-5 rounded-xl shadow-xl transition-all hover:scale-[1.02] disabled:cursor-not-allowed tracking-wider"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm & Book My Seat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
    </>
  );
}

export default StandupRegistration;