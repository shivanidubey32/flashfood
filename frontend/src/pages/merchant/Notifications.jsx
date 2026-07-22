import { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Package, Clock, X } from 'lucide-react';

import axios from 'axios';

const Notifications = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/notifications', config);
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [userInfo.token]);

  const markAllRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/notifications/read-all', {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) { console.error(error); }
  };

  const clearAll = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/notifications/clear-all', config);
      setNotifications([]);
    } catch (error) { console.error(error); }
  };

  const removeNotification = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/notifications/${id}`, config);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) { console.error(error); }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'urgent': return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Package className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">Stay updated on orders, inventory, and donations.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Mark all read</button>
          <button onClick={clearAll} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">Clear all</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div key={notif._id} className={`p-6 flex items-start gap-4 transition-colors relative group ${notif.isRead ? 'bg-white' : 'bg-orange-50/50'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'System' ? 'bg-red-100' : notif.type === 'New_Donation' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {getIcon(notif.type === 'System' ? 'urgent' : notif.type === 'New_Donation' ? 'success' : 'order')}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h3>
                    <span className="text-xs text-slate-400 font-bold flex items-center"><Clock className="w-3 h-3 mr-1" />{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-500 text-sm pr-8">{notif.message}</p>
                </div>
                <button 
                  onClick={() => removeNotification(notif._id)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Notifications;
