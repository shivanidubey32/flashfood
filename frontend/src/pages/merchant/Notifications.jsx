import { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Package, Clock, X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Notifications = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Broadcast Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

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

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    try {
      setIsBroadcasting(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(
        ((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/notifications/broadcast', 
        { title: broadcastTitle, message: broadcastMessage }, 
        config
      );
      
      setBroadcastSuccess('Broadcast sent successfully to all Customers and NGOs!');
      setBroadcastTitle('');
      setBroadcastMessage('');
      
      setTimeout(() => {
        setBroadcastSuccess('');
        setIsModalOpen(false);
      }, 3000);
      
    } catch (error) {
      console.error(error);
      alert('Failed to send broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'System':
      case 'urgent': return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'New_Donation':
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Merchant_Broadcast': return <MessageSquare className="w-6 h-6 text-orange-500" />;
      default: return <Package className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">Stay updated on orders, inventory, and donations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
            New Broadcast
          </button>
          <button onClick={markAllRead} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Mark all read</button>
          <button onClick={clearAll} className="px-4 py-2 bg-[#d2642b] text-white rounded-xl text-sm font-bold hover:bg-[#b85422] transition-colors shadow-md shadow-[#d2642b]/20">Clear all</button>
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'System' ? 'bg-red-100' : notif.type === 'New_Donation' ? 'bg-green-100' : notif.type === 'Merchant_Broadcast' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  {getIcon(notif.type)}
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

      {/* Broadcast Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl text-[#d2642b]">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Send Broadcast</h2>
                      <p className="text-sm text-slate-500 font-medium">Notify all Customers & NGOs instantly</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSendBroadcast}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Notification Title</label>
                      <input 
                        type="text" 
                        required
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="e.g. Flash Sale: 50% off all pastries!" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d2642b] focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                      <textarea 
                        required
                        rows="4"
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder="Type your message here..." 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d2642b] focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <AnimatePresence>
                    {broadcastSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 text-sm font-bold flex items-center gap-2 overflow-hidden"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {broadcastSuccess}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isBroadcasting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#d2642b] text-white rounded-xl font-bold hover:bg-[#b85422] transition-colors shadow-lg shadow-[#d2642b]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isBroadcasting ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isBroadcasting ? 'Sending...' : 'Send Broadcast'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Notifications;
