import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShieldAlert, ShieldCheck, FileText, CheckCircle2, Loader, Building2 } from 'lucide-react';

const NGOManagement = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNGOs = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/users?role=NGO'), config);
      setNgos(data);
    } catch (error) {
      console.error('Failed to load NGOs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const toggleVerification = async (ngoId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'revoke verification for' : 'verify'} this NGO?`)) return;
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/verify/${ngoId}`, {}, config);
      fetchNGOs();
    } catch (error) {
      alert('Failed to update verification status');
    }
  };

  const toggleBlockStatus = async (ngoId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this NGO?`)) return;
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/block/${ngoId}`, {}, config);
      fetchNGOs();
    } catch (error) {
      alert('Failed to update block status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">NGO Management</h1>
          <p className="text-slate-500 mt-2">Approve registrations, verify 80G documents, and manage active NGOs.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Partner NGOs</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-2 text-amber-500" />
              <p>Loading NGOs...</p>
            </div>
          ) : ngos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="font-bold">No NGOs found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">NGO Name</th>
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ngos.map((ngo) => (
                  <tr key={ngo._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black mr-4 uppercase">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{ngo.name}</p>
                          <p className="text-xs text-slate-500">{ngo.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        {ngo.ngoRegistrationNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      {ngo.isVerified ? (
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold flex items-center w-max border border-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold flex items-center w-max border border-amber-200">
                          <FileText className="w-3 h-3 mr-1" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {ngo.isBlocked ? (
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center w-max">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Suspended
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center w-max">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button 
                        onClick={() => toggleVerification(ngo._id, ngo.isVerified)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${
                          ngo.isVerified 
                            ? 'border-slate-200 text-slate-500 hover:bg-slate-50' 
                            : 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                        }`}
                      >
                        {ngo.isVerified ? 'Revoke' : 'Verify'}
                      </button>
                      <button 
                        onClick={() => toggleBlockStatus(ngo._id, ngo.isBlocked)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                          ngo.isBlocked 
                            ? 'bg-slate-900 text-white hover:bg-slate-800' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {ngo.isBlocked ? 'Unblock' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOManagement;
