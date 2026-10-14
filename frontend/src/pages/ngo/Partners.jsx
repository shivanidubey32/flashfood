import { useState, useEffect } from 'react';
import { Store, MapPin, Search, Star, ExternalLink, Plus, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Partners = () => {
  const [partners, setPartners] = useState(() => {
    return JSON.parse(localStorage.getItem('ngo_partners')) || [
      { id: 1, name: 'Grand Hotel Banquet', type: 'Hotel/Restaurant', location: 'Swaroop Nagar, Kanpur', rating: 4.8, donations: 124 },
      { id: 2, name: 'Fresh Supermarket', type: 'Grocery', location: 'Civil Lines, Kanpur', rating: 4.5, donations: 89 },
      { id: 3, name: 'City Bakery', type: 'Bakery', location: 'Mall Road, Kanpur', rating: 4.9, donations: 210 }
    ];
  });
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleRequest = (e) => {
    e.preventDefault();
    if (!partnerEmail) return;
    setIsModalOpen(false);
    setPartnerEmail('');
    showToast('Partnership request sent successfully!');
  };

  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Food Partners</h1>
          <p className="text-slate-500 mt-1">Merchants and organizations that regularly donate to your NGO.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search partners..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center shrink-0"
          >
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Request Partner</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm mb-8 overflow-hidden mx-1 border border-slate-100 mt-4">
        {filteredPartners.map((p, index) => (
          <div key={p.id} className={`px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors ${index !== filteredPartners.length - 1 ? 'border-b border-slate-100' : ''}`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center border border-slate-200 mr-4 shrink-0">
                <Store className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="truncate">
                <h3 className="font-medium text-slate-900 text-[16px] truncate max-w-[200px] sm:max-w-xs">{p.name}</h3>
                <p className="text-[13px] text-slate-500 flex items-center mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                  <MapPin className="w-3 h-3 mr-1 shrink-0" /> <span className="truncate">{p.location}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 ml-2">
              <div className="flex items-center text-amber-500 font-medium text-[13px]">
                <Star className="w-3 h-3 mr-1 fill-current" /> {p.rating}
              </div>
              <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md mt-1">{p.donations} Donations</span>
            </div>
          </div>
        ))}
        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">No partners found.</p>
          </div>
        )}
      </div>

      {/* Request Partner Modal */}
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
              <h2 className="text-2xl font-black text-slate-900 mb-2">Request Partnership</h2>
              <p className="text-slate-500 text-sm mb-6">Send an invite to a merchant to start receiving bulk donations.</p>
              
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Merchant Email</label>
                  <input 
                    required 
                    type="email" 
                    value={partnerEmail} 
                    onChange={e => setPartnerEmail(e.target.value)} 
                    placeholder="merchant@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none" 
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 mt-4 shadow-lg shadow-slate-900/30">
                  Send Invite
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Partners;
