import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShieldAlert, ShieldCheck, FileText, CheckCircle2, Loader, Building2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NGOManagement = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null, actionLabel: '' });

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

  const toggleVerification = (ngoId, currentStatus) => {
    setConfirmModal({
      show: true,
      message: `Are you sure you want to ${currentStatus ? 'revoke verification for' : 'verify'} this NGO?`,
      actionLabel: currentStatus ? 'Revoke' : 'Verify',
      onConfirm: async () => {
        setConfirmModal({ show: false, message: '', onConfirm: null, actionLabel: '' });
        try {
          const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/verify/${ngoId}`, {}, config);
          fetchNGOs();
          showToast(`NGO successfully ${currentStatus ? 'unverified' : 'verified'}!`);
        } catch (error) {
          showToast('Failed to update verification status', 'error');
        }
      }
    });
  };

  const toggleBlockStatus = (ngoId, currentStatus) => {
    setConfirmModal({
      show: true,
      message: `Are you sure you want to ${currentStatus ? 'unblock' : 'suspend'} this NGO?`,
      actionLabel: currentStatus ? 'Unblock' : 'Suspend',
      onConfirm: async () => {
        setConfirmModal({ show: false, message: '', onConfirm: null, actionLabel: '' });
        try {
          const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/block/${ngoId}`, {}, config);
          fetchNGOs();
          showToast(`NGO successfully ${currentStatus ? 'unblocked' : 'suspended'}!`);
        } catch (error) {
          showToast('Failed to update block status', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Action</h3>
              <p className="text-slate-500 mb-8">{confirmModal.message}</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, message: '', onConfirm: null, actionLabel: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors shadow-lg ${
                    confirmModal.actionLabel === 'Suspend' || confirmModal.actionLabel === 'Revoke' 
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                      : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                  }`}
                >
                  {confirmModal.actionLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">NGO Management</h1>
          <p className="text-slate-500 mt-2">Verify non-profit organizations and manage their platform access.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Registered NGOs</h2>
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
                  <th className="p-4 pl-6">Organization Name</th>
                  <th className="p-4">Reg. Number</th>
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
                          <FileText className="w-3 h-3 mr-1" /> Pending 80G
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
