// src/components/AdminDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const API_BASE = 'https://startup-club-dczt.onrender.com';

function AdminDashboard() {
  const [groups, setGroups] = useState([]);
  const [flattened, setFlattened] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [seatFilter, setSeatFilter] = useState('all');
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
      setGroups(data.data || []);
      if (!hasFetched.current) {
        toast.success(`Loaded ${data.data.length} groups (${data.data.reduce((acc, g) => acc + g.memberCount, 0)} total registrations)`);
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

  // Flatten groups to member rows
  useEffect(() => {
    const flat = groups.flatMap(group => 
      group.members.map(member => ({
        ...member,  // Member fields: name, email, phone, registrationNumber, category
        groupId: group._id,  // For linking rows
        utrId: group.utrId,  // Shared
        screenshotUrl: group.screenshotUrl,  // Shared
        totalAmount: group.totalAmount,  // Shared
        offerApplied: group.offerApplied,  // Shared
        memberCount: group.memberCount,  // Shared
        createdAt: group.createdAt,  // Shared
        isGroup: group.memberCount > 1  // Flag for styling
      }))
    );
    setFlattened(flat);
  }, [groups]);

  useEffect(() => { fetchData(); }, []);

  const filtered = flattened.filter(r => {
    const matchesSearch = search === '' ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.utrId?.includes(search) ||
      r.registrationNumber?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    switch (seatFilter) {
      case 'normal':
        return r.category === 'normal';
      case 'front-solo':
        return r.category === 'front' && r.memberCount === 1;
      case 'front-duo':
        return r.category === 'front' && r.memberCount === 2;
      case 'duo':
        return r.memberCount === 2 && r.category !== 'front';
      default:
        return true;
    }
  });

  // Stats from flattened/groups
  const totalRegs = flattened.length;
  const duoGroups = groups.filter(g => g.offerApplied).length;  // Groups with offer
  const frontSeats = flattened.filter(r => r.category === 'front').length;
  const totalAmount = groups.reduce((acc, g) => acc + g.totalAmount, 0);

  const downloadExcel = () => {
    const data = filtered.map((r, i) => ({
      'S.No': i + 1,
      'Name': r.name,
      'Email': r.email,
      'Phone': r.phone,
      'Reg No': r.registrationNumber,
      'UTR ID': r.utrId,
      'Seat': r.category === 'front' ? (r.memberCount === 2 ? 'Front Row Duo' : 'Front Row Solo') : (r.memberCount === 2 ? 'Normal Row Duo' : 'Normal Row'),
      'Amount': '₹' + r.totalAmount,
      'Offer': r.offerApplied ? 'DUO' : 'No',
      'Group Size': r.memberCount,
      'Screenshot': r.screenshotUrl || 'N/A',
      'Date': new Date(r.createdAt).toLocaleDateString(),
      'Time': new Date(r.createdAt).toLocaleTimeString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Standup');
    XLSX.writeFile(wb, `Standup_Comedy_Registrations_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success('Excel downloaded!');
  };

  const getSeatDisplay = (r) => {
    if (r.category === 'front') {
      return r.memberCount === 2 ? 'Front Duo' : 'Front Solo';
    } else {
      return r.memberCount === 2 ? 'Normal Duo' : 'Normal';
    }
  };

  const getSeatColor = (r) => {
    if (r.category === 'front') {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-screen mx-auto">
        <h1 className="text-4xl font-bold mb-2">Standup Comedy Registrations</h1>
        <p className="text-xl text-gray-600 mb-8">
          Total Registrants: <strong>{totalRegs}</strong> | 
          Duo Groups: <strong>{duoGroups}</strong> |
          Front Row Seats: <strong>{frontSeats}</strong> |
          Total Amount: <strong>₹{totalAmount}</strong>
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-wrap gap-4">
          <input
            type="text" placeholder="Search by name/email/phone/regNo/UTR..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-4 py-3 border rounded-lg w-full md:w-96"
          />
          <select value={seatFilter} onChange={e => setSeatFilter(e.target.value)} className="px-4 py-3 border rounded-lg">
            <option value="all">All Seats</option>
            <option value="normal">Normal Row</option>
            <option value="front-solo">Front Row Solo</option>
            <option value="front-duo">Front Row Duo</option>
            <option value="duo">Normal Duo</option>
          </select>
          <button onClick={fetchData} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Refresh</button>
          <button onClick={downloadExcel} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Excel</button>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>
        </div>

        {loading ? <div className="text-center py-20">Loading...</div> :
         filtered.length === 0 ? <div className="text-center py-20 text-xl text-gray-500">No registrations yet</div> :
         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
           <div className="overflow-x-auto">  {/* Horizontal scroll for small screens */}
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-100">
                 <tr>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Size</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {filtered.map((r, i) => (
                   <tr key={`${r.groupId}-${r.email}`} className={`hover:bg-gray-50 ${r.isGroup ? 'bg-gray-25' : ''}`}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{r.email}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.phone}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.registrationNumber}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{r.utrId}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getSeatColor(r)}`}>
                         {getSeatDisplay(r)}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">₹{r.totalAmount}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                       {r.offerApplied ? <span className="text-green-600 font-bold">DUO</span> : '-'}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{r.memberCount === 2 ? '2 (Duo)' : '1'}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <div className="flex items-center space-x-2">
                         <img 
                           src={r.screenshotUrl} 
                           alt="Payment Screenshot" 
                           className="w-10 h-10 object-cover rounded border" 
                           onError={(e) => { e.target.style.display = 'none'; }}
                         />
                         <a 
                           href={r.screenshotUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline text-xs"
                         >
                           View
                         </a>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                       {new Date(r.createdAt).toLocaleString()}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
        }
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;