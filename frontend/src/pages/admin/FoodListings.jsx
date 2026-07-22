import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader, Trash2, Package } from 'lucide-react';

const FoodListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/listings'), config);
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/listings/${id}`, config);
      fetchListings();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Food Listings Management</h1>
          <p className="text-slate-500 mt-2">Monitor all active and expired food listings across the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Platform Listings</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search title or merchant..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-2 text-amber-500" />
              <p>Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="font-bold">No food listings found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Item Details</th>
                  <th className="p-4">Merchant</th>
                  <th className="p-4">Inventory</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      {listing.image ? (
                        <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{listing.title}</p>
                        <p className="text-xs text-slate-500">₹{listing.discountedPrice} <span className="line-through text-slate-300">₹{listing.originalPrice}</span></p>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">
                      {listing.merchant?.businessName || listing.merchant?.name || 'Unknown'}
                    </td>
                    <td className="p-4 text-sm">
                      {listing.quantityAvailable} units
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold w-max ${
                        listing.status === 'Available' ? 'bg-green-50 text-green-600' :
                        listing.status === 'Sold Out' ? 'bg-blue-50 text-blue-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => deleteListing(listing._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Remove Listing"
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
  );
};

export default FoodListings;
