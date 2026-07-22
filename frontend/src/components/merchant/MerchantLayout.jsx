import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  HeartHandshake, 
  BarChart3, 
  Star, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Compass
} from 'lucide-react';

const MerchantLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const navItems = [
    { name: 'Overview', path: '/dashboard/merchant/overview', icon: LayoutDashboard },
    { name: 'My Listings', path: '/dashboard/merchant/listings', icon: Package },
    { name: 'Add Listing', path: '/dashboard/merchant/add', icon: PlusCircle },
    { name: 'Orders', path: '/dashboard/merchant/orders', icon: ShoppingBag },
    { name: 'Donations', path: '/dashboard/merchant/donations', icon: HeartHandshake },
    { name: 'Analytics', path: '/dashboard/merchant/analytics', icon: BarChart3 },
    { name: 'Reviews', path: '/dashboard/merchant/reviews', icon: Star },
    { name: 'Notifications', path: '/dashboard/merchant/notifications', icon: Bell },
  ];

  const bottomNavItems = [
    { name: 'Explore Market', path: '/explore', icon: Compass },
    { name: 'Profile', path: '/dashboard/merchant/profile', icon: User },
    { name: 'Settings', path: '/dashboard/merchant/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-orange-50 text-orange-600 font-semibold' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900">Merchant Portal</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            FlashFood Biz
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-4">Main Menu</div>
          {navItems.map((item) => <NavItem key={item.name} item={item} />)}
          
          <div className="mt-8 mb-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-4">Preferences</div>
          </div>
          {bottomNavItems.map((item) => <NavItem key={item.name} item={item} />)}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              {userInfo.name ? userInfo.name.charAt(0) : 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{userInfo.name || 'Merchant'}</p>
              <p className="text-xs text-slate-500 truncate">{userInfo.email || 'business@email.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-slate-600 hover:text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full md:w-auto h-screen relative">
        {/* We use an overlay to close mobile menu if clicked outside */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* Render child routes here */}
        <Outlet />
      </main>
    </div>
  );
};

export default MerchantLayout;
