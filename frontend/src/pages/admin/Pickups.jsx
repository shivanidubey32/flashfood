import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader, Truck, Navigation2 } from 'lucide-react';

const Pickups = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/donations'), config);
      setDonations(data);
    } catch (error) {
      console.error('Failed to load donations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Donation Pickups</h1>
          <p className="text-slate-500 mt-2">Monitor food donation requests and track NGO pickup assignments.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Active Donations</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search donations..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-2 text-amber-500" />
              <p>Loading donations...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="font-bold">No donations found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Donation Item</th>
                  <th className="p-4">Merchant (Donor)</th>
                  <th className="p-4">Assigned NGO</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-slate-900">{donation.title}</p>
                      <p className="text-xs text-slate-500">{donation.quantityDescription} • {donation.category}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">
                      {donation.merchant?.businessName || donation.merchant?.name || 'Unknown'}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {donation.claimedBy ? (
                        <span className="text-indigo-600 flex items-center"><Navigation2 className="w-3 h-3 mr-1"/> {donation.claimedBy.name}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(donation.pickupTimeLimit).toLocaleString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold w-max ml-auto block ${
                        donation.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        donation.status === 'Available' ? 'bg-amber-50 text-amber-600' :
                        donation.status === 'Claimed' ? 'bg-blue-50 text-blue-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {donation.status === 'Claimed' ? 'In Transit' : donation.status}
                      </span>
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

export default Pickups;
