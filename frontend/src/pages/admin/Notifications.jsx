import { useState } from 'react';
import axios from 'axios';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/notifications'), { title, message }, config);
      
      setSuccess(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Failed to send notification broadcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Notifications</h1>
          <p className="text-slate-500 mt-2">Broadcast announcements, flash alerts, and system updates to all users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Send className="w-5 h-5 mr-2 text-amber-500" /> Compose Broadcast
          </h2>
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center text-sm font-bold border border-green-200">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
              Broadcast sent successfully to all users!
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Notification Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. System Maintenance Update"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message Body</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none h-32 resize-none"
                placeholder="Enter your announcement details here..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-amber-500/20 transition-all ${
                loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400'
              }`}
            >
              {loading ? 'Broadcasting...' : 'Send Global Broadcast'}
            </button>
          </form>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-xl font-bold mb-6 flex items-center relative z-10">
            <Bell className="w-5 h-5 mr-2 text-amber-400" /> Broadcast Preview
          </h2>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">FlashFood System</p>
                <p className="text-xs text-slate-400">Just now</p>
              </div>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">{title || 'Your Title Here'}</h3>
            <p className="text-slate-300 text-sm whitespace-pre-line">
              {message || 'The notification message body will appear here. Users will receive this in their notification tray instantly.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
