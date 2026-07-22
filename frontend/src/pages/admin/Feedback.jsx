import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader, MessageSquareWarning, CheckCircle2 } from 'lucide-react';

const Feedback = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/complaints'), config);
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const resolveComplaint = async (id) => {
    const response = window.prompt("Enter resolution note (optional):");
    if (response === null) return; // cancelled

    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/complaints/${id}/resolve`, {
        status: 'Resolved',
        adminResponse: response
      }, config);
      fetchComplaints();
    } catch (error) {
      alert('Failed to resolve complaint');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Feedback & Complaints</h1>
          <p className="text-slate-500 mt-2">Manage user feedback, resolve disputes, and respond to support tickets.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Support Tickets</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-2 text-amber-500" />
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <MessageSquareWarning className="w-12 h-12 text-slate-200 mb-3" />
              <p className="font-bold">Inbox zero! No active complaints.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="p-6 hover:bg-slate-50 transition-colors flex gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {complaint.status === 'Resolved' ? <CheckCircle2 className="w-6 h-6" /> : <MessageSquareWarning className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{complaint.subject}</h3>
                        <p className="text-xs font-bold text-slate-400">
                          Reported by: <span className="text-slate-600">{complaint.user?.name}</span> ({complaint.user?.role}) • {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        complaint.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mt-3 bg-white p-4 rounded-xl border border-slate-100 shadow-inner">
                      {complaint.description}
                    </p>
                    
                    {complaint.adminResponse && (
                      <div className="mt-3 ml-8 p-3 bg-amber-50 rounded-xl border border-amber-100 relative">
                        <div className="absolute top-4 -left-3 w-3 h-[2px] bg-amber-200"></div>
                        <p className="text-xs font-bold text-amber-700 mb-1">Admin Response</p>
                        <p className="text-sm text-amber-900">{complaint.adminResponse}</p>
                      </div>
                    )}

                    {complaint.status !== 'Resolved' && (
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => resolveComplaint(complaint._id)}
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
