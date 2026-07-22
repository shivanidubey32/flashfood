import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Bell, LogOut, Edit2, 
  Package, IndianRupee, Leaf, Star, Clock, Store, 
  Heart, Download, Camera, Home, Briefcase, Plus,
  Settings, HelpCircle, Moon, ChevronRight, Lock, 
  ShieldCheck, Smartphone, CreditCard, Globe, HeartHandshake, FileText, Trash2, X, CheckCircle, Eye, EyeOff, XCircle, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo.name || '',
    email: userInfo.email || '',
    phoneNumber: userInfo.phone || '',
    address: '123 Tech Park, Kanpur, UP'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [impactData, setImpactData] = useState({
    totalOrders: 0,
    totalSavings: 0,
    mealsRescued: 0,
    rewardPoints: 0
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    dealAlerts: true,
    orderUpdates: true,
    flashSales: false,
    newsletter: false
  });

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Settings States
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // Backwards compatibility for data archive
  const isDarkMode = darkMode;

  // Address Modal State
  const [addressModal, setAddressModal] = useState({ show: false, mode: 'add', id: null, type: '', text: '' });
  
  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  // Settings Modals State
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  
  const [complaintData, setComplaintData] = useState({ subject: '', description: '' });
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  
  // Location Radar Animation State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, scanning, success, error

  useEffect(() => {
    // Check if location is already granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          setLocationGranted(true);
        }
      });
    }
  }, []);

  const handleLocationToggle = () => {
    if (locationGranted) {
      setLocationGranted(false);
    } else {
      setShowLocationModal(true);
      setLocationStatus('idle');
    }
  };

  const requestLocation = () => {
    setLocationStatus('scanning');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setLocationStatus('success');
            setLocationGranted(true);
            setTimeout(() => {
              setShowLocationModal(false);
            }, 2000);
          }, 1500); // Fake delay for the cool animation
        },
        (error) => {
          console.error(error);
          setTimeout(() => {
            setLocationStatus('error');
          }, 1000);
        }
      );
    } else {
      setLocationStatus('error');
    }
  };

  const handleDonatePoints = () => {
    if (impactData.rewardPoints < 100) {
      showToast('You need at least 100 points to donate.', 'error');
      return;
    }
    // Mock donation
    setImpactData(prev => ({ ...prev, rewardPoints: prev.rewardPoints - 100 }));
    setShowDonateModal(false);
    showToast('Successfully donated 100 points! Thank you.');
  };

  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', icon: Home, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-500', isDefault: true, text: '123 Tech Park, Phase 1, Near Metro Station\nKanpur, UP 208016\n+91 9876543210' },
    { id: 2, type: 'Work', icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-200', border: 'border-slate-200', isDefault: false, text: '45 Business Tower, IT Hub\nKanpur, UP 208022\n+91 9123456780' }
  ]);

  const editAddress = (id) => {
    const addr = addresses.find(a => a.id === id);
    if(addr) {
      setAddressModal({ show: true, mode: 'edit', id, type: addr.type, text: addr.text });
    }
  };

  const deleteAddress = (id) => {
    setConfirmModal({
      show: true,
      message: 'Are you sure you want to delete this address?',
      onConfirm: () => {
        setAddresses(addresses.filter(a => a.id !== id));
        setConfirmModal({ show: false, message: '', onConfirm: null });
        showToast('Address deleted successfully.');
      }
    });
  };

  const addNewAddress = () => {
    setAddressModal({ show: true, mode: 'add', id: null, type: 'Other', text: '' });
  };

  const saveAddress = () => {
    if(!addressModal.type || !addressModal.text) return showToast('Please fill all fields', 'error');
    
    if(addressModal.mode === 'edit') {
      setAddresses(addresses.map(a => a.id === addressModal.id ? { ...a, type: addressModal.type, text: addressModal.text } : a));
      showToast('Address updated successfully!');
    } else {
      setAddresses([...addresses, { 
        id: Date.now(), 
        type: addressModal.type, 
        icon: MapPin, 
        color: 'text-slate-600', 
        bg: 'bg-slate-200', 
        border: 'border-slate-200', 
        isDefault: false, 
        text: addressModal.text 
      }]);
      showToast('New address added!');
    }
    setAddressModal({ show: false, mode: 'add', id: null, type: '', text: '' });
  };

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', config);
        setFormData(prev => ({ 
          ...prev, 
          name: data.name, 
          email: data.email, 
          phoneNumber: data.phoneNumber || prev.phoneNumber,
          profilePicture: data.profilePicture || prev.profilePicture
        }));
        
        if (data.notificationPreferences) {
          setNotificationPrefs({
            dealAlerts: data.notificationPreferences.dealAlerts ?? true,
            orderUpdates: data.notificationPreferences.orderUpdates ?? true,
            flashSales: data.notificationPreferences.flashSales ?? false,
            newsletter: data.notificationPreferences.newsletter ?? false
          });
        }
        
        // Fetch stats
        const { data: ordersData } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/orders/myorders', config);
        setOrders(ordersData);
        let meals = 0;
        let money = 0;
        const completedOrders = ordersData.filter(order => order.status === 'Completed' || order.status === 'Ready');
        completedOrders.forEach(order => {
          order.orderItems.forEach(item => {
            meals += item.qty;
          });
          money += order.totalPrice; 
        });

        setImpactData({
          totalOrders: ordersData.length,
          mealsRescued: meals,
          totalSavings: Math.round(money),
          rewardPoints: meals * 25
        });
      } catch (error) {
        console.error("Error fetching profile or stats", error);
      }
    };
    fetchProfile();
  }, [userInfo.token]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      setComplaintLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/complaints', complaintData, config);
      showToast('Complaint submitted successfully. Admin will review it soon.');
      setShowComplaintModal(false);
      setComplaintData({ subject: '', description: '' });
    } catch (error) {
      showToast('Failed to submit complaint', 'error');
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(-10);
      }

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', {
        name: formData.name,
        phoneNumber: cleanPhone
      }, config);
      
      const updatedInfo = { ...userInfo, name: data.name, phone: data.phoneNumber };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      showToast('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match!", 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/auth/profile'), {
        password: passwordData.newPassword,
        currentPassword: passwordData.currentPassword
      }, config);
      
      showToast('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update password.', 'error');
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/upload', formDataUpload, config);
      
      // Update the user profile with the new image URL
      const updateConfig = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', {
        profilePicture: data.image
      }, updateConfig);

      setFormData({ ...formData, profilePicture: data.image });
      
      // Update local storage
      const updatedInfo = { ...userInfo, profilePicture: data.image };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      
      showToast('Profile photo updated successfully!');
    } catch (error) {
      console.error(error);
      showToast('Error uploading photo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async (type, value) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      let payload = {};
      
      if (type === 'push' || type === 'marketing') {
        payload.notificationPreferences = {
          pushNotifications: type === 'push' ? value : pushNotifications,
          promotions: type === 'marketing' ? value : marketingEmails
        };
      } else if (type === 'dark' || type === 'location') {
        payload.customerPreferences = {
          darkMode: type === 'dark' ? value : darkMode,
          locationTracking: type === 'location' ? value : locationGranted
        };
      }

      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', payload, config);
    } catch (error) {
      console.error('Failed to update preference');
    }
  };

  const togglePush = () => {
    setPushNotifications(!pushNotifications);
    handlePreferenceUpdate('push', !pushNotifications);
  };
  
  const toggleMarketing = () => {
    setMarketingEmails(!marketingEmails);
    handlePreferenceUpdate('marketing', !marketingEmails);
  };

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    setDarkMode(!darkMode);
    handlePreferenceUpdate('dark', !darkMode);
  };

  const toggleLocation = () => {
    setLocationGranted(!locationGranted);
    handlePreferenceUpdate('location', !locationGranted);
  };

  const handleNotificationToggle = async (key) => {
    const newPrefs = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(newPrefs);
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', {
        notificationPreferences: newPrefs
      }, config);
      showToast('Notification preferences updated!');
    } catch (error) {
      showToast('Failed to update preferences', 'error');
      // Revert state on error
      setNotificationPrefs(notificationPrefs);
    }
  };

  const handleDownloadData = async () => {
    try {
      showToast('Preparing your data archive...', 'success');
      
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Fetch user's orders
      const { data: ordersData } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/orders/myorders', config);
      
      // Construct the comprehensive data object
      const dataArchive = {
        personal_information: {
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber,
          account_type: userInfo.role
        },
        preferences: {
          notifications: notificationPrefs,
          theme: isDarkMode ? 'dark' : 'light'
        },
        impact_metrics: {
          total_orders: impactData.totalOrders,
          total_savings_inr: impactData.totalSavings,
          meals_rescued: impactData.mealsRescued,
          reward_points: impactData.rewardPoints
        },
        order_history: ordersData
      };
      
      // Convert to JSON and create blob
      const jsonString = JSON.stringify(dataArchive, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashfood_data_${(formData.name || 'user').replace(/\s+/g, '_').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Data downloaded successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Error downloading data.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const tabs = [
    { id: 'personal', icon: User, label: 'Personal Info' },
    { id: 'orders', icon: Package, label: 'Order History' },
    { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
    { id: 'favorites', icon: Heart, label: 'Favorite Stores' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'impact', icon: Leaf, label: 'Rewards & Impact' },
    { id: 'settings', icon: Settings, label: 'Account Settings' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mb-20 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: 'Total Orders', value: impactData.totalOrders.toString(), color: 'text-blue-500', bg: 'bg-blue-100' },
          { icon: IndianRupee, label: 'Total Savings', value: `₹${impactData.totalSavings}`, color: 'text-green-500', bg: 'bg-green-100' },
          { icon: Leaf, label: 'Meals Rescued', value: impactData.mealsRescued.toString(), color: 'text-teal-500', bg: 'bg-teal-100' },
          { icon: Star, label: 'Reward Points', value: impactData.rewardPoints.toString(), color: 'text-amber-500', bg: 'bg-amber-100' }
        ].map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {/* Profile Summary Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-red-500 to-orange-500 opacity-10"></div>
            
            <div className="relative mb-4">
              {formData.profilePicture ? (
                <img 
                  src={((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + formData.profilePicture} 
                  alt={userInfo.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                />
              ) : (
                <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-4xl font-black border-4 border-white shadow-md relative z-10">
                  {userInfo.name ? userInfo.name.charAt(0) : 'U'}
                </div>
              )}
              
              <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-lg z-20 hover:bg-slate-800 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  onChange={uploadFileHandler}
                  className="hidden" 
                  accept="image/*"
                />
              </label>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{userInfo.name}</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Member since {userInfo.joined}</p>
            <span className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
              Active Account
            </span>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden py-2">
            {tabs.map((tab) => (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 cursor-pointer flex items-center transition-colors font-medium border-l-4 ${
                  activeTab === tab.id 
                    ? 'border-red-500 bg-red-50 text-red-600' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-red-500' : 'text-slate-400'}`} />
                {tab.label}
              </div>
            ))}
            <div className="h-px bg-slate-100 my-2 mx-4"></div>
            <div 
              onClick={handleLogout}
              className="px-6 py-4 hover:bg-red-50 cursor-pointer flex items-center text-red-500 font-medium transition-colors border-l-4 border-transparent"
            >
              <LogOut className="w-5 h-5 mr-3" /> Sign Out
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[500px]"
          >
            
            {/* TAB: Personal Info */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                  <button 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`flex items-center font-bold transition-colors px-4 py-2 rounded-xl ${isEditingProfile ? 'text-slate-500 bg-slate-100 hover:text-slate-700' : 'text-red-500 bg-red-50 hover:text-red-600'}`}
                  >
                    {isEditingProfile ? (
                      <>Cancel</>
                    ) : (
                      <><Edit2 className="w-4 h-4 mr-2" /> Edit</>
                    )}
                  </button>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditingProfile}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl font-medium focus:outline-none transition-colors ${isEditingProfile ? 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500' : 'bg-transparent border border-transparent text-slate-800'}`} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        value={formData.email} 
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-medium focus:outline-none cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        value={formData.phoneNumber} 
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        disabled={!isEditingProfile}
                        pattern="[0-9]{10}"
                        maxLength="10"
                        title="Please enter exactly 10 digits"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl font-medium focus:outline-none transition-colors ${isEditingProfile ? 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500' : 'bg-transparent border border-transparent text-slate-800'}`} 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows="2" 
                        disabled={!isEditingProfile}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl font-medium focus:outline-none resize-none transition-colors ${isEditingProfile ? 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500' : 'bg-transparent border border-transparent text-slate-800'}`}
                      ></textarea>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* TAB: Order History */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Order History</h3>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No orders found.</div>
                  ) : orders.map((order, idx) => {
                    let color, bg;
                    switch(order.status) {
                      case 'Completed': color = 'text-green-600'; bg = 'bg-green-100'; break;
                      case 'Cancelled': color = 'text-red-600'; bg = 'bg-red-100'; break;
                      case 'Pending': color = 'text-amber-600'; bg = 'bg-amber-100'; break;
                      case 'Ready': color = 'text-indigo-600'; bg = 'bg-indigo-100'; break;
                      default: color = 'text-blue-600'; bg = 'bg-blue-100';
                    }

                    return (
                      <div key={order._id || idx} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                            <Package className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-900">{order.merchant?.businessName || order.merchant?.name || 'Store'}</h4>
                              <span className="text-xs text-slate-400 font-medium">• {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-500">{order.orderItems.map(i => i.name).join(', ')}</p>
                            <div className="flex items-center mt-2 md:hidden">
                              <span className={`text-xs font-bold px-2 py-1 rounded-md ${bg} ${color}`}>{order.status}</span>
                              <span className="ml-3 font-black text-slate-900">₹{order.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex flex-col items-end">
                          <span className="font-black text-lg text-slate-900">₹{order.totalPrice}</span>
                          <span className={`mt-1 text-xs font-bold px-2.5 py-1 rounded-md ${bg} ${color}`}>{order.status}</span>
                        </div>
                        
                        <div className="w-full md:w-auto mt-4 md:mt-0 flex space-x-2">
                          <button onClick={() => navigate('/customer/orders')} className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-red-500 hover:border-red-200 transition-colors text-center">
                            Track
                          </button>
                          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Saved Addresses</h3>
                  <button onClick={addNewAddress} className="flex items-center text-white font-bold bg-slate-900 hover:bg-slate-800 transition-colors px-4 py-2 rounded-xl shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Add New
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-slate-500">No saved addresses found.</div>
                  ) : addresses.map((addr) => {
                    const Icon = addr.icon;
                    return (
                      <div key={addr.id} className={`p-6 bg-slate-50 rounded-3xl border-2 ${addr.border} relative`}>
                        {addr.isDefault && <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">Default</div>}
                        <div className="flex items-center mb-4">
                          <div className={`w-10 h-10 ${addr.bg} ${addr.color} rounded-full flex items-center justify-center mr-3`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg">{addr.type}</h4>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed whitespace-pre-line">
                          {addr.text}
                        </p>
                        <div className="flex space-x-3">
                          <button onClick={() => editAddress(addr.id)} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">Edit</button>
                          <button onClick={() => deleteAddress(addr.id)} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: Favorite Stores */}
            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Favorite Stores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { name: 'Wok Master', type: 'Chinese', rating: '4.8', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=500' },
                    { name: 'Pizza Paradise', type: 'Italian', rating: '4.5', img: 'https://images.unsplash.com/photo-1574936145840-28808d77a0b6?q=80&w=500' },
                    { name: 'South Indian Delights', type: 'South Indian', rating: '4.9', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500' }
                  ].map((store, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex flex-col">
                      <div className="h-32 relative">
                        <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                        <button className="absolute top-3 right-3 bg-white p-2 rounded-full text-red-500 shadow-md">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{store.name}</h4>
                          <p className="text-sm text-slate-500 font-medium mb-3">{store.type} • ⭐ {store.rating}</p>
                        </div>
                        <button className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors mt-auto">
                          View Active Deals
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'dealAlerts', title: 'Deal Alerts', desc: 'Get notified when new food is listed near you.' },
                    { id: 'orderUpdates', title: 'Order Updates', desc: 'Track your order status and pickup reminders.' },
                    { id: 'flashSales', title: 'Flash Sales', desc: 'Alerts for extreme discounts (80%+ off).' },
                    { id: 'newsletter', title: 'Newsletter', desc: 'Weekly roundup of your impact and savings.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPrefs[item.id]} 
                          onChange={() => handleNotificationToggle(item.id)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Rewards & Impact */}
            {activeTab === 'impact' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Your Impact & Rewards</h3>
                
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mb-8 shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <p className="text-green-400 font-bold mb-1 uppercase tracking-wider text-sm">
                        FlashFood Hero Level {Math.floor(impactData.rewardPoints / 150) + 1}
                      </p>
                      <h4 className="text-4xl font-black mb-2">{impactData.rewardPoints} <span className="text-xl text-slate-400 font-medium">Points</span></h4>
                      <p className="text-slate-400 text-sm">
                        {150 - (impactData.rewardPoints % 150)} points away from Level {Math.floor(impactData.rewardPoints / 150) + 2} Rewards!
                      </p>
                    </div>
                    <div className="mt-6 md:mt-0">
                      <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-colors shadow-lg">
                        Redeem Points
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-8">
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: `${(impactData.rewardPoints % 150) / 150 * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 mb-4 text-lg">Environmental Impact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center">
                    <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                      <Leaf className="w-7 h-7 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Food Saved</p>
                      <p className="text-2xl font-black text-slate-900">{(impactData.mealsRescued * 0.5).toFixed(1)} kg</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                      <Star className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">CO₂ Reduced</p>
                      <p className="text-2xl font-black text-slate-900">{(impactData.mealsRescued * 1.25).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Account Settings */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Account Settings</h3>
                
                <div className="space-y-8">
                  {/* Security Settings */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Security</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div 
                        onClick={() => setShowPasswordModal(true)}
                        className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors"
                      >
                        <div className="flex items-center"><Lock className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Change Password</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><ShieldCheck className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Two-Factor Authentication</span></div>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">Disabled</span>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors">
                        <div className="flex items-center"><Smartphone className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Logged Devices</span></div>
                        <span className="text-xs font-bold text-red-500 hover:underline">Logout all</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Payment Methods</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><CreditCard className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Saved Cards</span></div>
                        <span className="text-sm text-slate-500">2 ending in 4242</span>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors">
                        <div className="flex items-center"><Smartphone className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">UPI IDs</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* App Preferences */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">App Preferences</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><Globe className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Language</span></div>
                        <span className="text-sm text-slate-500 font-medium">English</span>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><Moon className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Dark Mode</span></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={darkMode}
                            onChange={toggleDarkMode}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                        </label>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><Bell className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Push Notifications</span></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pushNotifications}
                            onChange={togglePush}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                        </label>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><Mail className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Marketing Emails</span></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={marketingEmails}
                            onChange={toggleMarketing}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                        </label>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={toggleLocation}>
                        <div className="flex items-center"><MapPin className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Location Permissions</span></div>
                        {locationGranted ? (
                          <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-600 rounded-md">Granted</span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">Request Access</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sustainability & Support */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Sustainability & Support</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div onClick={() => setShowDonateModal(true)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><HeartHandshake className="w-5 h-5 text-teal-500 mr-4" /><span className="font-bold text-slate-700">Donate Reward Points to NGO</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                      <div onClick={() => setShowFAQModal(true)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><HelpCircle className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Help Center & FAQs</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                      <div onClick={() => setShowComplaintModal(true)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><MessageSquare className="w-5 h-5 text-amber-500 mr-4" /><span className="font-bold text-slate-700">Report an Issue</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                      <div onClick={() => setShowTermsModal(true)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors">
                        <div className="flex items-center"><FileText className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Terms & Privacy Policy</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Data & Actions */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Data & Actions</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div onClick={handleDownloadData} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors">
                        <div className="flex items-center"><Download className="w-5 h-5 text-slate-400 mr-4" /><span className="font-bold text-slate-700">Download My Data</span></div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                      <div 
                        onClick={handleLogout}
                        className="p-4 hover:bg-red-50 cursor-pointer flex items-center justify-between border-b border-slate-50 transition-colors"
                      >
                        <div className="flex items-center"><LogOut className="w-5 h-5 text-red-500 mr-4" /><span className="font-bold text-red-600">Logout</span></div>
                      </div>
                      <div className="p-4 hover:bg-red-50 cursor-pointer flex items-center justify-between transition-colors">
                        <div className="flex items-center"><Trash2 className="w-5 h-5 text-red-500 mr-4" /><span className="font-bold text-red-600">Delete Account</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Change Password</h3>
              <p className="text-slate-500 text-sm mb-6">Enter a new secure password for your account.</p>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      required
                      minLength="6"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      minLength="6"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {addressModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setAddressModal({ show: false, mode: 'add', id: null, type: '', text: '' })}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-6">{addressModal.mode === 'edit' ? 'Edit Address' : 'Add New Address'}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Address Label (Home, Work, etc.)</label>
                  <input 
                    type="text" 
                    value={addressModal.type}
                    onChange={(e) => setAddressModal({...addressModal, type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. Gym"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                  <textarea 
                    value={addressModal.text}
                    onChange={(e) => setAddressModal({...addressModal, text: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                    placeholder="Enter complete address..."
                  ></textarea>
                </div>
                
                <button 
                  onClick={saveAddress}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Deletion</h3>
              <p className="text-slate-500 mb-8">{confirmModal.message}</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donate Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowDonateModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Donate Points</h3>
              <p className="text-slate-500 text-sm mb-6">Support partnered NGOs by donating your reward points. 100 points provides 1 fresh meal to someone in need.</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
                <span className="font-bold text-slate-700">Available Balance:</span>
                <span className="font-black text-teal-600 text-lg">{impactData.rewardPoints} Points</span>
              </div>
              
              <button 
                onClick={handleDonatePoints}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
              >
                Donate 100 Points
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <AnimatePresence>
        {showFAQModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowFAQModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-6">Help Center & FAQs</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">How does FlashFood work?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Merchants list their surplus food at a steep discount just before closing. You purchase the food through the app, wait for the designated pickup time, and head to the store to collect your meal.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Are the meals fresh?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Absolutely! All listed food is perfectly good to eat, made on the same day. It's simply surplus food that didn't sell during peak hours.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">What if the merchant cancels my order?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">In the rare event a merchant runs out of food and cancels, you will receive a full refund instantly, along with bonus reward points for the inconvenience.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-6">Terms & Privacy Policy</h3>
              
              <div className="prose prose-sm text-slate-600 max-w-none">
                <h4 className="font-bold text-slate-900">1. Acceptance of Terms</h4>
                <p className="mb-4">By accessing and using FlashFood, you agree to be bound by these Terms of Service. All purchases are final unless canceled by the merchant.</p>
                
                <h4 className="font-bold text-slate-900">2. Privacy Policy</h4>
                <p className="mb-4">We take your privacy seriously. Your personal information, including location data and payment details, is encrypted. We do not sell your data to third parties.</p>
                
                <h4 className="font-bold text-slate-900">3. User Conduct</h4>
                <p className="mb-4">Users agree to show up during the designated pickup window. Failure to pick up food repeatedly may result in account suspension to prevent food waste.</p>
              </div>
              
              <button 
                onClick={() => setShowTermsModal(false)}
                className="w-full mt-8 bg-slate-100 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creative Location Scanner Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {locationStatus === 'idle' && (
                <>
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 relative">
                    <MapPin className="w-10 h-10" />
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full scale-125"></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Enable Location</h3>
                  <p className="text-slate-500 text-sm mb-8">We need your location to scan for the best FlashFood deals near you instantly.</p>
                  <button 
                    onClick={requestLocation}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                  >
                    Sync My Location
                  </button>
                </>
              )}

              {locationStatus === 'scanning' && (
                <div className="py-8 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-2 bg-blue-200 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                      <Globe className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Scanning Satellites...</h3>
                  <p className="text-slate-400 text-sm">Pinpointing your coordinates</p>
                </div>
              )}

              {locationStatus === 'success' && (
                <div className="py-8 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner"
                  >
                    <CheckCircle className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Location Synced!</h3>
                  <p className="text-slate-400 text-sm">You'll now see localized deals.</p>
                </div>
              )}

              {locationStatus === 'error' && (
                <div className="py-8 flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Access Denied</h3>
                  <p className="text-slate-400 text-sm mb-6">Please allow location tracking in your browser popup to continue.</p>
                  <button 
                    onClick={() => setLocationStatus('idle')}
                    className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;
