// src/components/AdminDashboard.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchRegistrations = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { toast.error('Login required'); navigate('/admin', { replace: true }); return; }

    setLoading(true);
    try {
      const { data } = await axios.get(
        'https://startup-club-dczt.onrender.com/registration/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistrations(data.data || []);
      if (!hasFetched.current) { toast.success('Loaded'); hasFetched.current = true; } else {
        toast.success('Refreshed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
      if (err.response?.status === 401) { localStorage.removeItem('adminToken'); navigate('/admin'); }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!searchTerm) return registrations;
    const s = searchTerm.toLowerCase();
    return registrations.filter(r =>
      r.name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      `${r.seatRow}${r.seatColumn}`.toLowerCase().includes(s) ||
      r.registrationNumber.toLowerCase().includes(s) ||
      r.utrId.toLowerCase().includes(s)
    );
  }, [registrations, searchTerm]);

  const downloadExcel = () => {
    const data = (searchTerm ? filtered : registrations).map(r => ({
      ID: r._id,
      Title: r.title,
      Name: r.name,
      Email: r.email,
      'Reg No': r.registrationNumber,
      'UTR ID': r.utrId,
      Seat: `${r.seatRow}${r.seatColumn}`,
      'Screenshot': r.screenshotUrl,
      'Created': new Date(r.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Regs');
    XLSX.writeFile(wb, `regs_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success('Downloaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Chart Registrations
          </h2>
          <div className="flex gap-3">
            <button onClick={fetchRegistrations} disabled={loading}
              className={`px-5 py-2 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              Refresh
            </button>
            <button onClick={downloadExcel} disabled={loading || filtered.length===0}
              className={`px-5 py-2 rounded-lg text-white font-medium ${loading||filtered.length===0?'bg-gray-400':'bg-green-600 hover:bg-green-700'}`}>
              Download Excel
            </button>
            <button onClick={()=>{localStorage.removeItem('adminToken');toast.info('Logged out');navigate('/admin');}}
              className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex items-center gap-2">
            Search <input type="text" placeholder="Name / Email / Seat / Reg / UTR"
              value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            {searchTerm && <button onClick={()=>setSearchTerm('')} className="text-gray-500">Clear</button>}
          </div>
          {searchTerm && <p className="text-sm text-gray-500 mt-1">
            {filtered.length} of {registrations.length} results
          </p>}
        </div>

        {/* Loading / Empty / Table */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            Empty {searchTerm ? 'No match' : 'No registrations yet'}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>{['ID','Title','Name','Email','Reg No','UTR ID','Seat','Screenshot','Created'].map(h=>
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(r => {
                    const isPremium = ['N','M','L'].includes(r.seatRow);
                    return (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs">{r._id.slice(0,8)}...</td>
                        <td className="px-4 py-3">{r.title}</td>
                        <td className="px-4 py-3 font-medium">{r.name}</td>
                        <td className="px-4 py-3">{r.email}</td>
                        <td className="px-4 py-3">{r.registrationNumber}</td>
                        <td className="px-4 py-3">{r.utrId}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{r.seatRow}{r.seatColumn}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full text-white ${isPremium?'bg-purple-600':'bg-teal-600'}`}>
                              {isPremium?'Premium':'Executive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a href={r.screenshotUrl} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 hover:underline">View</a>
                        </td>
                        <td className="px-4 py-3 text-xs">{new Date(r.createdAt).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
              Showing {filtered.length} of {registrations.length}
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
}

export default AdminDashboard;