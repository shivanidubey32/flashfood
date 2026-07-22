import { Search, Plus, UserPlus, Phone, Star, MoreVertical, Calendar, Loader, X, ShieldCheck, CheckCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, name: '' });

  // Fetch volunteers
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/volunteers'), config);
      setVolunteers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load volunteers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    
    setIsSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/volunteers'), {
        name: newName,
        phone: newPhone
      }, config);
      
      setVolunteers([data, ...volunteers]);
      setIsModalOpen(false);
      setNewName('');
      setNewPhone('');
      showToast('Volunteer added successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error adding volunteer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVolunteer = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/volunteers/${id}`, config);
      
      setVolunteers(volunteers.filter(v => v._id !== id));
      setConfirmModal({ show: false, id: null, name: '' });
      showToast('Volunteer removed successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error removing volunteer', 'error');
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Volunteer Management</h1>
          <p className="text-slate-500 mt-1">Assign pickups, track performance, and manage your team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center shadow-lg shadow-green-500/20"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Volunteer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Volunteer List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900">Your Volunteers</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search by name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
            </div>
            
            <div className="overflow-x-auto min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <Loader className="w-8 h-8 animate-spin mb-2" />
                  <p>Loading volunteers...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-48 text-red-500">
                  <p>{error}</p>
                </div>
              ) : volunteers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <p className="font-bold">No volunteers found</p>
                  <p className="text-sm">Click "Add Volunteer" to create one.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Total Pickups</th>
                      <th className="p-4 pr-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {volunteers.map((vol) => (
                      <tr key={vol._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3 uppercase">
                              {vol.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{vol.name}</p>
                              <p className="text-xs text-slate-500 flex items-center mt-0.5"><Phone className="w-3 h-3 mr-1" /> {vol.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            vol.status === 'Active' ? 'bg-green-100 text-green-700' :
                            vol.status === 'On Delivery' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {vol.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-amber-500 font-bold text-sm">
                            <Star className="w-4 h-4 mr-1 fill-current" /> {vol.rating.toFixed(1)}
                          </div>
                        </td>
                        <td className="p-4 text-slate-700 font-medium">{vol.tasksCompleted} tasks</td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => setConfirmModal({ show: true, id: vol._id, name: vol.name })}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors p-2"
                            title="Remove Volunteer"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Right Col: Assignment & Schedule */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-slate-400" />
              Quick Assign
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded">Urgent Pickup</span>
                <p className="font-bold text-slate-900 mt-2">City Bakery</p>
                <p className="text-xs text-slate-500 mb-4">30 Loaves • Expires in 1 hr</p>
                <button className="w-full bg-slate-900 text-white font-bold text-sm py-2 rounded-xl hover:bg-slate-800 transition-colors">
                  Assign Volunteer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Volunteer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Add New Volunteer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddVolunteer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={newPhone} 
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  placeholder="e.g. +91 9876543210"
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isSubmitting ? <Loader className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Adding...' : 'Add Volunteer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <h3 className="text-xl font-black text-slate-900 mb-2">Remove Volunteer</h3>
              <p className="text-slate-500 mb-8">Are you sure you want to remove {confirmModal.name} from your team?</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, id: null, name: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteVolunteer(confirmModal.id)}
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

export default Volunteers;
