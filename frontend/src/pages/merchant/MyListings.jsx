import { useState, useEffect } from 'react';
import { Clock, Edit, Trash2, Tag, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Edit Modal State
  const [editModal, setEditModal] = useState({ show: false, item: null, newPrice: '' });
  
  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await API.get('/listings/merchant/my-listings');
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  const editListing = (item) => {
    setEditModal({ show: true, item, newPrice: item.discountedPrice });
  };

  const saveEditedPrice = () => {
    const { item, newPrice } = editModal;
    if (newPrice !== null && !isNaN(newPrice) && newPrice !== '') {
      setListings(listings.map(l => l._id === item._id ? { ...l, discountedPrice: Number(newPrice) } : l));
      showToast(`Price for ${item.title} updated to ₹${newPrice} locally.`);
    } else {
      showToast('Please enter a valid price.', 'error');
    }
    setEditModal({ show: false, item: null, newPrice: '' });
  };

  const markSoldOut = async (id) => {
    try {
      setListings(listings.map(l => l._id === id ? { ...l, status: 'Unavailable' } : l));
      showToast(`Listing marked as Sold Out locally.`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteListing = async (id) => {
    setConfirmModal({
      show: true,
      message: 'Are you sure you want to delete this listing?',
      onConfirm: () => {
        setListings(listings.filter(l => l._id !== id));
        showToast(`Listing removed locally.`);
        setConfirmModal({ show: false, message: '', onConfirm: null });
      }
    });
  };

  return (
    <div className="p-8 relative">
      
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
            <CheckCircle className="w-5 h-5" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-600 mt-1">Manage your active and past food items.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Food Item</th>
                <th className="px-6 py-4 font-medium">Original Price</th>
                <th className="px-6 py-4 font-medium">Discounted Price</th>
                <th className="px-6 py-4 font-medium">Qty Left</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">Loading listings...</td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">No active listings found. Add some from the Add Listing tab!</td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        <span className="text-xs text-slate-400 font-normal">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 line-through">₹{item.originalPrice}</td>
                    <td className="px-6 py-4 font-bold text-green-600">₹{item.discountedPrice}</td>
                    <td className="px-6 py-4 text-slate-600">{item.quantityAvailable}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center mt-2">
                      <Clock className="w-4 h-4 mr-1 text-slate-400" /> 
                      {new Date(item.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button onClick={() => editListing(item)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Listing">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => markSoldOut(item._id)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Mark Sold Out">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteListing(item._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Listing">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      <AnimatePresence>
        {editModal.show && (
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
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-black text-slate-900 mb-2">Edit Discounted Price</h3>
              <p className="text-slate-500 mb-6 text-sm">Update the price for {editModal.item?.title}</p>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">New Price (₹)</label>
                <input 
                  type="number" 
                  value={editModal.newPrice}
                  onChange={(e) => setEditModal({...editModal, newPrice: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setEditModal({ show: false, item: null, newPrice: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEditedPrice}
                  className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                >
                  Save
                </button>
              </div>
            </motion.div>
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
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Deletion</h3>
              <p className="text-slate-500 mb-8">{confirmModal.message}</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyListings;
