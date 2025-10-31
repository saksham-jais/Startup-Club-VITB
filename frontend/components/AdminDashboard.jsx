import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Search state
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Track first successful fetch to avoid double toast in StrictMode

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Token on dashboard mount:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      toast.error('No token found. Please log in.');
      navigate('/admin', { replace: true });
      return;
    }

    const fetchRegistrations = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('http://localhost:5000/registration/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetch registrations response:', response.data);
        setRegistrations(response.data.data || []);
        if (!hasFetched.current) {
          toast.success('Registrations fetched successfully!');
          hasFetched.current = true;
        }
      } catch (err) {
        const status = err.response?.status;
        const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch registrations. Please log in again.';
        setError(errorMsg);
        toast.error(errorMsg);
        console.error('Fetch error:', err.response || err);

        if (status === 401) {
          localStorage.removeItem('adminToken');
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 100);
        } else {
          toast.info('Please refresh and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [navigate]);

  // NEW: Filter registrations by name search
  const filteredRegistrations = useMemo(() => {
    if (!searchTerm) return registrations;
    return registrations.filter((reg) =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [registrations, searchTerm]);

  const downloadExcel = () => {
    try {
      // Use filtered data for download if searching
      const dataToExport = searchTerm ? filteredRegistrations : registrations;
      const data = dataToExport.map((reg) => ({
        ID: reg._id,
        Title: reg.title,
        Description: reg.description,
        Name: reg.name,
        Email: reg.email,
        'Registration Number': reg.registrationNumber,
        'UTR ID': reg.utrId,
        'Screenshot URL': reg.screenshotUrl,
        'Created At': new Date(reg.createdAt).toLocaleString(),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
      XLSX.writeFile(wb, `registrations_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Excel file downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download Excel file.');
      console.error('Excel download error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 py-15 sm:p-6 lg:p-20">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                📊
              </div>
              Registrations Dashboard
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={downloadExcel}
                disabled={loading || filteredRegistrations.length === 0}
                className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-md ${
                  loading || filteredRegistrations.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                📥 Download Excel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  toast.info('Logged out successfully.');
                  navigate('/admin', { replace: true });
                }}
                className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - NEW */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredRegistrations.length} of {registrations.length} results
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📭
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">
              {searchTerm ? 'No registrations found matching your search.' : 'No registrations found.'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm ? `Try searching for "${searchTerm}"` : 'Get started by adding your first registration.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                  <tr>
                    {['ID', 'Title', 'Name', 'Email', 'Reg No', 'UTR ID', 'Screenshot', 'Created At'].map((header) => (
                      <th
                        key={header}
                        className="px-4 sm:px-6 py-4 font-semibold text-gray-700 text-xs sm:text-sm border-b border-gray-200 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRegistrations.map((reg) => (
                    <tr
                      key={reg._id}
                      className="hover:bg-gray-50 transition-all duration-150 ease-in-out group"
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800">
                        {reg._id.slice(0, 8)}...
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800 font-medium">
                        {reg.title}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800 font-medium">
                        {reg.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800">
                        {reg.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800">
                        {reg.registrationNumber}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800">
                        {reg.utrId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 border-b border-gray-100">
                        <a
                          href={reg.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors group-hover:text-blue-700"
                        >
                          👁️ View
                        </a>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 border-b border-gray-100 group-hover:text-gray-800">
                        {new Date(reg.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer with Count */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredRegistrations.length} of {registrations.length} total registrations
              </p>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
}

export default AdminDashboard;