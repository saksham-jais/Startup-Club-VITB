import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000' || 'https://startup-club-dczt.onrender.com';

function StandupRegistration({ title = 'Comedy Standup Night' }) {
  const qrCode = "/qr.jpg";
  const desktopBanner = 'https://res.cloudinary.com/dt83ijcjr/image/upload/v1763647548/2_vjtukv.png';
  const mobileBanner = 'https://res.cloudinary.com/dt83ijcjr/image/upload/v1763635145/event-registrations/standup/bt8pduu30mbfvz0r9ffi.png';

  const [members, setMembers] = useState([
    { id: 1, name: '', regNo: '', email: '', phone: '', utrId: '', category: 'normal' }
  ]);
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing
  const PRICE_FRONT_SINGLE = 549;
  const PRICE_FRONT_OFFER = 998;
  const PRICE_NORMAL = 399;

  const calculateTotal = () => {
    const frontCount = members.filter(m => m.category === 'front').length;
    if (members.length === 2 && frontCount === 2) return PRICE_FRONT_OFFER;
    return frontCount * PRICE_FRONT_SINGLE + (members.length - frontCount) * PRICE_NORMAL;
  };

  const totalPrice = calculateTotal();
  const isOfferApplied = members.length === 2 && members.every(m => m.category === 'front');

  const addMember = () => {
    if (members.length >= 2) return toast.warn('Maximum 2 members allowed');
    if (members[0].category !== 'front') return toast.error('Select Front Row for Member 1 to unlock ₹998 Duo Offer!');
    setMembers([...members, { id: Date.now(), name: '', regNo: '', email: '', phone: '', utrId: '', category: 'front' }]);
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    toast.info('2nd member removed');
  };

  const updateMember = (id, field, value) => {
    setMembers(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, [field]: value } : m);
      if (updated[0].category === 'normal' && updated.length > 1) {
        toast.warn('Normal row selected → 2nd member removed! Duo offer only for 2 Front Rows.');
        return [updated[0]];
      }
      return updated;
    });
  };

  const handleFileChange = (e) => setScreenshot(e.target.files?.[0] ?? null);

  const isValidVitEmail = (email) => email.trim().toLowerCase().endsWith('@vitbhopal.ac.in');

  const validateForm = () => {
    return members.every(m =>
      m.name.trim() &&
      m.regNo.trim() &&
      m.email.trim() && isValidVitEmail(m.email) &&
      m.phone.trim().length === 10 && /^\d{10}$/.test(m.phone.trim()) &&
      m.utrId.trim().length >= 12 && /^[a-zA-Z0-9]+$/.test(m.utrId.trim()) // ← ALPHANUMERIC + MIN 12
    ) && screenshot !== null;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Fix errors: VIT email, 10-digit phone, UTR min 12 chars (letters & numbers only)');
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('totalAmount', totalPrice);
    fd.append('memberCount', members.length);
    fd.append('offerApplied', isOfferApplied);
    fd.append('screenshot', screenshot);

    members.forEach((m, i) => {
      fd.append(`members[${i}][name]`, m.name.trim());
      fd.append(`members[${i}][registrationNumber]`, m.regNo.trim());
      fd.append(`members[${i}][email]`, m.email.trim().toLowerCase());
      fd.append(`members[${i}][phone]`, m.phone.trim());
      fd.append(`members[${i}][utrId]`, m.utrId.trim());
      fd.append(`members[${i}][category]`, m.category);
    });

try {
  const r = await fetch(`${API_BASE}/standup/register`, {
    method: 'POST',
    headers: { 'ngrok-skip-browser-warning': 'true' },
    body: fd,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Registration failed');

  toast.success(isOfferApplied
    ? 'OFFER APPLIED! 2 Front Row Seats Booked → Only ₹998!'
    : `Registered ${members.length} member(s) → ₹${totalPrice}`
  );

  // Reset form – FIXED LINE
  setMembers([{ id: Date.now(), name: '', regNo: '', email: '', phone: '', utrId: '', category: 'normal' }]);
  setScreenshot(null);
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';

} catch (e) {
  toast.error(e.message || 'Registration failed. Try again.');
} finally {
  setIsSubmitting(false);
}
  };

  return (
    <>
      {/* Banner */}
      <section className="relative w-full">
        <img src={desktopBanner} alt="Banner" className="w-full h-auto hidden md:block opacity-0 transition-opacity duration-1000" style={{ minHeight: '60vh' }} onLoad={e => e.target.classList.replace('opacity-0', 'opacity-100')} />
        <img src={mobileBanner} alt="Banner" className="w-full h-auto md:hidden opacity-0 transition-opacity duration-1000" style={{ minHeight: '40vh' }} onLoad={e => e.target.classList.replace('opacity-0', 'opacity-100')} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-[999]">
          <div className="bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 px-6 py-4 rounded-full shadow-2xl translate-y-1/2">
            <span className="text-xl md:text-2xl font-bold text-white">2 FRONT ROWS = ONLY ₹998!</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 text-gray-800">Group Registration – Best Deal!</h2>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Member Forms */}
            <div className="space-y-6">
              {members.map((member, idx) => (
                <div key={member.id} className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-purple-200 relative">
                  {members.length > 1 && (
                    <button onClick={() => removeMember(member.id)} className="absolute top-4 right-4 text-red-600 text-3xl font-bold hover:scale-125">×</button>
                  )}
                  <h4 className="text-2xl font-bold text-indigo-600 mb-6">Member {idx + 1}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name *" value={member.name} onChange={e => updateMember(member.id, 'name', e.target.value)}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />

                    <input type="text" placeholder="Registration No *" value={member.regNo} onChange={e => updateMember(member.id, 'regNo', e.target.value)}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />

                    <div className="sm:col-span-2">
                      <input type="email" placeholder="Email * (@vitbhopal.ac.in only)" value={member.email} onChange={e => updateMember(member.id, 'email', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-lg ${member.email && !isValidVitEmail(member.email) ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'}`} />
                      {member.email && !isValidVitEmail(member.email) && <p className="text-red-600 text-sm mt-1">Only @vitbhopal.ac.in allowed</p>}
                    </div>

                    <input type="text" placeholder="Phone * (10 digits)" value={member.phone}
                      onChange={e => updateMember(member.id, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`px-4 py-3 border-2 rounded-lg ${member.phone && member.phone.length !== 10 ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
                      maxLength={10} />
                    {member.phone && member.phone.length !== 10 && <p className="text-red-600 text-sm mt-1">Exactly 10 digits</p>}

                    {/* ALPHANUMERIC UTR */}
                    <div>
                      <input type="text" placeholder="UTR ID * (min 12 chars, letters & numbers)" value={member.utrId}
                        onChange={e => updateMember(member.id, 'utrId', e.target.value.slice(0, 30))}
                        className={`w-full px-4 py-3 border-2 rounded-lg ${member.utrId && member.utrId.length < 12 ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
                        maxLength={30} />
                      {member.utrId && member.utrId.length < 12 ? (
                        <p className="text-red-600 text-sm mt-1">Min 12 characters ({member.utrId.length}/12)</p>
                      ) : member.utrId.length >= 12 ? (
                        <p className="text-green-600 text-sm mt-1">Valid UTR</p>
                      ) : null}
                    </div>

                    {idx === 0 ? (
                      <div className="sm:col-span-2">
                        <select value={member.category} onChange={e => updateMember(member.id, 'category', e.target.value)} disabled={members.length > 1}
                          className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${members.length > 1 ? 'bg-gray-100 opacity-70' : 'focus:border-indigo-500'}`}>
                          <option value="normal">Normal Rows - ₹399</option>
                          <option value="front">Front Rows - ₹549</option>
                        </select>
                      </div>
                    ) : (
                      <div className="sm:col-span-2 text-center py-3 bg-emerald-100 border-2 border-emerald-400 rounded-lg font-bold text-emerald-800">
                        Front Rows - ₹549 (Offer Locked)
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {members.length < 2 && (
                <button onClick={addMember} disabled={members[0].category !== 'front'}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-xl disabled:opacity-50">
                  {members[0].category === 'front' ? '+ Add 2nd Member (Unlock ₹998 Offer!)' : 'Select Front Row First'}
                </button>
              )}
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-emerald-200 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold text-center mb-6">Pay Total Amount</h3>
                <div className={`text-7xl font-extrabold text-center mb-4 ${isOfferApplied ? 'text-green-600' : 'text-indigo-600'}`}>₹{totalPrice}</div>
                {isOfferApplied && <p className="text-center text-green-600 font-bold text-2xl mb-6">Duo Offer Applied!</p>}

                <div className="text-center">
                  <img src={qrCode} alt="QR Code" className="mx-auto w-80 h-80 border-8 border-white rounded-2xl shadow-2xl" />
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl text-left">
                    <p className="font-bold text-lg">Bank Details:</p>
                    <p><strong>Bank:</strong> INDIAN BANK, VIT BHOPAL</p>
                    <p><strong>A/c No:</strong> 8093736714</p>
                    <p><strong>IFSC:</strong> IDIB000V143</p>
                  </div>
                </div>

                <div className="mt-10">
                  <label className="block text-xl font-bold mb-3">Upload Screenshot *</label>
                  <input type="file" accept="image/*" onChange={handleFileChange}
                    className="w-full file:mr-4 file:py-4 file:px-8 file:rounded-xl file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white file:font-bold border-4 border-dashed border-gray-300 rounded-xl cursor-pointer" />
                  {screenshot && <p className="text-green-600 font-bold text-center mt-3">Selected: {screenshot.name}</p>}
                </div>
              </div>

              <button onClick={handleSubmit} disabled={isSubmitting || !validateForm()}
                className="mt-10 w-full py-6 text-2xl font-bold text-white rounded-xl shadow-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? 'Registering...' : `Pay ₹${totalPrice} & Register Now`}
              </button>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
    </>
  );
}

export default StandupRegistration;