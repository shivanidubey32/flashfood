import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Compass,
  ChevronDown
} from 'lucide-react';
import Logo from '../Logo';

const MerchantLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard/merchant/overview', icon: LayoutDashboard },
    { name: 'My Listings', path: '/dashboard/merchant/listings', icon: Package },
    { name: 'Orders', path: '/dashboard/merchant/orders', icon: ShoppingBag },
    { name: 'Donations', path: '/dashboard/merchant/donations', icon: HeartHandshake },
    { name: 'Analytics', path: '/dashboard/merchant/analytics', icon: BarChart3 },
    { name: 'Reviews', path: '/dashboard/merchant/reviews', icon: Star },
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
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-orange-50 text-orange-600 font-bold shadow-sm' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0 shrink-0">
        
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-600 hover:text-orange-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <Link to="/dashboard/merchant/overview" className="flex items-center gap-3">
            <Logo className="w-12 h-auto hidden sm:block" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              FlashFood <span className="text-orange-600">Biz</span>
            </h1>
          </Link>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Quick Actions (Hidden on tiny screens) */}
          <div className="hidden sm:flex items-center gap-3 border-r border-slate-200 pr-6">
            <Link to="/explore" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
              <Compass className="w-4 h-4" />
              <span>Market</span>
            </Link>
            <Link to="/dashboard/merchant/add" className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-md shadow-orange-600/20 hover:-translate-y-0.5">
              <PlusCircle className="w-4 h-4" />
              <span>Add Listing</span>
            </Link>
          </div>

          {/* Notifications */}
          <Link to="/dashboard/merchant/notifications" className="relative p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center font-bold shadow-inner">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900 truncate">{userInfo.name || 'Merchant User'}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{userInfo.email || 'business@email.com'}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link 
                      to="/dashboard/merchant/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link 
                      to="/dashboard/merchant/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-slate-100">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Layout Body */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <aside className={`
          absolute inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Main Menu</div>
            {navItems.map((item) => <NavItem key={item.name} item={item} />)}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative h-[calc(100vh-5rem)]">
          {/* Mobile Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>
          
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;
