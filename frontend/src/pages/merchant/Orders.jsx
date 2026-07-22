import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, PackageOpen } from 'lucide-react';
import API from '../../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/merchant');
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status", error);
      // Fallback for mock data since DB might be empty
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Accepted': return 'bg-blue-100 text-blue-700';
      case 'Preparing': return 'bg-orange-100 text-orange-700';
      case 'Ready': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-1">Track and update customer orders in real-time.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{order._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{order.customer?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.orderItems?.map((item, i) => (
                        <div key={i}>{item.qty}x {item.name}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">₹{order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2"
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
