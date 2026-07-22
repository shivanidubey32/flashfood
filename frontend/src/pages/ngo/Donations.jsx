import { MapPin, Search, Filter, Clock, Navigation, CheckCircle, Loader, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    let result = donations;
    if (activeFilter !== 'All') {
      result = result.filter(d => d.urgency === activeFilter);
    }
    if (searchQuery) {
      result = result.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || (d.merchant?.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredDonations(result);
  }, [activeFilter, searchQuery, donations]);

  const fetchDonations = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo.token) return;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/donations', config);
      
      // If no donations in DB, use mock data for demonstration
      const displayData = data.length > 0 ? data : [
        {
          _id: 'mock1',
          title: '50 Boxed Meals',
          description: 'Leftover from corporate event. Needs to be picked up immediately.',
          quantityDescription: '50 Meals',
          category: 'Prepared Food',
          dietaryType: 'Mixed',
          pickupTimeLimit: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          urgency: 'High',
          status: 'Available',
          merchant: { businessName: 'Corporate Catering Co.' }
        },
        {
          _id: 'mock2',
          title: 'Fresh Bread & Pastries',
          description: 'End of day surplus items, perfectly good.',
          quantityDescription: '30 kg',
          category: 'Baked Goods',
          dietaryType: 'Vegetarian',
          pickupTimeLimit: new Date(Date.now() + 5 * 60 * 60 * 1000),
          urgency: 'Medium',
          status: 'Available',
          merchant: { businessName: 'Sweet Tooth Bakery' }
        },
        {
          _id: 'mock3',
          title: 'Produce & Veggies',
          description: 'Slightly bruised but perfectly edible vegetables.',
          quantityDescription: '100 kg',
          category: 'Raw Ingredients',
          dietaryType: 'Vegan',
          pickupTimeLimit: new Date(Date.now() + 24 * 60 * 60 * 1000),
          urgency: 'Low',
          status: 'Available',
          merchant: { businessName: 'Green Grocers' }
        }
      ];

      // Assign random map positions
      const positionedData = displayData.map(d => ({
        ...d,
        top: `${Math.floor(Math.random() * 60) + 20}%`,
        left: `${Math.floor(Math.random() * 60) + 20}%`,
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
      }));
      setDonations(positionedData);
    } catch (error) {
      console.error("Error fetching donations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    setClaimingId(id);
    try {
      if (!id.startsWith('mock')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/donations/${id}/claim`, {}, config);
      } else {
        // Simulate network delay for mock claim
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Remove from map locally
      setDonations(donations.filter(d => d._id !== id));
      setSelectedDonation(null);
      showToast('Donation successfully claimed!');
    } catch (error) {
      console.error("Error claiming donation", error);
      showToast('Failed to claim donation.', 'error');
    } finally {
      setClaimingId(null);
    }
  };



  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col relative">
      
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Real-Time Donation Map</h1>
          <p className="text-slate-500 mt-1">Locate and claim available food donations near you.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto relative">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search food or merchant..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`border p-2.5 rounded-xl transition-colors ${activeFilter !== 'All' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilterMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
              >
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Filter by Urgency</div>
                {['All', 'High', 'Medium', 'Low'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm font-bold flex items-center justify-between hover:bg-slate-50 ${activeFilter === filter ? 'text-slate-900' : 'text-slate-500'}`}
                  >
                    {filter === 'All' ? 'All Donations' : `${filter} Urgency`}
                    {activeFilter === filter && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-slate-200 rounded-3xl flex-1 relative overflow-hidden border-4 border-white shadow-xl">
        {/* Fake Map Background using CSS Grid pattern */}
        <div className="absolute inset-0 bg-[#e5e5f7]" style={{ opacity: 0.4, backgroundImage: 'repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( #cbd5e155, #cbd5e155 )' }}></div>
        
        {/* Map UI Overlays */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm text-sm font-bold flex items-center z-20">
          <Navigation className="w-4 h-4 mr-2 text-blue-500" />
          Kanpur, UP
        </div>

        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Loader className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        )}

        {!loading && filteredDonations.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="font-bold text-slate-700">No active donations found.</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters!</p>
            </div>
          </div>
        )}

        {/* Map Pins */}
        {filteredDonations.map(donation => {
          const isSelected = selectedDonation?._id === donation._id;
          
          return (
            <div 
              key={donation._id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ top: donation.top, left: donation.left }}
            >
              <button 
                onClick={() => setSelectedDonation(donation)}
                className={`relative group ${isSelected ? 'z-20' : 'z-10'}`}
              >
                {/* Pin Animation */}
                <div className={`absolute -inset-2 bg-${donation.status === 'Urgent' ? 'red' : 'green'}-500/20 rounded-full blur animate-ping`}></div>
                
                {/* Pin Icon */}
                <div className={`relative w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 transition-transform ${
                  isSelected ? 'border-slate-900 scale-110' : donation.status === 'Urgent' ? 'border-red-500 hover:scale-110' : 'border-green-500 hover:scale-110'
                }`}>
                  <MapPin className={`w-6 h-6 ${donation.status === 'Urgent' ? 'text-red-500' : 'text-green-500'}`} />
                </div>
              </button>

              {/* Popup Card */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 z-30">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${donation.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {donation.urgency} Urgency
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1" />{donation.distance}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight mb-1">{donation.title}</h3>
                  <p className="text-sm font-medium text-slate-700 mb-1">{donation.quantityDescription}</p>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{donation.description}</p>
                  <p className="text-xs text-red-500 font-bold mb-4 flex items-center"><Clock className="w-3 h-3 mr-1" /> Pickup by {new Date(donation.pickupTimeLimit).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  
                  <button 
                    onClick={() => handleClaim(donation._id)}
                    disabled={claimingId === donation._id}
                    className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-sm hover:bg-slate-800 flex justify-center items-center disabled:opacity-70"
                  >
                    {claimingId === donation._id ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    {claimingId === donation._id ? 'Claiming...' : 'Claim Donation'}
                  </button>
                  
                  {/* Triangle pointer */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Donations;
