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
          src="https://img.magnific.com/free-photo/top-view-arrangement-with-salad-boxes-sauce_23-2148247882.jpg?semt=ais_hybrid&w=740&q=80" 
          alt="Food Background" 
          className="w-full h-full object-cover scale-105"
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Welcome back, <span className="text-orange-400">{userInfo.name?.split(' ')[0] || 'Merchant'}</span>!
          </h1>
          <p className="text-slate-200 font-medium text-lg">
            Here is your command center. Check your latest performance metrics and continue rescuing delicious food.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
        
        <div className="space-y-4">
          
          {/* Revenue */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Today's Revenue</p>
                <p className="text-sm text-slate-500 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
                  <span>₹{stats.revenueMonth} earned this month</span>
                </p>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 ml-14 sm:ml-0">
              ₹{stats.revenueToday}
            </div>
          </div>

          {/* Active Listings */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Active Listings</p>
                <p className="text-sm text-slate-500">Currently available food items</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.activeListings}
            </div>
          </div>

          {/* Orders Today */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Orders Today</p>
                <p className="text-sm text-slate-500">Total orders received today</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.ordersToday}
            </div>
          </div>

          {/* Meals Saved */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Meals Saved</p>
                <p className="text-sm text-slate-500">Total food items rescued</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.mealsSaved}
            </div>
          </div>

          {/* Donations */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Donations Made</p>
                <p className="text-sm text-slate-500">Food given to NGOs</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.donationsMade}
            </div>
          </div>

          {/* Average Rating */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Average Rating</p>
                <p className="text-sm text-slate-500">Customer feedback score</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 flex items-center">
              {stats.averageRating} <Star className="w-4 h-4 ml-1 text-yellow-500 fill-current" />
            </div>
          </div>

          {/* Repeat Customers */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Repeat Customers</p>
                <p className="text-sm text-slate-500">Percentage of returning buyers</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.repeatCustomers}%
            </div>
          </div>

        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Overview;
