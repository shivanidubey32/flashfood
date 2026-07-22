import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Leaf, Award, IndianRupee, TreePine, Loader2 } from 'lucide-react';

const Impact = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState({
    mealsSaved: 0,
    moneySaved: 0,
    co2Reduced: 0,
    points: 0
  });

  useEffect(() => {
    const fetchOrdersAndCalculateImpact = async () => {
      try {
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/orders/myorders'), config);
        
        let meals = 0;
        let money = 0;
        
        // Only count completed/picked up orders
        const completedOrders = data.filter(order => order.status === 'Completed' || order.status === 'Ready');
        
        completedOrders.forEach(order => {
          order.orderItems.forEach(item => {
            meals += item.qty;
          });
          // Approximation: they save roughly 50% on average, so money saved is roughly equal to what they paid
          money += order.totalPrice; 
        });

        setImpactData({
          mealsSaved: meals,
          moneySaved: Math.round(money),
          co2Reduced: Number((meals * 2.5).toFixed(1)), // Avg 2.5kg CO2 per meal
          points: meals * 25 // 25 points per meal
        });
      } catch (error) {
        console.error("Error fetching impact data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndCalculateImpact();
  }, [userInfo.token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Calculating your impact...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Impact</h1>
          <p className="text-slate-500 font-medium">See how you're helping the planet, {userInfo.name?.split(' ')[0] || 'Food Saver'}.</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-500/30 relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 text-white/10">
            <Award className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="font-bold text-green-50 mb-1">Meals Saved</p>
            <h2 className="text-5xl font-black">{impactData.mealsSaved}</h2>
            <p className="text-sm text-green-100 mt-4 font-medium">Top 15% of users this month!</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6 text-blue-500" />
          </div>
          <p className="font-bold text-slate-500 mb-1">Money Saved</p>
          <h2 className="text-4xl font-black text-slate-900">₹{impactData.moneySaved}</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
            <TreePine className="w-6 h-6 text-teal-500" />
          </div>
          <p className="font-bold text-slate-500 mb-1">CO₂ Emissions Prevented</p>
          <h2 className="text-4xl font-black text-slate-900">{impactData.co2Reduced} <span className="text-xl text-slate-400 font-bold">kg</span></h2>
        </motion.div>
      </div>

      {/* Gamification / Badges Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Your Achievements</h3>
            <p className="text-sm text-slate-500 mt-1">Unlock badges by saving more food.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-orange-500">{impactData.points}</span>
            <span className="text-sm font-bold text-slate-400 ml-1">pts</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-200 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/30 mb-3">
              <span className="text-2xl">🌱</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">First Rescue</p>
            <p className="text-xs text-slate-500 mt-1">Unlocked</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-300 to-red-400 rounded-full flex items-center justify-center shadow-lg shadow-red-400/30 mb-3">
              <span className="text-2xl">🔥</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">3 Day Streak</p>
            <p className="text-xs text-slate-500 mt-1">Unlocked</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 opacity-50 grayscale">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">Local Hero</p>
            <p className="text-xs text-slate-500 mt-1">50 Meals (Locked)</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 opacity-50 grayscale">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🌍</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">Earth Saver</p>
            <p className="text-xs text-slate-500 mt-1">100kg CO2 (Locked)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
