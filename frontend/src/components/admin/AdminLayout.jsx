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
import Breadcrumbs from '../Breadcrumbs';

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
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      
      {/* Top Header */}
      <header className="bg-gradient-to-r from-slate-900 to-black text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-md z-30 shrink-0 border-b border-white/5">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white block leading-none">FlashFood</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Admin Console</span>
          </div>
        </Link>
        
        {/* Profile & Logout */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="font-bold text-sm text-white truncate max-w-[120px]">{userInfo.name || 'System Admin'}</p>
              <p className="text-xs text-slate-400 truncate max-w-[120px]">{userInfo.email || 'admin@flashfood.com'}</p>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 text-white font-black">
              A
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Horizontal Navigation */}
      <nav className="bg-slate-900 border-b border-white/10 px-4 sm:px-8 z-20 shrink-0 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2 py-3 min-w-max">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path) || 
                             (item.path === '/dashboard/admin/overview' && location.pathname === '/dashboard/admin');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm whitespace-nowrap ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-slate-50 relative">
        <Breadcrumbs className="mb-6" />
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;
