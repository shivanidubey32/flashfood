import { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Package, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem('ngo_notifications')) || [
      { id: 1, type: 'urgent', title: 'Urgent Pickup Required', text: '50 Meals expiring in 2 hours at Grand Hotel Banquet.', time: '10 mins ago', read: false },
      { id: 2, type: 'success', title: 'Pickup Completed', text: 'Volunteer Rahul successfully picked up 15kg vegetables from Fresh Supermarket.', time: '2 hours ago', read: true },
      { id: 3, type: 'info', title: 'New Partner Registered', text: 'City Bakery has joined your network.', time: 'Yesterday', read: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ngo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const clearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared.');
  };

  const getIcon = (type) => {
    switch(type) {
      case 'urgent': return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Package className="w-6 h-6 text-blue-500" />;
    }
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
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with real-time alerts and activities.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Mark all read</button>
          <button onClick={clearAll} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">Clear all</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-6 flex items-start gap-4 transition-colors ${notif.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'urgent' ? 'bg-red-100' : notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h3>
                    <span className="text-xs text-slate-400 font-bold flex items-center"><Clock className="w-3 h-3 mr-1" />{notif.time}</span>
                  </div>
                  <p className="text-slate-500 text-sm">{notif.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Notifications;
