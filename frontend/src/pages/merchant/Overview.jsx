import { 
  Package, 
  ShoppingBag, 
  Banknote, 
  TrendingUp, 
  Leaf, 
  HeartHandshake, 
  Star, 
  Users 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import API from '../../api/axios';

const Overview = () => {
  const [stats, setStats] = useState({
    activeListings: 0,
    ordersToday: 0,
    revenueToday: 0,
    revenueMonth: 0,
    mealsSaved: 0,
    donationsMade: 0,
    averageRating: 0,
    repeatCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [listingsRes, ordersRes, donationsRes, reviewsRes] = await Promise.all([
          API.get('/listings/merchant/my-listings'),
          API.get('/orders/merchant'),
          API.get('/donations/merchant'),
          API.get(`/reviews/merchant/${userInfo._id}`)
        ]);

        const listings = listingsRes.data;
        const orders = ordersRes.data;
        const donations = donationsRes.data;
        const reviews = reviewsRes.data;

        const activeListingsCount = listings.filter(l => l.status === 'Available').length;
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const currentMonth = new Date().getMonth();

        const ordersToday = orders.filter(o => new Date(o.createdAt) >= today);
        const revenueToday = ordersToday.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        
        const ordersMonth = orders.filter(o => new Date(o.createdAt).getMonth() === currentMonth);
        const revenueMonth = ordersMonth.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        const mealsSaved = orders.reduce((sum, o) => sum + o.orderItems.reduce((acc, item) => acc + item.qty, 0), 0);
        
        let averageRating = 0;
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
          averageRating = (sum / reviews.length).toFixed(1);
        }

        const customerCounts = {};
        orders.forEach(o => {
          if (o.customer) {
            const custId = typeof o.customer === 'object' ? o.customer._id : o.customer;
            customerCounts[custId] = (customerCounts[custId] || 0) + 1;
          }
        });
        const totalUniqueCustomers = Object.keys(customerCounts).length;
        const repeatCount = Object.values(customerCounts).filter(count => count > 1).length;
        let repeatPercentage = 0;
        if (totalUniqueCustomers > 0) {
          repeatPercentage = Math.round((repeatCount / totalUniqueCustomers) * 100);
        }

        setStats({
          activeListings: activeListingsCount,
          ordersToday: ordersToday.length,
          revenueToday: revenueToday,
          revenueMonth: revenueMonth,
          mealsSaved: mealsSaved,
          donationsMade: donations.length,
          averageRating: averageRating,
          repeatCustomers: repeatPercentage
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 lg:-m-8 p-6 sm:p-8 lg:p-12 overflow-hidden flex flex-col justify-center">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop" 
          alt="Delicious Food Background" 
          className="w-full h-full object-cover scale-105"
        />
        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-900/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content (Glassmorphism) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Welcome back, <span className="text-orange-500">{userInfo.name?.split(' ')[0] || 'Merchant'}</span>!
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-2xl">
            Here is your command center. Check your latest performance metrics and continue rescuing delicious food.
          </p>
        </motion.div>

        {/* Hero Glass Panel (Primary Metrics) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Revenue */}
          <div className="col-span-1 md:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl hover:bg-white/15 transition-colors">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Banknote className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-slate-300 font-medium uppercase tracking-wider text-sm">Today's Revenue</h3>
              </div>
              <p className="text-5xl md:text-7xl font-black text-white">₹{stats.revenueToday}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span><strong className="text-white">₹{stats.revenueMonth}</strong> earned this month</span>
              </div>
            </div>
          </div>

          {/* Active Listings & Orders */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col justify-center shadow-xl hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-300 font-medium uppercase tracking-wider text-xs">Active Listings</h3>
                <div className="p-1.5 bg-blue-500/20 rounded-md">
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{stats.activeListings}</p>
            </div>
            
            <div className="flex-1 bg-orange-500/20 backdrop-blur-md border border-orange-500/30 rounded-3xl p-6 flex flex-col justify-center shadow-xl hover:bg-orange-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-orange-200 font-medium uppercase tracking-wider text-xs">Orders Today</h3>
                <div className="p-1.5 bg-orange-500/40 rounded-md">
                  <ShoppingBag className="w-4 h-4 text-orange-200" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{stats.ordersToday}</p>
            </div>
          </div>
        </motion.div>

        {/* Secondary Glass Panels Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { title: 'Meals Saved', value: stats.mealsSaved, icon: Leaf, color: 'text-teal-400', bg: 'bg-teal-500/20' },
            { title: 'Donations', value: stats.donationsMade, icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-500/20' },
            { title: 'Avg Rating', value: stats.averageRating || '0.0', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
            { title: 'Repeat Cust.', value: `${stats.repeatCustomers}%`, icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/20' }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col items-center text-center shadow-lg hover:bg-white/10 transition-colors"
            >
              <div className={`p-3 rounded-full ${stat.bg} mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <h3 className="text-slate-400 font-medium text-xs md:text-sm uppercase tracking-wide">{stat.title}</h3>
            </div>
          ))}
        </motion.div>
        
      </div>
    </div>
  );
};

export default Overview;
