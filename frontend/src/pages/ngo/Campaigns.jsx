import { useState, useEffect } from 'react';
import { Target, Users, Calendar, Plus, X, Heart, CheckCircle, Trash2, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState(() => {
    return JSON.parse(localStorage.getItem('ngo_campaigns')) || [
      { id: 1, title: 'Zero Hunger Kanpur', goal: '10,000 Meals', raised: '4,500', deadline: '2024-12-31', status: 'Active' },
      { id: 2, name: 'Winter Warmth & Food', goal: '5,000 Meals', raised: '5,200', deadline: '2024-02-28', status: 'Completed' }
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', goal: '', deadline: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, action: '', id: null, title: '' });

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    localStorage.setItem('ngo_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const handleAdd = (e) => {
    e.preventDefault();
    setCampaigns([...campaigns, { ...formData, raised: '0', status: 'Active', id: Date.now() }]);
    setIsModalOpen(false);
    setFormData({ title: '', goal: '', deadline: '' });
    showToast('Campaign launched successfully!');
  };

  const handleAction = () => {
    const { action, id } = confirmModal;
    if (action === 'complete') {
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: 'Completed', raised: c.goal } : c));
      showToast('Campaign marked as completed!');
    } else if (action === 'delete') {
      setCampaigns(campaigns.filter(c => c.id !== id));
      showToast('Campaign removed successfully!');
    }
    setConfirmModal({ show: false, action: '', id: null, title: '' });
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
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fundraising Campaigns</h1>
          <p className="text-slate-500 mt-1">Manage drives to support bulk distribution efforts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((c) => {
          const isCompleted = c.status === 'Completed';
          const raisedNum = parseInt(c.raised.replace(/,/g, ''));
          const goalNum = parseInt(c.goal.replace(/,/g, ''));
          const percent = Math.min(100, Math.round((raisedNum / goalNum) * 100));

          return (
            <div key={c.id} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${isCompleted ? 'bg-green-500/10' : 'bg-orange-500/10'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-2xl text-slate-900 mb-1">{c.title || c.name}</h3>
                  <p className="text-sm font-bold text-slate-500 flex items-center"><Calendar className="w-4 h-4 mr-1" /> Ends {c.deadline}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {c.status}
                </span>
              </div>
              
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span className={isCompleted ? 'text-green-500' : 'text-orange-500'}>{c.raised} raised</span>
                <span className="text-slate-400">Goal: {c.goal}</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
                <div className={`${isCompleted ? 'bg-green-500' : 'bg-orange-500'} h-3 rounded-full`} style={{ width: `${percent}%` }}></div>
              </div>
              
              <div className="flex space-x-3">
                {!isCompleted && (
                  <button 
                    onClick={() => setConfirmModal({ show: true, action: 'complete', id: c.id, title: c.title || c.name })}
                    className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors flex justify-center items-center"
                  >
                    <Check className="w-4 h-4 mr-1" /> Complete
                  </button>
                )}
                <button 
                  onClick={() => setConfirmModal({ show: true, action: 'delete', id: c.id, title: c.title || c.name })}
                  className="flex-1 bg-slate-50 border border-slate-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors flex justify-center items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-6">New Campaign</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Campaign Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Goal (e.g. 5000 Meals)</label>
                  <input required type="text" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Deadline</label>
                  <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 mt-4">
                  Launch Campaign
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Action Modal */}
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
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.action === 'complete' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                {confirmModal.action === 'complete' ? <CheckCircle className="w-8 h-8" /> : <Trash2 className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm {confirmModal.action === 'complete' ? 'Completion' : 'Deletion'}</h3>
              <p className="text-slate-500 mb-8">Are you sure you want to {confirmModal.action} "{confirmModal.title}"?</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, action: '', id: null, title: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAction}
                  className={`flex-1 py-3 font-bold rounded-xl text-white transition-colors shadow-lg ${
                    confirmModal.action === 'complete' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                  }`}
                >
                  Yes, {confirmModal.action === 'complete' ? 'Complete' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Campaigns;
