import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader, Receipt, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null, actionLabel: '' });

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

  const updateOrderStatus = (orderId, newStatus) => {
    setConfirmModal({
      show: true,
      message: `Are you sure you want to mark this order as ${newStatus}?`,
      actionLabel: `Mark ${newStatus}`,
      onConfirm: async () => {
        setConfirmModal({ show: false, message: '', onConfirm: null, actionLabel: '' });
        try {
          const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/orders/${orderId}/status`, { status: newStatus }, config);
          fetchOrders();
          showToast(`Order marked as ${newStatus}!`);
        } catch (error) {
          showToast('Failed to update status', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Action</h3>
              <p className="text-slate-500 mb-8">{confirmModal.message}</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, message: '', onConfirm: null, actionLabel: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors shadow-lg ${
                    confirmModal.actionLabel.includes('Cancel')
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                      : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                  }`}
                >
                  {confirmModal.actionLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Monitoring</h1>
          <p className="text-slate-500 mt-2">Track all active and past transactions across the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">All Transactions</h2>
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
                  <th className="p-4 pl-6">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Merchant</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black mr-4">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 font-mono text-sm">#{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                          <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700 text-sm">{order.customer?.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700 text-sm">{order.merchant?.businessName || order.merchant?.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-green-600">₹{order.totalPrice}</p>
                      <p className="text-xs text-slate-400">{order.isPaid ? 'Paid' : 'Unpaid'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold w-max ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {order.status === 'Pending' && (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" /> Cancel
                          </button>
                        </div>
                      )}
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
