// src/components/IdeathonRegistration.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000';
// const API_BASE = 'https://startup-club-dczt.onrender.com';

const IdeathonRegistration = () => {
  const eventTitle = "Ideathon 2025";
  const basePrice = 299;
  const bgImage = "https://images.unsplash.com/photo-1559136555-9303b3202038?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({ name: '', regNo: '', email: '' });
  const [utrId, setUtrId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [extraMembers, setExtraMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Pricing
  const totalMembers = 1 + extraMembers.length;
  const totalPrice = basePrice * totalMembers;

  const addMember = () => {
    if (extraMembers.length >= 5) {
      toast.warn("Maximum 5 additional members (Total 6)");
      return;
    }
    setExtraMembers([...extraMembers, { name: '', registrationNumber: '' }]);
  };

  const removeMember = (i) => {
    setExtraMembers(extraMembers.filter((_, index) => index !== i));
  };

  const updateMember = (i, field, value) => {
    const updated = [...extraMembers];
    updated[i][field] = value;
    setExtraMembers(updated);
  };

  const handleSubmit = async () => {
    // Validation
    if (!teamName.trim()) return toast.error("Team name is required");
    if (!leader.name.trim()) return toast.error("Leader name is required");
    if (!leader.regNo.trim()) return toast.error("Leader registration number is required");
    if (!leader.email.trim() || !leader.email.includes('@')) return toast.error("Valid email is required");
    if (!utrId.trim()) return toast.error("UTR ID is required");
    if (!screenshot) return toast.error("Payment screenshot is required");
    if (!submissionFile) return toast.error("PPT/PDF submission is required");

    // Validate extra members
    for (let i = 0; i < extraMembers.length; i++) {
      const m = extraMembers[i];
      if (!m.name.trim() || !m.registrationNumber.trim()) {
        return toast.error(`Member ${i + 2}: Name & Registration No. required`);
      }
    }

    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('title', eventTitle);
    fd.append('teamName', teamName.trim());
    fd.append('leaderName', leader.name.trim());
    fd.append('leaderRegNo', leader.regNo.trim());
    fd.append('email', leader.email.trim());
    fd.append('utrId', utrId.trim());
    fd.append('screenshot', screenshot);
    fd.append('submissionFile', submissionFile);
    fd.append('members', JSON.stringify(extraMembers.map(m => ({
      name: m.name.trim(),
      registrationNumber: m.registrationNumber.trim()
    }))));

    try {
      const r = await fetch(`${API_BASE}/ideathon/register`, {
        method: 'POST',
        body: fd,
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Registration failed");

      toast.success(`Ideathon team registered! Paid ₹${totalPrice} for ${totalMembers} members`);
      
      // Reset form
      setTeamName('');
      setLeader({ name: '', regNo: '', email: '' });
      setUtrId('');
      setScreenshot(null);
      setSubmissionFile(null);
      setExtraMembers([]);
      document.querySelectorAll('input[type="file"]').forEach(el => el.value = '');

    } catch (e) {
      toast.error(e.message || "Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        <div className="relative mb-8">
          <div className="h-64 md:h-80 rounded-3xl shadow-2xl overflow-hidden relative" style={bannerStyle}>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-2xl mb-4">
                Ideathon 2025
              </h1>
            </div>
          </div>
          <div className="flex justify-center -mt-8">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform z-10">
              <span className="text-base font-bold text-white">NORMAL EVENT REGISTRATION</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10">

            {/* Team Name */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-700 mb-2">Team Name <span className="text-red-500">*</span></label>
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. IdeaStorm" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>

            {/* Leader Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Team Leader Name <span className="text-red-500">*</span></label>
                <input value={leader.name} onChange={(e) => setLeader({ ...leader, name: e.target.value })} placeholder="Enter team leader name" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Leader Registration Number <span className="text-red-500">*</span></label>
                <input value={leader.regNo} onChange={(e) => setLeader({ ...leader, regNo: e.target.value })} placeholder="e.g. 22BCS123" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Team Email <span className="text-red-500">*</span></label>
                <input type="email" value={leader.email} onChange={(e) => setLeader({ ...leader, email: e.target.value })} placeholder="team@example.com" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">UTR ID <span className="text-red-500">*</span></label>
                <input value={utrId} onChange={(e) => setUtrId(e.target.value)} placeholder="Enter UTR transaction ID" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
            </div>

            {/* Dynamic Team Members */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Additional Members ({extraMembers.length}/5)</h3>
                <button onClick={addMember} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:from-blue-600 hover:to-indigo-700 transition">
                  + Add Member
                </button>
              </div>
              {extraMembers.map((m, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl border">
                  <input placeholder={`Member ${i + 2} Name`} value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <div className="flex gap-2">
                    <input placeholder="Reg No." value={m.registrationNumber} onChange={(e) => updateMember(i, 'registrationNumber', e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <button onClick={() => removeMember(i)} className="text-red-600 hover:text-red-800 font-bold text-xl">×</button>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Scan QR Code for Payment</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">Total: ₹{totalPrice}</p>
              <p className="text-lg text-gray-700 mb-6">₹299 × {totalMembers} member{totalMembers > 1 ? 's' : ''}</p>
              <div className="flex justify-center mb-4">
                <img src="/qr.jpg" alt="Payment QR" className="w-56 h-56 border-4 border-white rounded-2xl shadow-2xl" />
              </div>
              <p className="text-sm text-gray-600">Scan and pay before submitting</p>
            </div>

            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Payment Screenshot <span className="text-red-500">*</span></label>
                <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
                {screenshot && <p className="text-sm text-green-600 mt-2">Selected: {screenshot.name}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Upload PPT/PDF <span className="text-red-500">*</span></label>
                <input type="file" accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={(e) => setSubmissionFile(e.target.files[0])} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600" />
                {submissionFile && <p className="text-sm text-purple-600 mt-2">Selected: {submissionFile.name}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 md:px-10 py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Confirmation</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              By submitting this form, I confirm that the information provided is accurate and payment has been completed.
            </p>
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-300 shadow-lg text-lg disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : `Pay ₹${totalPrice} & Submit Registration`}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </div>
  );
};

export default IdeathonRegistration;