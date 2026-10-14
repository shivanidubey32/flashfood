import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Truck, 
  Users, 
  Building2, 
  UserPlus, 
  BarChart3, 
  Megaphone, 
  MessageSquare, 
  FileText, 
  UserCircle, 
  Bell,
  ChevronRight,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';

const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ volunteers: 0, pickups: 0 });
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const [volRes, pickRes] = await Promise.all([
          axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/volunteers'), config).catch(() => ({ data: [] })),
          axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/donations/my-claims'), config).catch(() => ({ data: [] }))
        ]);

        setStats({
          volunteers: volRes.data.length,
          pickups: pickRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const MenuItem = ({ icon: Icon, label, path, border = true }) => (
    <div 
      onClick={() => navigate(path)}
      className={`px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors ${border ? 'border-b border-slate-100' : ''}`}
    >
      <div className="flex items-center text-slate-700">
        <Icon className="w-5 h-5 mr-4 text-slate-400 stroke-[1.5]" />
        <span className="text-[15px]">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 stroke-[2]" />
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Top NGO Card (Dark Theme) */}
      <div className="bg-[#1c1c1c] rounded-[24px] mb-6 shadow-md relative overflow-hidden text-white mt-2 mx-1">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-500/10 to-transparent opacity-50"></div>
        
        <div className="p-5 flex justify-between items-start relative z-10 pt-6">
           <div className="flex items-center space-x-5">
             <div className="relative">
                 {userInfo.profilePicture ? (
                   <img 
                     src={userInfo.profilePicture.startsWith('http') ? userInfo.profilePicture : (((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + userInfo.profilePicture)} 
                     alt={userInfo.name} 
                     className="w-[72px] h-[72px] rounded-full object-cover border-2 border-amber-300 shadow-sm"
                   />
                 ) : (
                   <img 
                     src="https://images.unsplash.com/photo-1593113565694-c8f1f0d3a5a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                     alt="NGO Profile" 
                     className="w-[72px] h-[72px] rounded-full object-cover border-2 border-amber-300 shadow-sm"
                   />
                 )}
             </div>
             <div className="flex flex-col justify-center">
               <h2 className="text-[22px] font-semibold text-white tracking-wide truncate w-48">{userInfo.name || 'NGO Organization'}</h2>
               <button onClick={() => navigate('/dashboard/ngo/profile')} className="text-[13px] text-white/90 font-medium flex items-center mt-1">
                 Manage Profile <ChevronRight className="w-3 h-3 ml-0.5" />
               </button>
             </div>
           </div>
        </div>
        
        <div className="mt-2 bg-[#262626] px-5 py-3.5 flex items-center justify-between relative z-10">
           <div className="flex items-center">
             <div className="w-7 h-7 bg-gradient-to-br from-amber-200 to-orange-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <Users className="w-4 h-4 text-amber-950" />
             </div>
             <span className="font-medium text-orange-50 text-[15px] tracking-wide">Volunteers Active</span>
           </div>
           <div className="px-3 py-1 bg-[#3a281c] rounded-full text-[13px] font-medium text-orange-100 border border-orange-500/20 flex items-center">
             <span>{stats.volunteers} total</span>
           </div>
        </div>
      </div>

      {/* Main List Sections */}
      <div className="bg-white rounded-[24px] shadow-sm mb-8 overflow-hidden pt-4 pb-2 mx-1 border border-slate-100">
        
        {/* Core Operations */}
        <div className="flex items-center space-x-3 mb-2 px-5 mt-2">
          <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
          <h3 className="font-medium text-slate-800 text-lg">Core Operations</h3>
        </div>
        <div className="px-1">
           <MenuItem icon={MapPin} label="Available Food" path="/dashboard/ngo/donations" />
           <MenuItem icon={Truck} label="Manage Pickups" path="/dashboard/ngo/pickups" />
           <MenuItem icon={AlertTriangle} label="Food Requests" path="/dashboard/ngo/requests" />
           <MenuItem icon={Users} label="Beneficiaries" path="/dashboard/ngo/beneficiaries" border={false} />
        </div>

        <div className="h-2 bg-slate-50 w-full my-2"></div>

        {/* Network & Team */}
        <div className="flex items-center space-x-3 mb-2 px-5 mt-4">
          <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
          <h3 className="font-medium text-slate-800 text-lg">Network & Team</h3>
        </div>
        <div className="px-1">
           <MenuItem icon={Building2} label="Food Partners" path="/dashboard/ngo/partners" />
           <MenuItem icon={UserPlus} label="Volunteers Team" path="/dashboard/ngo/volunteers" />
           <MenuItem icon={Megaphone} label="Campaigns" path="/dashboard/ngo/campaigns" />
           <MenuItem icon={MessageSquare} label="Messages & Chat" path="/dashboard/ngo/chat" border={false} />
        </div>

        <div className="h-2 bg-slate-50 w-full my-2"></div>

        {/* More */}
        <div className="flex items-center space-x-3 mb-2 px-5 mt-4">
          <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
          <h3 className="font-medium text-slate-800 text-lg">System</h3>
        </div>
        <div className="px-1">
           <MenuItem icon={BarChart3} label="Analytics" path="/dashboard/ngo/analytics" />
           <MenuItem icon={FileText} label="Reports" path="/dashboard/ngo/reports" />
           <MenuItem icon={Bell} label="Notifications" path="/dashboard/ngo/notifications" />
           <MenuItem icon={UserCircle} label="NGO Profile" path="/dashboard/ngo/profile" />
           <div 
            onClick={handleLogout}
            className={`px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors`}
          >
            <div className="flex items-center text-red-600">
              <LogOut className="w-5 h-5 mr-4 stroke-[1.5]" />
              <span className="text-[15px] font-medium">Log out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
