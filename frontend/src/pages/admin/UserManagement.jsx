import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShieldAlert, ShieldCheck, MoreVertical, Loader } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/admin/users?role=Customer'), config);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/admin/block/${userId}`, {}, config);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-slate-500 mt-2">Monitor all registered customers, block suspicious accounts, and view activity.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Registered Customers</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-2 text-amber-500" />
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="font-bold">No customers found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black mr-4 uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {user.isBlocked ? (
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center w-max">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Suspended
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold flex items-center w-max">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => toggleBlockStatus(user._id, user.isBlocked)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                          user.isBlocked 
                            ? 'bg-slate-900 text-white hover:bg-slate-800' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
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

export default UserManagement;
