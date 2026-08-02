import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
    } else {
      setUserInfo(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!userInfo) return '/login';
    if (userInfo.role === 'Merchant') return '/dashboard/merchant';
    if (userInfo.role === 'NGO') return '/dashboard/ngo';
    return '/customer/explore';
  };

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "text-[#c4563a] font-bold transition-colors border-b-2 border-[#c4563a] pb-1" 
      : "text-slate-600 hover:text-[#c4563a] font-medium transition-colors pb-1 border-b-2 border-transparent";
  };

  return (
    <nav className="glass fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-24 h-auto" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className={getLinkClass('/explore')}>Explore</Link>
            <Link to="/about" className={getLinkClass('/about')}>About Us</Link>
            <Link to="/partner" className={getLinkClass('/partner')}>Partner with us</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            
            {userInfo ? (
              <div className="flex items-center space-x-3">
                <Link to={getDashboardLink()} className="flex items-center space-x-2 text-slate-700 hover:text-[#c4563a] font-bold transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-[#c4563a] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 bg-[#c4563a] text-white px-4 py-2 rounded-full hover:bg-[#a94a32] transition-colors shadow-lg shadow-[#c4563a]/30">
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-slate-600 hover:text-[#c4563a] p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
