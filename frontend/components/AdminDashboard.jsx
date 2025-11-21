// src/components/AdminDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const API_BASE = 'https://startup-club-dczt.onrender.com';

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin'); return; }

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(data.data || []);
      if (!hasFetched.current) {
        toast.success(`Loaded ${data.data.length} registrations`);
        hasFetched.current = true;
      }
    } catch (err) {
      toast.error('Failed to load');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
      'Offer': r.offerApplied ? 'DUO ₹998' : 'No',
      'Members': r.memberCount,
      'Date': new Date(r.createdAt).toLocaleDateString(),
      'Time': new Date(r.createdAt).toLocaleTimeString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Standup');
    XLSX.writeFile(wb, `Standup_Comedy_Registrations_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success('Excel downloaded!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Standup Comedy Registrations</h1>
        <p className="text-xl text-gray-600 mb-8">
          Total: <strong>{registrations.length}</strong> | 
          Duo Offers: <strong>{registrations.filter(r => r.offerApplied).length}</strong> |
          Front Row: <strong>{registrations.filter(r => r.category === 'front').length}</strong>
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-wrap gap-4">
          <input
            type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-4 py-3 border rounded-lg w-full md:w-96"
          />
          <button onClick={fetchData} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Refresh</button>
          <button onClick={downloadExcel} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Excel</button>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>
        </div>

        {loading ? <div className="text-center py-20">Loading...</div> :
         filtered.length === 0 ? <div className="text-center py-20 text-xl text-gray-500">No registrations yet</div> :
         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
           <table className="w-full">
             <thead className="bg-gray-100">
               <tr>
                 <th className="px-6 py-4 text-left">S.No</th>
                 <th className="px-6 py-4 text-left">Name</th>
                 <th className="px-6 py-4 text-left">Email</th>
                 <th className="px-6 py-4 text-left">Phone</th>
                 <th className="px-6 py-4 text-left">Reg No</th>
                 <th className="px-6 py-4 text-left">UTR</th>
                 <th className="px-6 py-4 text-left">Seat</th>
                 <th className="px-6 py-4 text-left">Amount</th>
                 <th className="px-6 py-4 text-left">Offer</th>
                 <th className="px-6 py-4 text-left">Members</th>
                 <th className="px-6 py-4 text-left">Screenshot</th>
                 <th className="px-6 py-4 text-left">Date & Time</th>
               </tr>
             </thead>
             <tbody>
               {filtered.map((r, i) => (
                 <tr key={r._id} className="border-t hover:bg-gray-50">
                   <td className="px-6 py-4">{i + 1}</td>
                   <td className="px-6 py-4 font-medium">{r.name}</td>
                   <td className="px-6 py-4 text-blue-600">{r.email}</td>
                   <td className="px-6 py-4">{r.phone}</td>
                   <td className="px-6 py-4">{r.registrationNumber}</td>
                   <td className="px-6 py-4 font-mono text-sm">{r.utrId}</td>
                   <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.category === 'front' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                       {r.category === 'front' ? 'Front' : 'Normal'}
                     </span>
                   </td>
                   <td className="px-6 py-4 font-bold text-green-600">₹{r.totalAmount}</td>
                   <td className="px-6 py-4 text-center">
                     {r.offerApplied ? <span className="text-green-600 font-bold">DUO ₹998</span> : '-'}
                   </td>
                   <td className="px-6 py-4 text-center font-medium">{r.memberCount === 2 ? '2 (Duo)' : '1'}</td>
                   <td className="px-6 py-4">
                     <a href={r.screenshotUrl} target="_blank" className="text-blue-600 hover:underline">View</a>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600">
                     {new Date(r.createdAt).toLocaleString()}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
        }
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;