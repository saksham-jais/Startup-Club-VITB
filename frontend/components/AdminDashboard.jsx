// src/components/AdminDashboard.jsx - Updated for all events with filters
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
  const [eventFilter, setEventFilter] = useState('all');
  const [showMemesModal, setShowMemesModal] = useState(false);
  const [selectedMemes, setSelectedMemes] = useState([]);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'esports', label: 'Esports' },
    { value: 'memewar', label: 'Meme War' },
    { value: 'standup', label: 'Standup' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'ideathon', label: 'Ideathon' }
  ];

  const fetchRegistrations = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { 
      toast.error('Login required'); 
      navigate('/admin', { replace: true }); 
      return; 
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        'https://startup-club-dczt.onrender.com/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistrations(data.data || []);
      if (!hasFetched.current) { 
        toast.success('Loaded all registrations'); 
        hasFetched.current = true; 
      } else {
        toast.success('Refreshed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch');
      if (err.response?.status === 401) { 
        localStorage.removeItem('adminToken'); 
        navigate('/admin'); 
      }
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [navigate]);

  const viewMemes = (memes) => {
    setSelectedMemes(memes);
    setShowMemesModal(true);
  };

  const closeModal = () => {
    setShowMemesModal(false);
    setSelectedMemes([]);
  };

  const filtered = useMemo(() => {
    let filteredRegs = registrations;

    // Filter by event type
    if (eventFilter !== 'all') {
      filteredRegs = filteredRegs.filter(r => r.type === eventFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filteredRegs = filteredRegs.filter(r => {
        // Common fields
        return (
          (r.name || '').toLowerCase().includes(s) ||
          (r.email || '').toLowerCase().includes(s) ||
          (r.registrationNumber || '').toLowerCase().includes(s) ||
          (r.utrId || '').toLowerCase().includes(s) ||
          (r.seat || '').toLowerCase().includes(s) ||
          (r.teamName || '').toLowerCase().includes(s) ||
          (r.members || '').toLowerCase().includes(s)
        );
      });
    }

    return filteredRegs;
  }, [registrations, searchTerm, eventFilter]);

  const downloadExcel = () => {
    const data = filtered.map(r => {
      const row = {
        ID: r._id,
        Type: r.type?.toUpperCase(),
        Title: r.title,
        Name: r.name || r.leader?.name || 'N/A',
        Email: r.email || r.leader?.email || 'N/A',
        'Reg No': r.registrationNumber || r.leader?.registrationNumber || 'N/A',
        'UTR ID': r.utrId || 'N/A',
        'Team Name': r.teamName || 'N/A',
        'Members': r.members || 'N/A',
        Seat: r.seat || 'N/A',
        'Screenshot': r.screenshotUrl || 'N/A',
        'Submission': r.submissionUrl || 'N/A',
        'Memes': r.memes ? JSON.stringify(r.memes.map(m => ({ url: m.url, format: m.format }))) : 'N/A',
        'Created': new Date(r.createdAt || r.registeredAt || Date.now()).toLocaleString(),
      };
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Registrations');
    XLSX.writeFile(wb, `all_regs_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success('Downloaded Excel');
  };

  const getSeatBadge = (r) => {
    if (!r.seat) return null;
    const isPremium = ['N', 'M', 'L'].includes(r.seatRow);
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full text-white ${isPremium ? 'bg-purple-600' : 'bg-teal-600'}`}>
        {isPremium ? 'Premium' : 'Executive'}
      </span>
    );
  };

  const isTeamEvent = (type) => ['hackathon', 'ideathon'].includes(type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            All Event Registrations Dashboard
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={fetchRegistrations} 
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Refresh
            </button>
            <button 
              onClick={downloadExcel} 
              disabled={loading || filtered.length === 0}
              className={`px-5 py-2 rounded-lg text-white font-medium ${loading || filtered.length === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Download Excel
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('adminToken');
                toast.info('Logged out');
                navigate('/admin');
              }}
              className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Event</label>
            <select 
              value={eventFilter} 
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Name / Email / Seat / Reg No / UTR / Team..."
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-1">
                {filtered.length} of {registrations.length} results
              </p>
            )}
          </div>
        </div>

        {/* Loading / Empty / Table */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">Loading registrations...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            {searchTerm || eventFilter !== 'all' ? 'No matching registrations' : 'No registrations yet'}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    {['Type', 'Title', 'Name', 'Email', 'Reg No', 'UTR ID', 'Team Name', 'Members', 'Seat', 'Screenshot', 'Submission', 'Memes', 'Created'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map(r => {
                    const isTeam = isTeamEvent(r.type);
                    const hasScreenshot = r.screenshotUrl;
                    const hasSubmission = r.submissionUrl;
                    const seatBadge = getSeatBadge(r);
                    const hasMemes = r.memes && r.memes.length > 0;

                    return (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-medium text-gray-900">{r.type?.toUpperCase()}</td>
                        <td className="px-4 py-3 text-sm">{r.title}</td>
                        <td className="px-4 py-3 font-medium text-sm">{r.name}</td>
                        <td className="px-4 py-3 text-sm">{r.email}</td>
                        <td className="px-4 py-3 text-sm">{r.registrationNumber}</td>
                        <td className="px-4 py-3 text-sm">{r.utrId || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm font-medium">{r.teamName || '-'}</td>
                        <td className="px-4 py-3 text-sm">{isTeam ? (r.members || 'Solo') : '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{r.seat || '-'}</span>
                            {seatBadge}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {hasScreenshot ? (
                            <a 
                              href={r.screenshotUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              View
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {hasSubmission ? (
                            <a 
                              href={r.submissionUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              View
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {hasMemes ? (
                            <button
                              onClick={() => viewMemes(r.memes)}
                              className="text-blue-600 hover:underline text-xs font-medium"
                            >
                              View {r.memes.length}
                            </button>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(r.createdAt || r.registeredAt || Date.now()).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
              Showing {filtered.length} of {registrations.length} {eventFilter !== 'all' ? `(${eventFilter.toUpperCase()}) ` : ''}results
            </div>
          </div>
        )}

        {/* Memes Modal */}
        {showMemesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Uploaded Memes ({selectedMemes.length})</h3>
                  <button 
                    onClick={closeModal} 
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedMemes.map((meme, index) => (
                    <div key={index} className="border rounded-lg p-2 bg-gray-50">
                      <img 
                        src={meme.url} 
                        alt={`Meme ${index + 1}`}
                        className="w-full h-48 object-contain rounded border"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png'; // Fallback if needed
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2 truncate">{meme.public_id.split('/').pop()}</p>
                      <a 
                        href={meme.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs block mt-1"
                      >
                        Open Full Size
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
}

export default AdminDashboard;