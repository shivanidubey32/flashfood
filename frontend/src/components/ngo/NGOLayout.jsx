import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  PackageCheck, 
  AlertTriangle, 
  Users, 
  Building2, 
  UserPlus, 
  BarChart3, 
  Megaphone, 
  MessageSquare, 
  FileText, 
  UserCircle, 
  Bell,
  LogOut,
  Leaf
} from 'lucide-react';

const NGOLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const navItems = [
    { name: 'Overview', path: '/dashboard/ngo/overview', icon: LayoutDashboard },
    { name: 'Available Food', path: '/dashboard/ngo/donations', icon: MapPin },
    { name: 'Pickups', path: '/dashboard/ngo/pickups', icon: PackageCheck },
    { name: 'Food Requests', path: '/dashboard/ngo/requests', icon: AlertTriangle },
    { name: 'Beneficiaries', path: '/dashboard/ngo/beneficiaries', icon: Users },
    { name: 'Partners', path: '/dashboard/ngo/partners', icon: Building2 },
    { name: 'Volunteers', path: '/dashboard/ngo/volunteers', icon: UserPlus },
    { name: 'Analytics', path: '/dashboard/ngo/analytics', icon: BarChart3 },
    { name: 'Campaigns', path: '/dashboard/ngo/campaigns', icon: Megaphone },
    { name: 'Chat', path: '/dashboard/ngo/chat', icon: MessageSquare },
    { name: 'Reports', path: '/dashboard/ngo/reports', icon: FileText },
    { name: 'Profile', path: '/dashboard/ngo/profile', icon: UserCircle },
    { name: 'Notifications', path: '/dashboard/ngo/notifications', icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-black tracking-tight">FlashFood</span>
          </Link>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 ml-1">NGO Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === '/dashboard/ngo/overview' && location.pathname === '/dashboard/ngo');
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-8 py-3 transition-colors ${
                  isActive 
                    ? 'bg-slate-800 text-white border-r-4 border-green-500 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold">
              {userInfo.name ? userInfo.name[0] : 'N'}
            </div>
            <div>
              <p className="font-bold text-sm truncate w-32">{userInfo.name || 'Helping Hands'}</p>
              <p className="text-xs text-slate-400 truncate w-32">{userInfo.email || 'ngo@flashfood.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold w-full p-2 rounded-lg hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default NGOLayout;
