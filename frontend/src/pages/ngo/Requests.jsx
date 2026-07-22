import { useState, useEffect } from 'react';
import { AlertCircle, Clock, MapPin, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import axios from 'axios';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/requests', config);
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAction = async (id, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/requests/${id}/status`, { status: newStatus }, config);
      setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
      showToast(`Request ${newStatus.toLowerCase()} successfully!`, newStatus === 'Declined' ? 'error' : 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update status', 'error');
    }
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
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Food Requests</h1>
        <p className="text-slate-500 mt-1">Manage incoming food requirements from communities and shelters.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500 font-bold">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">No active requests.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${req.urgency === 'High' ? 'bg-red-100 text-red-700' : req.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {req.urgency} Urgency
                  </span>
                  {req.status !== 'Pending' && (
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${req.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {req.status}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{req.community}</h3>
                <p className="text-slate-600 font-medium mb-2">{req.need}</p>
                <div className="flex items-center text-xs text-slate-400 font-bold gap-4">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Needed {new Date(req.dateNeeded).toLocaleDateString()}</span>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> View Location</span>
                </div>
              </div>
              
              {req.status === 'Pending' && (
                <div className="flex w-full md:w-auto gap-3">
                  <button 
                    onClick={() => handleAction(req._id, 'Declined')}
                    className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center"
                  >
                    <XCircle className="w-5 h-5 mr-2" /> Decline
                  </button>
                  <button 
                    onClick={() => handleAction(req._id, 'Accepted')}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Accept
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Requests;
