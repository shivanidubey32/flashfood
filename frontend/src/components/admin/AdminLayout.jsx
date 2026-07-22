import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Building2, 
  UtensilsCrossed, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Bell, 
  MessageSquareWarning, 
  Globe2, 
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const navItems = [
    { name: 'Overview', path: '/dashboard/admin/overview', icon: LayoutDashboard },
    { name: 'Users', path: '/dashboard/admin/users', icon: Users },
    { name: 'Restaurants', path: '/dashboard/admin/restaurants', icon: Store },
    { name: 'NGOs', path: '/dashboard/admin/ngos', icon: Building2 },
    { name: 'Food Listings', path: '/dashboard/admin/listings', icon: UtensilsCrossed },
    { name: 'Orders', path: '/dashboard/admin/orders', icon: ShoppingCart },
    { name: 'Pickups', path: '/dashboard/admin/pickups', icon: Truck },
    { name: 'Analytics', path: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/dashboard/admin/notifications', icon: Bell },
    { name: 'Feedback', path: '/dashboard/admin/feedback', icon: MessageSquareWarning },
    { name: 'Impact', path: '/dashboard/admin/impact', icon: Globe2 },
    { name: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-black text-white flex flex-col shadow-2xl relative z-20 shrink-0">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-none">FlashFood</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Admin Console</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Management</p>
          {navItems.slice(0, 7).map((item) => {
            const isActive = location.pathname.includes(item.path) || 
                             (item.path === '/dashboard/admin/overview' && location.pathname === '/dashboard/admin');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : ''}`} />
                {item.name}
              </Link>
            );
          })}

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4">System</p>
          {navItems.slice(7).map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 text-white font-black">
              A
            </div>
            <div>
              <p className="font-bold text-sm text-white truncate w-40">{userInfo.name || 'System Admin'}</p>
              <p className="text-xs text-slate-400 truncate w-40">{userInfo.email || 'admin@flashfood.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-slate-50 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
