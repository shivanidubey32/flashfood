import { Package, Users, Activity, TrendingUp, ChevronRight, Loader, MapPin, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    pickups: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const [volRes, pickRes] = await Promise.all([
          axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/volunteers'), config).catch(() => ({ data: [] })),
          axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/donations/my-claims'), config).catch(() => ({ data: [] }))
        ]);

        setStats({
          volunteers: volRes.data.length,
          pickups: pickRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const impactStats = [
    { label: 'Total Volunteers', value: loading ? <Loader className="animate-spin w-6 h-6" /> : stats.volunteers, icon: Users, color: 'text-blue-500' },
    { label: 'My Pickups', value: loading ? <Loader className="animate-spin w-6 h-6" /> : stats.pickups, icon: Package, color: 'text-orange-500' },
    { label: 'Platform Activity', value: 'Active', icon: Activity, color: 'text-green-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Here is what is happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {impactStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-4 bg-slate-50 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold mb-4 text-slate-900">Quick Actions</h3>
           <p className="text-slate-500 mb-6">Easily manage your daily operations from here.</p>
           
           <div className="space-y-4">
             <button 
                onClick={() => navigate('/ngo/donations')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between transition-colors group"
             >
               <div className="flex items-center">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                   <MapPin className="w-6 h-6 text-green-500" />
                 </div>
                 <div className="text-left">
                   <p className="font-bold text-slate-900">Find Donations</p>
                   <p className="text-sm text-slate-500">View live map of available food</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
             </button>

             <button 
                onClick={() => navigate('/ngo/pickups')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between transition-colors group"
             >
               <div className="flex items-center">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                   <Truck className="w-6 h-6 text-orange-500" />
                 </div>
                 <div className="text-left">
                   <p className="font-bold text-slate-900">Manage Pickups</p>
                   <p className="text-sm text-slate-500">View your claimed donations</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
             </button>
             
             <button 
                onClick={() => navigate('/ngo/volunteers')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between transition-colors group"
             >
               <div className="flex items-center">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                   <Users className="w-6 h-6 text-blue-500" />
                 </div>
                 <div className="text-left">
                   <p className="font-bold text-slate-900">Team</p>
                   <p className="text-sm text-slate-500">Add or manage volunteers</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
