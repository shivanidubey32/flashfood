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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:border-slate-300 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-md text-sm">
                <Star className="w-4 h-4 mr-1 fill-current" /> {p.rating}
              </div>
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{p.name}</h3>
            <p className="text-sm font-medium text-slate-500 mb-4">{p.type}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {p.location}</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{p.donations} Donations</span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPartners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
          <p className="text-slate-500 font-bold">No partners found.</p>
        </div>
      )}

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
