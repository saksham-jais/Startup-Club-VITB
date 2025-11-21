import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'https://startup-club-dczt.onrender.com';

function StandupRegistration({ title = 'Comedy Standup Night' }) {
  const qrCode = "/qr.jpg";
  const desktopBanner = 'https://res.cloudinary.com/dt83ijcjr/image/upload/v1763731070/BANNER_1_ts1xwq.png';
  const mobileBanner = 'https://res.cloudinary.com/dt83ijcjr/image/upload/v1763729986/standup_comedy_ishant_syqqml.png';

  const [members, setMembers] = useState([
    { id: 1, name: '', regNo: '', email: '', phone: '', utrId: '', category: 'normal' }
  ]);
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const firstMemberUtr = members[0].utrId.trim();
    if (!firstMemberUtr || firstMemberUtr.length < 12) {
      toast.error('Please enter valid UTR ID for Member 1 first!');
      return;
    }

    setMembers([...members, {
      id: Date.now(),
      name: '', regNo: '', email: '', phone: '', utrId: firstMemberUtr, category: 'front'
    }]);
    toast.success('2nd Member Added! UTR ID auto-filled from Member 1');
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    toast.info('2nd member removed');
  };

  const updateMember = (id, field, value) => {
    setMembers(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, [field]: value } : m);

      if (updated[0].category === 'normal' && updated.length > 1) {
        toast.warn('Normal row selected → 2nd member removed! Duo offer only for 2 Front Seat.');
        return [updated[0]];
      }

      if (updated.length === 2 && id === updated[0].id && field === 'utrId') {
        updated[1].utrId = value;
        toast.info('UTR updated for both members');
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
      m.utrId.trim().length >= 12 && /^[a-zA-Z0-9]+$/.test(m.utrId.trim())
    ) && screenshot !== null;
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Fix all errors: VIT email, 10-digit phone, UTR ≥12 chars');
    return;
  }

  setIsSubmitting(true);
  const fd = new FormData();

  // Simple flat fields — NO NESTED BRACKETS
  fd.append('title', title);
  fd.append('totalAmount', totalPrice);
  fd.append('offerApplied', isOfferApplied);

  // Send members as flat indexed fields
  members.forEach((m, i) => {
    fd.append(`member_name_${i}`, m.name.trim());
    fd.append(`member_regNo_${i}`, m.regNo.trim());
    fd.append(`member_email_${i}`, m.email.trim().toLowerCase());
    fd.append(`member_phone_${i}`, m.phone.trim());
    fd.append(`member_utrId_${i}`, m.utrId.trim());
    fd.append(`member_category_${i}`, m.category);
  });

  fd.append('screenshot', screenshot);

  try {
    const r = await fetch(`${API_BASE}/standup/register`, {
      method: 'POST',
      body: fd, // No headers needed — FormData sets correct Content-Type
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Registration failed');

    toast.success(isOfferApplied
      ? 'OFFER APPLIED! 2 Front Row Seats → Only ₹998!'
      : `Registered ${members.length} member(s) → ₹${totalPrice}`
    );

    // Reset form
    setMembers([{ id: Date.now(), name: '', regNo: '', email: '', phone: '', utrId: '', category: 'normal' }]);
    setScreenshot(null);
    document.querySelector('input[type="file"]')?.value && (document.querySelector('input[type="file"]').value = '');

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
        <img src={desktopBanner} alt="Banner" className="w-full h-auto hidden md:block" />
        <img src={mobileBanner} alt="Banner" className="w-full h-auto md:hidden" />
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 px-8 py-4 rounded-full shadow-2xl">
            <span className="text-xl md:text-2xl font-bold text-white">2 FRONT SEAT = ONLY ₹998!</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-purple-50 to-pink-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">Group Registration – Best Deal!</h2>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT: Member Forms */}
            <div className="space-y-8">
              {members.map((member, idx) => (
                <div key={member.id} className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-purple-200 relative">
                  {members.length > 1 && (
                    <button onClick={() => removeMember(member.id)} className="absolute top-4 right-4 text-red-600 text-3xl font-bold hover:scale-125 transition">×</button>
                  )}
                  <h3 className="text-2xl font-bold text-indigo-600 mb-6">Member {idx + 1}</h3>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name *" value={member.name} onChange={e => updateMember(member.id, 'name', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition" />
                      <input type="text" placeholder="Registration No *" value={member.regNo} onChange={e => updateMember(member.id, 'regNo', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition" />
                    </div>

                    <input type="email" placeholder="Email * (@vitbhopal.ac.in only)" value={member.email} onChange={e => updateMember(member.id, 'email', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition ${member.email && !isValidVitEmail(member.email) ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`} />
                    {member.email && !isValidVitEmail(member.email) && <p className="text-red-600 text-sm -mt-2">Only @vitbhopal.ac.in allowed</p>}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input type="text" placeholder="Phone * (10 digits)" value={member.phone}
                          onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(0, 10); updateMember(member.id, 'phone', digits); }}
                          className={`w-full px-4 py-3 border-2 rounded-xl font-mono text-lg ${member.phone && member.phone.length !== 10 ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                          maxLength={10} inputMode="numeric" />
                        {member.phone && member.phone.length !== 10 && <p className="text-red-600 text-sm mt-1">Exactly 10 digits ({member.phone.length}/10)</p>}
                      </div>

                      <div>
                        <input type="text" placeholder={idx === 1 ? `UTR ID * (Same as Member 1)` : `UTR ID * (min 12 chars)`}
                          value={member.utrId} onChange={e => updateMember(member.id, 'utrId', e.target.value.slice(0, 30))}
                          readOnly={idx === 1} maxLength={30}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${member.utrId && (member.utrId.length < 12 || !/^[a-zA-Z0-9]+$/.test(member.utrId)) ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'} ${idx === 1 ? 'bg-gray-50 cursor-not-allowed' : ''}`} />
                        {idx === 1 && member.utrId && member.utrId.length >= 12 && /^[a-zA-Z0-9]+$/.test(member.utrId) && <p className="text-green-600 text-sm mt-1">Same UTR Applied</p>}
                        {idx === 0 && member.utrId && member.utrId.length < 12 && <p className="text-red-600 text-sm mt-1">Min 12 characters ({member.utrId.length}/12)</p>}
                        {idx === 0 && member.utrId && !/^[a-zA-Z0-9]+$/.test(member.utrId) && member.utrId.length >= 1 && <p className="text-red-600 text-sm mt-1">Only letters & numbers</p>}
                        {idx === 0 && member.utrId && member.utrId.length >= 12 && /^[a-zA-Z0-9]+$/.test(member.utrId) && <p className="text-green-600 text-sm mt-1">Valid UTR</p>}
                      </div>
                    </div>

                    {idx === 0 ? (
                      <select value={member.category} onChange={e => updateMember(member.id, 'category', e.target.value)} disabled={members.length > 1}
                        className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition ${members.length > 1 ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}>
                        <option value="normal">Normal Rows - ₹399</option>
                        <option value="front">Front Rows - ₹549</option>
                      </select>
                    ) : (
                      <div className="w-full px-4 py-3 bg-emerald-100 border-2 border-emerald-400 rounded-xl text-center font-bold text-emerald-800">
                        Front Rows - ₹549 (Offer Locked)
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {members.length < 2 && (
                <button onClick={addMember} disabled={members[0].category !== 'front'}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition hover:scale-105">
                  {members[0].category === 'front' ? '+ Add 2nd Member (Unlock ₹998 Offer!)' : 'Select Front Row First'}
                </button>
              )}
            </div>

            {/* RIGHT: Payment */}
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-emerald-300">
              <h3 className="text-3xl font-bold text-center mb-8">Pay Total Amount</h3>
              <div className={`text-7xl font-extrabold text-center mb-6 ${isOfferApplied ? 'text-green-600' : 'text-indigo-600'}`}>₹{totalPrice}</div>
              {isOfferApplied && <p className="text-center text-green-600 font-bold text-2xl mb-8">Duo Offer Applied!</p>}

              <div className="text-center mb-10">
                <img src={qrCode} alt="QR Code" className="mx-auto w-80 h-80 border-8 border-white rounded-2xl shadow-2xl" />
                <div className="mt-8 p-6 bg-gray-50 rounded-xl text-left text-sm">
                  <p className="font-bold text-lg mb-2">Bank Details:</p>
                  <p><strong>Bank:</strong> INDIAN BANK, VIT BHOPAL</p>
                  <p><strong>A/c No:</strong> 8093736714</p>
                  <p><strong>IFSC:</strong> IDIB000V143</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xl font-bold">Upload Payment Screenshot *</label>
                <input type="file" accept="image/*" onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-3 file:px-8 file:rounded-xl file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white file:font-bold border-4 border-dashed border-gray-300 rounded-xl cursor-pointer" />
                {screenshot && <p className="text-green-600 font-bold text-center">Selected: {screenshot.name}</p>}
              </div>

              <button onClick={handleSubmit} disabled={isSubmitting || !validateForm()}
                className="w-full mt-10 py-6 text-2xl font-bold text-white rounded-xl shadow-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 transition transform hover:scale-105 disabled:cursor-not-allowed">
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