import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  MapPin, 
  LogOut,
  Clock,
  X,
  Crosshair,
  CheckCircle,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Logo from '../Logo';

const CustomerLayout = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Notifications State
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (userInfo.token) {
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/notifications`, config);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Location State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Kanpur, UP');

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [isLocating, setIsLocating] = useState(false);

  const handleLocationSelect = (city) => {
    setCurrentLocation(city);
    setShowLocationModal(false);
    showToast(`Location updated to ${city}`);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using Nominatim (free, no API key required)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          // Extract city/town/village
          const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Unknown Location';
          
          setCurrentLocation(city);
          setShowLocationModal(false);
          showToast(`Location updated to ${city}`);
        } catch (error) {
          console.error("Geocoding failed:", error);
          showToast('Failed to determine city name.', 'error');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        showToast('Please enable location permissions.', 'error');
        setIsLocating(false);
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const MobileNavLink = ({ to, icon: Icon, label }) => (
    <NavLink 
      to={to} 
      className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-red-500' : 'text-slate-500 hover:text-slate-900'}`}
    >
      <div className="relative">
        <Icon className="w-6 h-6" />
        {label === 'Cart' && cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-16 md:pt-20 pb-16 md:pb-0">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[120] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900">Select Location</h3>
                  <button 
                    onClick={() => setShowLocationModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search your city..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-shadow"
                  />
                </div>

                <button 
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mb-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Crosshair className={`w-5 h-5 mr-3 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Locating...' : 'Use Current Location'}
                </button>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Popular Cities</p>
                  <div className="space-y-1">
                    {['Kanpur, UP', 'Lucknow, UP', 'Delhi, NCR', 'Mumbai, MH', 'Bangalore, KA'].map((city) => (
                      <button 
                        key={city}
                        onClick={() => handleLocationSelect(city)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors font-medium ${
                          currentLocation === city ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Navbar (Sticky) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/customer/explore" className="flex items-center space-x-2">
                <Logo className="w-10 h-10" />
                <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent tracking-tight">
                  FlashFood
                </span>
              </NavLink>
              
              {/* Location Picker (Dynamic) */}
              <div 
                onClick={() => setShowLocationModal(true)}
                className="hidden md:flex items-center ml-8 text-sm text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-full cursor-pointer border border-slate-100 transition-colors"
              >
                <MapPin className="w-4 h-4 text-red-500 mr-2" />
                <span className="font-semibold text-slate-900 border-b border-slate-900 border-dashed mr-1">{currentLocation}</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/customer/explore" className={({isActive}) => `flex items-center font-semibold text-sm transition-colors ${isActive ? 'text-red-500' : 'text-slate-600 hover:text-slate-900'}`}>
                <Search className="w-4 h-4 mr-1.5" /> Explore
              </NavLink>
              <NavLink to="/customer/wishlist" className={({isActive}) => `flex items-center font-semibold text-sm transition-colors ${isActive ? 'text-red-500' : 'text-slate-600 hover:text-slate-900'}`}>
                <Heart className="w-4 h-4 mr-1.5" /> Wishlist
              </NavLink>
              <NavLink to="/customer/orders" className={({isActive}) => `flex items-center font-semibold text-sm transition-colors ${isActive ? 'text-red-500' : 'text-slate-600 hover:text-slate-900'}`}>
                <Clock className="w-4 h-4 mr-1.5" /> Orders
              </NavLink>
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                  className="relative p-2 text-slate-700 hover:text-red-500 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotificationsMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">{unreadCount} new</span>}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">No notifications yet.</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif._id} 
                          onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                          className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-red-50/30' : 'opacity-70'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                            {!notif.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <NavLink to="/customer/cart" className="relative p-2 text-slate-700 hover:text-red-500 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center cursor-pointer border-2 border-white shadow-sm overflow-hidden"
                >
                  {userInfo.profilePicture ? (
                    <img 
                      src={userInfo.profilePicture.startsWith('http') ? userInfo.profilePicture : (((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + userInfo.profilePicture)} 
                      alt={userInfo.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : userInfo.name ? (
                    <span className="font-bold text-slate-700">{userInfo.name.charAt(0)}</span>
                  ) : (
                    <User className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-900 truncate">{userInfo.name || 'Customer'}</p>
                      <p className="text-xs text-slate-500 truncate">{userInfo.email || 'customer@email.com'}</p>
                    </div>
                    <NavLink to="/customer/profile" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-500 transition-colors">
                      My Profile
                    </NavLink>
                    <NavLink to="/customer/impact" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-500 transition-colors">
                      My Impact Stats
                    </NavLink>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center mt-1 border-t border-slate-50">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Header Icons */}
            <div className="md:hidden flex items-center space-x-4 relative">
              <button onClick={() => setShowNotificationsMenu(!showNotificationsMenu)} className="relative p-2 text-slate-700">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute 0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotificationsMenu && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">{unreadCount} new</span>}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">No notifications yet.</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif._id} 
                        onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                        className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-red-50/30' : 'opacity-70'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                          {!notif.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              <NavLink to="/customer/cart" className="relative p-2 text-slate-700">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute 0 right-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <MobileNavLink to="/customer/explore" icon={Search} label="Explore" />
          <MobileNavLink to="/customer/wishlist" icon={Heart} label="Wishlist" />
          <MobileNavLink to="/customer/orders" icon={Clock} label="Orders" />
          <MobileNavLink to="/customer/profile" icon={User} label="Profile" />
        </div>
      </nav>

      {/* Overlay for mobile profile menu if needed (not strict for bottom nav) */}
    </div>
  );
};

export default CustomerLayout;
