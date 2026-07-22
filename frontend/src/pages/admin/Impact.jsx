import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, Globe2, Leaf, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

const Impact = () => {
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

  if (loading) return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  // Calculate rough CO2 emission reduction (e.g., 2.5kg CO2 saved per kg of food)
  const co2Saved = (stats?.totalFoodSaved * 2.5).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <Globe2 className="w-8 h-8 mr-3 text-emerald-500" /> Global Impact Tracking
          </h1>
          <p className="text-slate-500 mt-2">Measure the environmental and social difference FlashFood is making.</p>
        </div>
      </div>

      {/* Hero Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-lg border border-emerald-400/30 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <Leaf className="w-8 h-8 mb-4 text-emerald-100" />
          <p className="text-emerald-100 font-bold uppercase tracking-wider text-xs mb-1">Total Food Saved</p>
          <h3 className="text-5xl font-black">{stats?.totalFoodSaved || 0} <span className="text-2xl font-bold text-emerald-200">kg</span></h3>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-8 rounded-3xl shadow-lg border border-orange-400/30 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <Heart className="w-8 h-8 mb-4 text-orange-100" />
          <p className="text-orange-100 font-bold uppercase tracking-wider text-xs mb-1">Meals Distributed</p>
          <h3 className="text-5xl font-black">{stats?.mealsRescued || 0}</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-lg border border-blue-400/30 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <Globe2 className="w-8 h-8 mb-4 text-blue-100" />
          <p className="text-blue-100 font-bold uppercase tracking-wider text-xs mb-1">CO₂ Emissions Prevented</p>
          <h3 className="text-5xl font-black">{co2Saved} <span className="text-2xl font-bold text-blue-200">kg</span></h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Food Distribution Breakdown</h2>
        <div className="h-64 flex">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={stats?.impactDistribution || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(stats?.impactDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="w-1/2 flex flex-col justify-center gap-4">
            {(stats?.impactDistribution || []).map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="font-bold text-slate-700">{item.name}</span>
                <span className="ml-auto text-slate-500 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
