// src/components/AdminDashboard.jsx - SIMPLE & CLEAN STANDUP ONLY
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:5000'||'https://startup-club-dczt.onrender.com';

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login');
      navigate('/admin');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const standupOnly = (data.data || []).filter(r => r.type === 'standup');
      setRegistrations(standupOnly);

      if (!hasFetched.current) {
        toast.success(`Loaded ${standupOnly.length} registrations`);
        hasFetched.current = true;
      }
    } catch (err) {
      toast.error('Failed to load data');
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = registrations.filter(r =>
    search === '' ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.phone?.includes(search) ||
    r.utrId?.includes(search) ||
    r.registrationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadExcel = () => {
    const data = filtered.map((r, i) => ({
      'S.No': i + 1,
      'Name': r.name,
      'Email': r.email,
      'Phone': r.phone,
      'Reg No': r.registrationNumber,
      'UTR ID': r.utrId,
      'Seat': r.category === 'front' ? 'Front Row' : 'Normal Row',
      'Amount': '₹' + r.totalAmount,
      'Offer': r.offerApplied ? 'Duo ₹998' : '-',
      'Date': new Date(r.createdAt).toLocaleDateString(),
      'Time': new Date(r.createdAt).toLocaleTimeString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Standup');
    XLSX.writeFile(wb, `Standup_Registrations_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success('Excel downloaded');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
          <h1 className="text-2xl font-bold text-gray-800">Standup Comedy Registrations</h1>
          <p className="text-gray-600 mt-1">Total: <strong>{registrations.length}</strong> | Front Row: <strong>{registrations.filter(r => r.category === 'front').length}</strong></p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <input
            type="text"
            placeholder="Search name, email, phone, UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3">
            <button onClick={fetchData} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Refresh
            </button>
            <button onClick={downloadExcel} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Download Excel
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                toast.info('Logged out');
                navigate('/admin');
              }}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            {search ? 'No results found' : 'No registrations yet'}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">S.No</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Phone</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Reg No</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">UTR</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Seat</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Offer</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Screenshot</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((r, i) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-blue-600">{r.email}</td>
                      <td className="px-4 py-3">{r.phone}</td>
                      <td className="px-4 py-3 text-sm">{r.registrationNumber}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.utrId}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          r.category === 'front' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {r.category === 'front' ? 'Front' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{r.totalAmount}</td>
                      <td className="px-4 py-3 text-center">
                        {r.offerApplied ? <span className="text-green-600 font-medium">Duo ₹998</span> : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <a href={r.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          View
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600 border-t">
              Showing {filtered.length} of {registrations.length} registrations
              {search && ` • Filtered by "${search}"`}
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AdminDashboard;