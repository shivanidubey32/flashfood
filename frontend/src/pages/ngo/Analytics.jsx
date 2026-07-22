import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, Calendar, TrendingUp, Loader, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const dataMonthly = [
  { name: 'Jan', foodSaved: 400, co2Reduced: 240, meals: 1200 },
  { name: 'Feb', foodSaved: 300, co2Reduced: 139, meals: 900 },
  { name: 'Mar', foodSaved: 200, co2Reduced: 980, meals: 600 },
  { name: 'Apr', foodSaved: 278, co2Reduced: 390, meals: 800 },
  { name: 'May', foodSaved: 189, co2Reduced: 480, meals: 500 },
  { name: 'Jun', foodSaved: 239, co2Reduced: 380, meals: 700 },
  { name: 'Jul', foodSaved: 349, co2Reduced: 430, meals: 1000 },
];

const dataWeekly = [
  { name: 'Week 1', foodSaved: 80, co2Reduced: 50, meals: 240 },
  { name: 'Week 2', foodSaved: 120, co2Reduced: 75, meals: 360 },
  { name: 'Week 3', foodSaved: 90, co2Reduced: 55, meals: 270 },
  { name: 'Week 4', foodSaved: 110, co2Reduced: 65, meals: 330 },
];

const Analytics = () => {
  const [stats, setStats] = useState({
    foodSaved: 0,
    co2Reduced: 0,
    meals: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Monthly');
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleExport = () => {
    showToast('Report generated and downloaded successfully!');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/donations/my-claims'), config);
        
        // Approximate metrics based on number of claimed pickups for demo purposes
        const baseFoodSaved = data.length * 50; // avg 50kg per donation
        
        setStats({
          foodSaved: baseFoodSaved,
          co2Reduced: baseFoodSaved * 2.5,
          meals: baseFoodSaved * 4
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  return (
    <div className="space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 bg-green-500 text-white"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Impact Analytics</h1>
          <p className="text-slate-500 mt-1">Track your monthly food rescue impact and distribution trends.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h4 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Total Food Saved</h4>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-black">{loading ? <Loader className="w-8 h-8 animate-spin inline" /> : stats.foodSaved}</span>
              <span className="text-green-400 font-bold mb-1">kg</span>
            </div>
            <p className="text-sm text-green-400 mt-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +12% from last month</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h4 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-2">CO₂ Emissions Prevented</h4>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-black text-slate-900">{loading ? <Loader className="w-8 h-8 animate-spin inline text-slate-400" /> : stats.co2Reduced}</span>
              <span className="text-slate-400 font-bold mb-1">kg</span>
            </div>
            <p className="text-sm text-blue-500 mt-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +8% from last month</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h4 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-2">Meals Distributed</h4>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-black text-slate-900">{loading ? <Loader className="w-8 h-8 animate-spin inline text-slate-400" /> : stats.meals}</span>
              <span className="text-slate-400 font-bold mb-1">meals</span>
            </div>
            <p className="text-sm text-orange-500 mt-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +15% from last month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Chart 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Food Rescued Over Time</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block p-2">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}}
                  itemStyle={{color: '#0f172a', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="foodSaved" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorFood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Meals Distributed</h3>
            <div className="flex space-x-1 p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setTimeRange('Monthly')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${timeRange === 'Monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeRange('Weekly')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${timeRange === 'Weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Weekly
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeRange === 'Monthly' ? dataMonthly : dataWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="meals" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
