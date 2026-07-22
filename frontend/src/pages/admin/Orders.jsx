import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader, Receipt, AlertCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/orders'), config);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Update order status to ${status}?`)) return;
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-2">Track all active customer orders, intervene in disputes, or cancel fraudulent activity.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Platform Orders</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search Order ID..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-2 text-amber-500" />
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="font-bold">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Merchant</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-sm font-bold text-slate-700">#{order._id.substring(18)}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">
                      {order.customer?.name || 'Unknown'}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">
                      {order.merchant?.businessName || order.merchant?.name || 'Unknown'}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{order.totalPrice}
                      <span className={`block text-[10px] ${order.isPaid ? 'text-green-500' : 'text-amber-500'}`}>
                        {order.isPaid ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold w-max ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'Completed')}
                            className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-bold transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {order.status !== 'Cancelled' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'Cancelled')}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-bold transition-colors flex items-center"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
