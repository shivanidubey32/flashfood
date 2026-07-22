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

        // rough estimate: 1 meal = 1 quantity unit in order items
        const mealsSaved = orders.reduce((sum, o) => sum + o.orderItems.reduce((acc, item) => acc + item.qty, 0), 0);
        
        // Average Rating
        let averageRating = 0;
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
          averageRating = (sum / reviews.length).toFixed(1);
        }

        // Repeat Customers
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
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-600 mt-1">Understand your business at a glance.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Active Listings', value: stats.activeListings, icon: Package, color: 'text-blue-600 bg-blue-100' },
          { title: 'Orders Today', value: stats.ordersToday, icon: ShoppingBag, color: 'text-purple-600 bg-purple-100' },
          { title: 'Revenue Today', value: `₹${stats.revenueToday}`, icon: Banknote, color: 'text-emerald-600 bg-emerald-100' },
          { title: 'Revenue This Month', value: `₹${stats.revenueMonth}`, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
          { title: 'Meals Saved', value: stats.mealsSaved, icon: Leaf, color: 'text-teal-600 bg-teal-100' },
          { title: 'Donations Made', value: stats.donationsMade, icon: HeartHandshake, color: 'text-rose-600 bg-rose-100' },
          { title: 'Average Rating', value: stats.averageRating || '0.0', icon: Star, color: 'text-yellow-600 bg-yellow-100' },
          { title: 'Repeat Customers', value: `${stats.repeatCustomers}%`, icon: Users, color: 'text-orange-600 bg-orange-100' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default"
          >
            <div className={`p-4 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
