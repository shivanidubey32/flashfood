import { useState, useEffect } from 'react';
import { Users, Plus, Search, MapPin, Phone, UserPlus, X, Edit2, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState(() => {
    return JSON.parse(localStorage.getItem('ngo_beneficiaries')) || [
      { id: 1, name: 'Ashray Orphanage', type: 'Orphanage', contact: '+91 9876543211', location: 'Civil Lines, Kanpur', people: 45 },
      { id: 2, name: 'Navjeevan Shelter', type: 'Homeless Shelter', contact: '+91 9876543212', location: 'Kidwai Nagar, Kanpur', people: 120 }
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', type: 'Orphanage', contact: '', location: '', people: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, name: '' });

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    localStorage.setItem('ngo_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      setBeneficiaries(beneficiaries.map(b => b.id === formData.id ? { ...formData } : b));
      showToast('Beneficiary updated successfully!');
    } else {
      setBeneficiaries([...beneficiaries, { ...formData, id: Date.now() }]);
      showToast('Beneficiary added successfully!');
    }
    setIsModalOpen(false);
    setFormData({ id: null, name: '', type: 'Orphanage', contact: '', location: '', people: '' });
  };

  const handleEdit = (beneficiary) => {
    setFormData(beneficiary);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    setConfirmModal({ show: false, id: null, name: '' });
    showToast('Beneficiary removed successfully!');
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Beneficiaries</h1>
          <p className="text-slate-500 mt-1">Manage communities and organizations you distribute food to.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ id: null, name: '', type: 'Orphanage', contact: '', location: '', people: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center shadow-lg shadow-blue-600/20"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Beneficiary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiaries.map((b) => (
          <div key={b.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-lg mr-4">
                  {b.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{b.name}</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-1 inline-block">{b.type}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => handleEdit(b)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setConfirmModal({ show: true, id: b.id, name: b.name })} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mt-auto text-sm text-slate-600">
              <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400" /> {b.location}</p>
              <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-slate-400" /> {b.contact}</p>
              <p className="flex items-center"><Users className="w-4 h-4 mr-2 text-slate-400" /> ~{b.people} people served</p>
            </div>
          </div>
        ))}
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
              <h2 className="text-2xl font-black text-slate-900 mb-6">{formData.id ? 'Edit' : 'Add'} Beneficiary</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Organization Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Orphanage</option>
                      <option>Homeless Shelter</option>
                      <option>Slum Area</option>
                      <option>Old Age Home</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">People Served</label>
                    <input required type="number" value={formData.people} onChange={e => setFormData({...formData, people: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input required type="tel" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Location / Address</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 mt-4 shadow-lg shadow-blue-500/30">
                  {formData.id ? 'Save Changes' : 'Add Beneficiary'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Deletion Modal */}
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
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Removal</h3>
              <p className="text-slate-500 mb-8">Are you sure you want to remove "{confirmModal.name}"?</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, id: null, name: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(confirmModal.id)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Beneficiaries;
