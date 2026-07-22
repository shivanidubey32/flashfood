import { useState, useEffect } from 'react';
import { PlusCircle, Package, TrendingUp, Clock, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';

const MerchantDashboard = () => {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cooked Food',
    originalPrice: '',
    discountedPrice: '',
    quantityAvailable: '',
    expiryTime: '',
  });

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/listings', formData);
      setListings([data, ...listings]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Cooked Food',
        originalPrice: '',
        discountedPrice: '',
        quantityAvailable: '',
        expiryTime: '',
      });
    } catch (error) {
      console.error("Failed to add listing", error);
      alert(error.response?.data?.message || 'Failed to add listing');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Merchant Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your food listings and orders.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Revenue', value: '₹14,500', icon: TrendingUp, color: 'text-green-600 bg-green-100' },
          { title: 'Active Listings', value: listings.length, icon: Package, color: 'text-blue-600 bg-blue-100' },
          { title: 'Orders Today', value: '12', icon: FileText, color: 'text-purple-600 bg-purple-100' },
          { title: 'Food Saved (kg)', value: '45', icon: PlusCircle, color: 'text-orange-600 bg-orange-100' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Listings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Your Active Listings</h3>
        </div>
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
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">Loading listings...</td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">No active listings yet. Add one to get started!</td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                    <td className="px-6 py-4 text-slate-500 line-through">₹{item.originalPrice}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{item.discountedPrice}</td>
                    <td className="px-6 py-4 text-slate-600">{item.quantityAvailable}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-400" /> 
                      {new Date(item.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{item.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Add New Listing</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Food Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="e.g. Veg Burger Combo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea name="description" required value={formData.description} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Brief description of the food..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Original Price (₹)</label>
                    <input type="number" name="originalPrice" required value={formData.originalPrice} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Discounted Price (₹)</label>
                    <input type="number" name="discountedPrice" required value={formData.discountedPrice} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Quantity Available</label>
                    <input type="number" name="quantityAvailable" required value={formData.quantityAvailable} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Expiry Time</label>
                    <input type="datetime-local" name="expiryTime" required value={formData.expiryTime} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                  Post Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MerchantDashboard;
