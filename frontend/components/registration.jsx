// components/RegistrationForm.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SeatMap from './SeatMap';

const API_BASE = 'http://localhost:5000'
// const API_BASE = 'https://startup-club-dczt.onrender.com'

export default function RegistrationForm({ eventTitle, qrCode, price, hasSeating }) {
  const [formData, setFormData] = useState({ name: '', registrationNumber: '', email: '', utrId: '', screenshot: null });
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasSeating) {
      fetch(`${API_BASE}/registration/booked/${encodeURIComponent(eventTitle)}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          const set = new Set();
          data.forEach(s => set.add(`${s.row}-${s.col}`));
          setBookedSeats(set);
        })
        .catch(() => toast.error('Failed to load seats'));
    }
  }, [eventTitle, hasSeating]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.utrId || !formData.screenshot || (hasSeating && !selectedSeat)) {
      toast.error('Please fill all fields and select a seat');
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('title', eventTitle);
    fd.append('name', formData.name);
    fd.append('registrationNumber', formData.registrationNumber);
    fd.append('email', formData.email);
    fd.append('utrId', formData.utrId);
    fd.append('screenshot', formData.screenshot);
    if (hasSeating && selectedSeat) {
      fd.append('seatRow', selectedSeat.row);
      fd.append('seatColumn', selectedSeat.col);
    }

    try {
      const r = await fetch(`${API_BASE}/registration/submit`, { method: 'POST', body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');
      toast.success('Registered Successfully!');
      setFormData({ name: '', registrationNumber: '', email: '', utrId: '', screenshot: null });
      setSelectedSeat(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-indigo-800 mb-4">{eventTitle}</h1>
        <div className="text-center mb-10">
          <span className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xl font-bold">
            {hasSeating ? 'SEATED EVENT' : 'GENERAL ADMISSION'}
          </span>
        </div>

        {hasSeating && <SeatMap selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} bookedSeats={bookedSeats} />}

        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <input placeholder="Full Name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="p-4 border-2 rounded-xl" />
            <input placeholder="Registration Number" value={formData.registrationNumber} onChange={e => setFormData(p => ({...p, registrationNumber: e.target.value}))} className="p-4 border-2 rounded-xl" />
            <input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="p-4 border-2 rounded-xl" />
            <input placeholder="UTR ID" value={formData.utrId} onChange={e => setFormData(p => ({...p, utrId: e.target.value}))} className="p-4 border-2 rounded-xl" />
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Pay ₹{price}</h3>
            <img src={qrCode} alt="QR" className="w-64 h-64 mx-auto rounded-2xl shadow-2xl" />
          </div>

          <input type="file" accept="image/*" onChange={e => setFormData(p => ({...p, screenshot: e.target.files[0]}))} className="w-full p-4 border-2 rounded-xl mb-8" />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 rounded-2xl shadow-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}