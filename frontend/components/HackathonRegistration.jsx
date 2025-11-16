// src/components/HackathonRegistration.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000'||'https://startup-club-dczt.onrender.com';
// const API_BASE = 'https://startup-club-dczt.onrender.com';

const HackathonRegistration = () => {
  const eventTitle = "National Hackathon 2025";
  const basePrice = 80;
  const bgImage = "https://res.cloudinary.com/dt83ijcjr/image/upload/v1763290379/event-registrations/memewar/memes/WhatsApp_Image_2025-11-16_at_4.18.35_PM_griimo.jpg";

  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({ name: '', regNo: '', email: '' });
  const [utrId, setUtrId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [extraMembers, setExtraMembers] = useState([]); // Dynamic members
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price
  const totalMembers = 1 + extraMembers.length;
  const totalPrice = basePrice * totalMembers;

  const addMember = () => {
    if (extraMembers.length >= 5) {
      toast.warn("Maximum 5 additional members allowed (Total 6)");
      return;
    }
    setExtraMembers([...extraMembers, { name: '', registrationNumber: '' }]);
  };

  const removeMember = (index) => {
    setExtraMembers(extraMembers.filter((_, i) => i !== index));
  };

  const updateMember = (index, field, value) => {
    const updated = [...extraMembers];
    updated[index][field] = value;
    setExtraMembers(updated);
  };

  const handleSubmit = async () => {
    // Validation
    if (!teamName.trim()) return toast.error('Team name is required');
    if (!leader.name.trim()) return toast.error('Leader name is required');
    if (!leader.regNo.trim()) return toast.error('Leader registration number is required');
    if (!leader.email.trim()) return toast.error('Leader email is required');
    if (!utrId.trim()) return toast.error('UTR ID is required');
    if (!screenshot) return toast.error('Payment screenshot is required');

    // Validate extra members
    for (let i = 0; i < extraMembers.length; i++) {
      const m = extraMembers[i];
      if (!m.name.trim() || !m.registrationNumber.trim()) {
        return toast.error(`Member ${i + 2}: Both name and registration number are required`);
      }
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', eventTitle);
    formData.append('teamName', teamName.trim());
    formData.append('leaderName', leader.name.trim());
    formData.append('leaderRegNo', leader.regNo.trim());
    formData.append('email', leader.email.trim());
    formData.append('utrId', utrId.trim());
    formData.append('screenshot', screenshot);
    formData.append('members', JSON.stringify(extraMembers.map(m => ({
      name: m.name.trim(),
      registrationNumber: m.registrationNumber.trim()
    }))));

    try {
      const res = await fetch(`${API_BASE}/hackathon/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      toast.success(`Team "${teamName}" registered successfully! Total: ₹${totalPrice}`);
      
      // Reset
      setTeamName('');
      setLeader({ name: '', regNo: '', email: '' });
      setUtrId('');
      setScreenshot(null);
      setExtraMembers([]);
      document.getElementById('screenshot').value = '';

    } catch (err) {
      toast.error(err.message);
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
        {/* Banner */}
        <div className="relative mb-8">
          <div className="h-64 md:h-80 rounded-3xl shadow-2xl overflow-hidden" style={bannerStyle}>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-2xl mb-4">
                National Hackathon 2025
              </h1>
            </div>
          </div>
          <div className="flex justify-center -mt-8">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-8 py-3 rounded-full shadow-xl">
              <span className="text-base font-bold text-white">NORMAL EVENT REGISTRATION</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10">

          {/* Team Name */}
          <div className="mb-8">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name *"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            />
          </div>

          {/* Leader Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <input placeholder="Team Leader Name *" value={leader.name} onChange={(e) => setLeader({ ...leader, name: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            <input placeholder="Leader Registration No. *" value={leader.regNo} onChange={(e) => setLeader({ ...leader, regNo: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            <input placeholder="Team Email *" value={leader.email} onChange={(e) => setLeader({ ...leader, email: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            <input placeholder="UTR ID *" value={utrId} onChange={(e) => setUtrId(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Dynamic Members */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Additional Team Members ({extraMembers.length}/5)</h3>
              <button
                onClick={addMember}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
              >
                + Add Member
              </button>
            </div>

            {extraMembers.map((member, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  placeholder={`Member ${i + 2} Name`}
                  value={member.name}
                  onChange={(e) => updateMember(i, 'name', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <input
                    placeholder={`Member ${i + 2} Registration No.`}
                    value={member.registrationNumber}
                    onChange={(e) => updateMember(i, 'registrationNumber', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => removeMember(i)}
                    className="text-red-600 hover:text-red-800 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Scan QR Code for Payment</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              Total Amount: ₹{totalPrice}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              ₹80 × {totalMembers} member{totalMembers > 1 ? 's' : ''}
            </p>
            <img src="/qr.jpg" alt="QR" className="w-56 h-56 mx-auto border-4 border-white rounded-2xl shadow-2xl" />
          </div>

          {/* Screenshot */}
          <div className="mb-8">
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {/* Submit */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : `Pay ₹${totalPrice} & Register Team`}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </div>
  );
};

export default HackathonRegistration;