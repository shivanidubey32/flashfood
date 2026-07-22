import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader } from 'lucide-react';

const Analytics = () => {
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

  if (loading) return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-2">Deep dive into platform usage, revenue generation, and order volume.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Volume Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Daily Order Volume</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Growth (₹)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <p className="text-sm font-bold text-slate-400">Total Orders (All Time)</p>
          <h3 className="text-3xl font-black mt-2">{stats?.totalOrders || 0}</h3>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <p className="text-sm font-bold text-slate-400">Total Platform Revenue</p>
          <h3 className="text-3xl font-black mt-2 text-amber-400">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <p className="text-sm font-bold text-slate-400">Avg Order Value</p>
          <h3 className="text-3xl font-black mt-2">₹{(stats?.totalRevenue / (stats?.totalOrders || 1)).toFixed(0)}</h3>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <p className="text-sm font-bold text-slate-400">Conversion Rate</p>
          <h3 className="text-3xl font-black mt-2">8.4%</h3>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
