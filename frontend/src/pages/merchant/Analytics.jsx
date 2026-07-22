import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

import { useState, useEffect } from 'react';
import API from '../../api/axios';

const Analytics = () => {
  const [data, setData] = useState([
    { name: 'Mon', revenue: 0, orders: 0, wasteSaved: 0 },
    { name: 'Tue', revenue: 0, orders: 0, wasteSaved: 0 },
    { name: 'Wed', revenue: 0, orders: 0, wasteSaved: 0 },
    { name: 'Thu', revenue: 0, orders: 0, wasteSaved: 0 },
    { name: 'Fri', revenue: 0, orders: 0, wasteSaved: 0 },
    { name: 'Sat', revenue: 0, orders: 0, wasteSaved: 0 },
    { name: 'Sun', revenue: 0, orders: 0, wasteSaved: 0 },
  ]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: orders } = await API.get('/orders/merchant');
        
        // Let's dynamically map orders to days of the current week
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let updatedData = [
          { name: 'Mon', revenue: 0, orders: 0, wasteSaved: 0 },
          { name: 'Tue', revenue: 0, orders: 0, wasteSaved: 0 },
          { name: 'Wed', revenue: 0, orders: 0, wasteSaved: 0 },
          { name: 'Thu', revenue: 0, orders: 0, wasteSaved: 0 },
          { name: 'Fri', revenue: 0, orders: 0, wasteSaved: 0 },
          { name: 'Sat', revenue: 0, orders: 0, wasteSaved: 0 },
          { name: 'Sun', revenue: 0, orders: 0, wasteSaved: 0 },
        ];

        orders.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const dayName = days[orderDate.getDay()];
          const dayData = updatedData.find(d => d.name === dayName);
          if (dayData) {
            dayData.revenue += (order.totalPrice || 0);
            dayData.orders += 1;
            dayData.wasteSaved += order.orderItems.reduce((acc, item) => acc + item.qty * 0.5, 0); // approx 0.5kg per item
          }
        });
        
        setData(updatedData);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-600 mt-1">Track your revenue and ecological impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Revenue (₹)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Orders Fulfilled</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Saved Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Food Waste Prevented (KG)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="wasteSaved" stroke="#16a34a" strokeWidth={3} dot={{r: 6, fill: '#16a34a'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
