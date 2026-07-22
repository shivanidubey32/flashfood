import { Users, Building2, Store, ShoppingCart, Globe2, Leaf, Heart, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/stats'), config);
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10">Loading admin stats...</div>;
  if (!stats) return <div className="p-10 text-red-500">Failed to load admin dashboard. Ensure you have admin privileges.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
        <p className="text-slate-500 mt-2">Monitor global activity and system health across FlashFood.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">TOTAL USERS</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{stats.totalCustomers}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-600 font-bold mt-4 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +{stats.growth?.customers || 0} new this week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">RESTAURANTS</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{stats.totalMerchants}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-600 font-bold mt-4 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +{stats.growth?.merchants || 0} new this week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">REGISTERED NGOs</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{stats.totalNGOs}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-600 font-bold mt-4 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +{stats.growth?.ngos || 0} new this week</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-amber-500">TOTAL REVENUE</p>
              <h3 className="text-3xl font-black mt-2">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-sm text-amber-400 font-bold mt-4 flex items-center relative z-10"><TrendingUp className="w-4 h-4 mr-1" /> {stats.growth?.revenue || 0}% from last 7 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6">Food Rescue Impact</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="waste" stroke="#10b981" fill="#d1fae5" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6">Platform Revenue</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#fef3c7" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
