import { useState, useEffect } from 'react';
import { HeartHandshake, Package, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';

const Donations = () => {
  const [unsoldListings, setUnsoldListings] = useState([]);
  const [pastDonations, setPastDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, listing: null });

  useEffect(() => {
    fetchUnsoldListings();
  }, []);

  const fetchUnsoldListings = async () => {
    try {
      const { data: listings } = await API.get('/listings/merchant/my-listings');
      setUnsoldListings(listings.filter(item => item.status === 'Available'));
      
      const { data: donations } = await API.get('/donations/merchant');
      setPastDonations(donations);
    } catch (error) {
      console.error("Failed to fetch donations data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonateClick = (listing) => {
    setConfirmModal({ show: true, listing });
  };

  const executeDonation = async () => {
    const listing = confirmModal.listing;
    if(!listing) return;
    
    setConfirmModal({ show: false, listing: null });
    
    try {
      // 1. Create a donation
      await API.post('/donations', {
        title: `Donation: ${listing.title}`,
        description: listing.description,
        quantityDescription: `${listing.quantityAvailable} items`,
        category: listing.category,
        dietaryType: listing.dietaryType || 'Mixed',
        pickupTimeLimit: listing.expiryTime,
        urgency: 'Medium',
      });
      
      // 2. Mark the listing as 'Donated' in the backend so it's removed from public listings
      await API.put(`/listings/${listing._id}/status`, { status: 'Donated' });
      
      // Update UI
      setUnsoldListings(unsoldListings.filter(item => item._id !== listing._id));
      showToast('Successfully moved to Donations!', 'success');
    } catch (error) {
      console.error("Failed to convert to donation", error);
      showToast('Failed to donate item.', 'error');
    }
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
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ show: false, listing: null })}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[120] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Confirm Donation</h3>
                  <button 
                    onClick={() => setConfirmModal({ show: false, listing: null })}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-slate-600 mb-8">
                  Are you sure you want to donate <strong className="text-slate-900">{confirmModal.listing?.quantityAvailable}x {confirmModal.listing?.title}</strong>? 
                  This will make it free for NGOs to claim.
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmModal({ show: false, listing: null })}
                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDonation}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors"
                  >
                    <HeartHandshake className="w-5 h-5" />
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Donation Management</h1>
          <p className="text-slate-600 mt-1">Convert unsold food into donations for local NGOs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-slate-500">Loading unsold inventory...</div>
        ) : unsoldListings.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500">No unsold food available to donate.</div>
        ) : (
          unsoldListings.map((item, idx) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Qty: {item.quantityAvailable}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-grow">{item.description}</p>
              
              <button 
                onClick={() => handleDonateClick(item)}
                className="w-full flex items-center justify-center space-x-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white py-3 rounded-xl transition-colors font-semibold"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Donate Food</span>
              </button>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Donation History</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">Donation Title</th>
                  <th className="px-6 py-4 font-medium">Quantity</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Claimed By</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pastDonations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500">No donations made yet.</td>
                  </tr>
                ) : (
                  pastDonations.map((don) => (
                    <tr key={don._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{don.title}</td>
                      <td className="px-6 py-4 text-slate-600">{don.quantityDescription}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(don.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${don.status === 'Claimed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {don.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{don.claimedBy?.name || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
