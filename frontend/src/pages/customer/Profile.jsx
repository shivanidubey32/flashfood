import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Bell, LogOut, Edit2, 
  Package, IndianRupee, Leaf, Star, Clock, Store, 
  Heart, Download, Camera, Home, Briefcase, Plus,
  Settings, HelpCircle, Moon, ChevronRight, Lock, 
  ShieldCheck, Smartphone, CreditCard, Globe, HeartHandshake, FileText, Trash2, X, CheckCircle, Eye, EyeOff, XCircle, MessageSquare, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');

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

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isDarkMode = darkMode;

  const [addressModal, setAddressModal] = useState({ show: false, mode: 'add', id: null, type: '', text: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  
  const [complaintData, setComplaintData] = useState({ subject: '', description: '' });
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle');

  useEffect(() => {
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
          }, 1500);
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
    if(addr) setAddressModal({ show: true, mode: 'edit', id, type: addr.type, text: addr.text });
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

  const addNewAddress = () => setAddressModal({ show: true, mode: 'add', id: null, type: 'Other', text: '' });

  const saveAddress = () => {
    if(!addressModal.type || !addressModal.text) return showToast('Please fill all fields', 'error');
    if(addressModal.mode === 'edit') {
      setAddresses(addresses.map(a => a.id === addressModal.id ? { ...a, type: addressModal.type, text: addressModal.text } : a));
      showToast('Address updated successfully!');
    } else {
      setAddresses([...addresses, { id: Date.now(), type: addressModal.type, icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-200', border: 'border-slate-200', isDefault: false, text: addressModal.text }]);
      showToast('New address added!');
    }
    setAddressModal({ show: false, mode: 'add', id: null, type: '', text: '' });
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
        
        const { data: ordersData } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/orders/myorders', config);
        setOrders(ordersData);
        let meals = 0;
        let money = 0;
        const completedOrders = ordersData.filter(order => order.status === 'Completed' || order.status === 'Ready');
        completedOrders.forEach(order => {
          order.orderItems.forEach(item => { meals += item.qty; });
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
      if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) cleanPhone = cleanPhone.slice(-10);

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
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return showToast("Passwords do not match!", 'error');
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
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/upload', formDataUpload, config);
      
      const updateConfig = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', { profilePicture: data.image }, updateConfig);

      setFormData({ ...formData, profilePicture: data.image });
      const updatedInfo = { ...userInfo, profilePicture: data.image };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      showToast('Profile photo updated successfully!');
    } catch (error) {
      showToast('Error uploading photo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setLoading(true);
      const updateConfig = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', { profilePicture: '' }, updateConfig);

      setFormData({ ...formData, profilePicture: '' });
      const updatedInfo = { ...userInfo, profilePicture: '' };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      showToast('Profile photo removed successfully!');
    } catch (error) {
      showToast('Error removing photo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async (type, value) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      let payload = {};
      
      if (type === 'push' || type === 'marketing') {
        payload.notificationPreferences = { pushNotifications: type === 'push' ? value : pushNotifications, promotions: type === 'marketing' ? value : marketingEmails };
      } else if (type === 'dark' || type === 'location') {
        payload.customerPreferences = { darkMode: type === 'dark' ? value : darkMode, locationTracking: type === 'location' ? value : locationGranted };
      }

      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', payload, config);
    } catch (error) {
      console.error('Failed to update preference');
    }
  };

  const togglePush = () => { setPushNotifications(!pushNotifications); handlePreferenceUpdate('push', !pushNotifications); };
  const toggleMarketing = () => { setMarketingEmails(!marketingEmails); handlePreferenceUpdate('marketing', !marketingEmails); };
  const toggleDarkMode = () => { document.documentElement.classList.toggle('dark-theme'); setDarkMode(!darkMode); handlePreferenceUpdate('dark', !darkMode); };
  const toggleLocation = () => { setLocationGranted(!locationGranted); handlePreferenceUpdate('location', !locationGranted); };

  const handleNotificationToggle = async (key) => {
    const newPrefs = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(newPrefs);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', { notificationPreferences: newPrefs }, config);
      showToast('Notification preferences updated!');
    } catch (error) {
      showToast('Failed to update preferences', 'error');
      setNotificationPrefs(notificationPrefs);
    }
  };

  const handleDownloadData = async () => {
    try {
      showToast('Preparing your data archive...', 'success');
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: ordersData } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/orders/myorders', config);
      
      const dataArchive = {
        personal_information: { name: formData.name, email: formData.email, phone: formData.phoneNumber, account_type: userInfo.role },
        preferences: { notifications: notificationPrefs, theme: isDarkMode ? 'dark' : 'light' },
        impact_metrics: { total_orders: impactData.totalOrders, total_savings_inr: impactData.totalSavings, meals_rescued: impactData.mealsRescued, reward_points: impactData.rewardPoints },
        order_history: ordersData
      };
      
      const jsonString = JSON.stringify(dataArchive, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashfood_data_${(formData.name || 'user').replace(/\s+/g, '_').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Data downloaded successfully!', 'success');
    } catch (error) {
      showToast('Error downloading data.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const MenuItem = ({ icon: Icon, label, onClick, border = true }) => (
    <div 
      onClick={onClick}
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
    <div className="w-full px-4 py-8 mb-20 relative bg-slate-50 min-h-[80vh]">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs 
        className="mb-4 max-w-4xl mx-auto"
        items={
          activeTab === 'menu' 
            ? [{ label: 'Home', path: '/' }, { label: 'My Profile' }]
            : [
                { label: 'Home', path: '/' }, 
                { label: 'My Profile', path: '/customer/profile' },
                { 
                  label: activeTab === 'personal' ? 'Personal Details' : 
                         activeTab === 'addresses' ? 'Saved Addresses' :
                         activeTab === 'orders' ? 'Order History' :
                         activeTab === 'impact' ? 'Impact & Rewards' :
                         activeTab === 'favorites' ? 'Favorite Stores' :
                         activeTab === 'settings' ? 'App Settings' : activeTab 
                }
              ]
        }
      />

      {/* Main Menu View */}
      {activeTab === 'menu' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Top Profile Card */}
          <div className="bg-[#1c1c1c] rounded-[24px] mb-6 shadow-md relative overflow-hidden text-white mx-1 mt-2">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-500/10 to-transparent opacity-50"></div>
            
            <div className="p-5 flex justify-between items-start relative z-10 pt-6">
               <div className="flex items-center space-x-5">
                 <div className="relative">
                   {formData.profilePicture ? (
                     <img 
                       src={formData.profilePicture.startsWith('http') ? formData.profilePicture : (((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + formData.profilePicture)} 
                       alt={userInfo.name} 
                       className="w-[72px] h-[72px] rounded-full object-cover border-2 border-amber-200/50"
                     />
                   ) : (
                     <div className="w-[72px] h-[72px] bg-gradient-to-br from-amber-50 to-amber-200 text-amber-700 rounded-full flex items-center justify-center text-3xl font-medium shadow-inner">
                       {userInfo.name ? userInfo.name.charAt(0) : 'U'}
                     </div>
                   )}
                 </div>
                 <div className="flex flex-col justify-center">
                   <h2 className="text-[22px] font-semibold text-white tracking-wide">{userInfo.name}</h2>
                   <button onClick={() => setActiveTab('personal')} className="text-[13px] text-white/90 font-medium flex items-center mt-1">
                     Edit profile <ChevronRight className="w-3 h-3 ml-0.5" />
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Main List Sections */}
          <div className="bg-white rounded-[24px] shadow-sm mb-8 overflow-hidden pt-4 pb-2 mx-1">
            {/* Section 1: Food Rescue & Impact */}
            <div className="flex items-center space-x-3 mb-2 px-5 mt-2">
              <div className="w-1 h-5 bg-green-700 rounded-full"></div>
              <h3 className="font-medium text-slate-800 text-lg">Your Activity</h3>
            </div>
            <div className="px-1">
               <MenuItem icon={Package} label="Your Order History" onClick={() => setActiveTab('orders')} />
               <MenuItem icon={Leaf} label="Your Impact & Rewards" onClick={() => setActiveTab('impact')} />
               <MenuItem icon={MapPin} label="Saved Addresses" onClick={() => setActiveTab('addresses')} />
               <MenuItem icon={Heart} label="Favorite Stores" onClick={() => setActiveTab('favorites')} border={false} />
            </div>

            <div className="h-2 bg-slate-50 w-full my-2"></div>

            {/* Section 2: More */}
            <div className="flex items-center space-x-3 mb-2 px-5 mt-4">
              <div className="w-1 h-5 bg-green-700 rounded-full"></div>
              <h3 className="font-medium text-slate-800 text-lg">More</h3>
            </div>
            <div className="px-1">
               <MenuItem icon={HelpCircle} label="Online Ordering Help" onClick={() => setShowFAQModal(true)} />
               <MenuItem icon={MessageSquare} label="Send Feedback" onClick={() => setShowComplaintModal(true)} />
               <MenuItem icon={Settings} label="App Settings" onClick={() => setActiveTab('settings')} />
               <MenuItem icon={FileText} label="Terms & Privacy Policy" onClick={() => setShowTermsModal(true)} />
               <MenuItem icon={LogOut} label="Log out" onClick={handleLogout} border={false} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Subviews */}
      {activeTab !== 'menu' && (
         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
           <button onClick={() => setActiveTab('menu')} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-bold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 inline-flex">
             <ArrowLeft className="w-4 h-4 mr-2" /> Back
           </button>
           
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[500px]">
             {/* Render activeTab content exactly as it was */}
             {activeTab === 'personal' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                  <button 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`flex items-center font-bold transition-colors px-4 py-2 rounded-xl ${isEditingProfile ? 'text-slate-500 bg-slate-100 hover:text-slate-700' : 'text-red-500 bg-red-50 hover:text-red-600'}`}
                  >
                    {isEditingProfile ? <>Cancel</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit</>}
                  </button>
                </div>
                
                <div className="mb-6 flex justify-center">
                  <div className="relative inline-block">
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture.startsWith('http') ? formData.profilePicture : (((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + formData.profilePicture)} alt={userInfo.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10" />
                    ) : (
                      <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-4xl font-black border-4 border-white shadow-md relative z-10">
                        {userInfo.name ? userInfo.name.charAt(0) : 'U'}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-lg z-20 hover:bg-slate-800 transition-colors cursor-pointer">
                      <Camera className="w-4 h-4" />
                      <input type="file" onChange={uploadFileHandler} className="hidden" accept="image/*" />
                    </label>
                    {formData.profilePicture && (
                      <button 
                        onClick={handleRemoveImage} 
                        className="absolute bottom-0 left-0 bg-red-500 text-white p-2 rounded-full shadow-lg z-20 hover:bg-red-600 transition-colors"
                        title="Remove profile picture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditingProfile} className={`w-full pl-12 pr-4 py-3 rounded-xl font-medium focus:outline-none transition-colors ${isEditingProfile ? 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500' : 'bg-transparent border border-transparent text-slate-800'}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" value={formData.email} disabled className="w-full pl-12 pr-4 py-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-medium focus:outline-none cursor-not-allowed" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})} disabled={!isEditingProfile} pattern="[0-9]{10}" maxLength="10" title="Please enter exactly 10 digits" className={`w-full pl-12 pr-4 py-3 rounded-xl font-medium focus:outline-none transition-colors ${isEditingProfile ? 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500' : 'bg-transparent border border-transparent text-slate-800'}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" disabled={!isEditingProfile} className={`w-full pl-12 pr-4 py-3 rounded-xl font-medium focus:outline-none resize-none transition-colors ${isEditingProfile ? 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500' : 'bg-transparent border border-transparent text-slate-800'}`}></textarea>
                    </div>
                  </div>
                  {isEditingProfile && (
                    <div className="mt-4 pt-6 border-t border-slate-100">
                      <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
             )}

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
                      <div key={order._id || idx} className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-start justify-between mb-3">
                           <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shrink-0"><Package className="w-5 h-5 text-slate-400" /></div>
                             <div>
                               <h4 className="font-bold text-slate-900">{order.merchant?.businessName || order.merchant?.name || 'Store'}</h4>
                               <span className="text-xs text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="font-black text-slate-900">₹{order.totalPrice}</div>
                             <div className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${bg} ${color}`}>{order.status}</div>
                           </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{order.orderItems.map(i => i.name).join(', ')}</p>
                        <div className="flex space-x-2 mt-auto">
                          <button onClick={() => navigate('/customer/orders')} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-red-500 transition-colors text-center">Track</button>
                          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><Download className="w-5 h-5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
             )}

             {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Saved Addresses</h3>
                  <button onClick={addNewAddress} className="flex items-center text-white font-bold bg-slate-900 hover:bg-slate-800 transition-colors px-3 py-2 rounded-lg shadow-sm text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No saved addresses found.</div>
                  ) : addresses.map((addr) => {
                    const Icon = addr.icon;
                    return (
                      <div key={addr.id} className={`p-5 bg-slate-50 rounded-2xl border-2 ${addr.border} relative`}>
                        {addr.isDefault && <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-md">Default</div>}
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 ${addr.bg} ${addr.color} rounded-full flex items-center justify-center mr-3`}><Icon className="w-4 h-4" /></div>
                          <h4 className="font-bold text-slate-900">{addr.type}</h4>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 whitespace-pre-line">{addr.text}</p>
                        <div className="flex space-x-2">
                          <button onClick={() => editAddress(addr.id)} className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50">Edit</button>
                          <button onClick={() => deleteAddress(addr.id)} className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
             )}

             {activeTab === 'favorites' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Favorite Stores</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Wok Master', type: 'Chinese', rating: '4.8', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=500' },
                    { name: 'Pizza Paradise', type: 'Italian', rating: '4.5', img: 'https://images.unsplash.com/photo-1574936145840-28808d77a0b6?q=80&w=500' },
                    { name: 'South Indian Delights', type: 'South Indian', rating: '4.9', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500' }
                  ].map((store, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center p-3">
                      <div className="w-20 h-20 shrink-0 relative rounded-xl overflow-hidden">
                        <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="pl-4 flex-1">
                        <div className="flex justify-between items-start">
                           <div>
                             <h4 className="text-base font-black text-slate-900">{store.name}</h4>
                             <p className="text-xs text-slate-500 font-medium mb-1">{store.type} • ⭐ {store.rating}</p>
                           </div>
                           <button className="bg-white p-1.5 rounded-full text-red-500 shadow-sm border border-slate-100">
                             <Heart className="w-4 h-4 fill-current" />
                           </button>
                        </div>
                        <button className="text-xs text-red-500 font-bold hover:underline">View Deals</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
             )}

             {activeTab === 'impact' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Your Impact</h3>
                <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden mb-6 shadow-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                  <div className="relative z-10 flex flex-col justify-between">
                    <div>
                      <p className="text-green-400 font-bold mb-1 uppercase tracking-wider text-xs">Hero Level {Math.floor(impactData.rewardPoints / 150) + 1}</p>
                      <h4 className="text-3xl font-black mb-2">{impactData.rewardPoints} <span className="text-base text-slate-400 font-medium">Points</span></h4>
                      <p className="text-slate-400 text-xs">{150 - (impactData.rewardPoints % 150)} points to Level {Math.floor(impactData.rewardPoints / 150) + 2} Rewards</p>
                    </div>
                    <button className="mt-4 w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm">Redeem Points</button>
                  </div>
                  <div className="relative z-10 mt-6"><div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: `${(impactData.rewardPoints % 150) / 150 * 100}%` }}></div></div></div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                     <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                     <p className="text-2xl font-black text-slate-900">{impactData.totalOrders}</p>
                     <p className="text-xs font-bold text-slate-500">Orders</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                     <IndianRupee className="w-6 h-6 text-green-500 mx-auto mb-2" />
                     <p className="text-2xl font-black text-slate-900">₹{impactData.totalSavings}</p>
                     <p className="text-xs font-bold text-slate-500">Savings</p>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-3 flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3 shrink-0"><Leaf className="w-5 h-5 text-teal-600" /></div>
                  <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Food Saved</p><p className="text-lg font-black text-slate-900">{(impactData.mealsRescued * 0.5).toFixed(1)} kg</p></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 shrink-0"><Star className="w-5 h-5 text-blue-600" /></div>
                  <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">CO₂ Reduced</p><p className="text-lg font-black text-slate-900">{(impactData.mealsRescued * 1.25).toFixed(1)} kg</p></div>
                </div>
              </div>
             )}

             {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Security</h4>
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                      <div onClick={() => setShowPasswordModal(true)} className="p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors"><div className="flex items-center"><Lock className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Change Password</span></div><ChevronRight className="w-4 h-4 text-slate-300" /></div>
                      <div className="p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors"><div className="flex items-center"><ShieldCheck className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Two-Factor Auth</span></div><span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-500 rounded">Disabled</span></div>
                      <div className="p-4 flex items-center justify-between hover:bg-slate-100 cursor-pointer transition-colors"><div className="flex items-center"><Smartphone className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Logged Devices</span></div><span className="text-[10px] font-bold text-red-500 hover:underline">Logout all</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Preferences</h4>
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                      <div className="p-4 flex items-center justify-between border-b border-slate-100"><div className="flex items-center"><Globe className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Language</span></div><span className="text-xs text-slate-500 font-medium">English</span></div>
                      <div className="p-4 flex items-center justify-between border-b border-slate-100"><div className="flex items-center"><Moon className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Dark Mode</span></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={toggleDarkMode} />
                          <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-800"></div>
                        </label>
                      </div>
                      <div className="p-4 flex items-center justify-between border-b border-slate-100"><div className="flex items-center"><Bell className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Push Notifications</span></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={pushNotifications} onChange={togglePush} className="sr-only peer" />
                          <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                      <div className="p-4 flex items-center justify-between border-b border-slate-100" onClick={toggleLocation}><div className="flex items-center"><MapPin className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Location Permissions</span></div>
                        {locationGranted ? <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-600 rounded">Granted</span> : <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-500 rounded">Request</span>}
                      </div>
                      <div onClick={() => setActiveTab('notifications')} className="p-4 flex items-center justify-between hover:bg-slate-100 cursor-pointer transition-colors"><div className="flex items-center"><Bell className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Advanced Alerts</span></div><ChevronRight className="w-4 h-4 text-slate-300" /></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Data & Actions</h4>
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                      <div onClick={handleDownloadData} className="p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors"><div className="flex items-center"><Download className="w-4 h-4 text-slate-400 mr-3" /><span className="font-semibold text-slate-700 text-sm">Download My Data</span></div><ChevronRight className="w-4 h-4 text-slate-300" /></div>
                      <div className="p-4 flex items-center justify-between hover:bg-red-50 cursor-pointer transition-colors"><div className="flex items-center"><Trash2 className="w-4 h-4 text-red-500 mr-3" /><span className="font-semibold text-red-600 text-sm">Delete Account</span></div></div>
                    </div>
                  </div>
                </div>
              </div>
             )}

             {activeTab === 'notifications' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Advanced Alerts</h3>
                <div className="space-y-3">
                  {[
                    { id: 'dealAlerts', title: 'Deal Alerts', desc: 'Get notified when new food is listed near you.' },
                    { id: 'orderUpdates', title: 'Order Updates', desc: 'Track your order status and pickup reminders.' },
                    { id: 'flashSales', title: 'Flash Sales', desc: 'Alerts for extreme discounts (80%+ off).' },
                    { id: 'newsletter', title: 'Newsletter', desc: 'Weekly roundup of your impact and savings.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="pr-4">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" checked={notificationPrefs[item.id]} onChange={() => handleNotificationToggle(item.id)} />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
             )}
           </div>
         </motion.div>
      )}
      
      {/* Modals */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
              <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full"><X className="w-4 h-4" /></button>
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4"><Lock className="w-5 h-5" /></div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Change Password</h3>
              <p className="text-slate-500 text-xs mb-6">Enter a new secure password for your account.</p>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? "text" : "password"} required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Current password" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} required minLength="6" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="New password" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} required minLength="6" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Confirm password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
                <button type="submit" disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword} className="w-full mt-2 bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-70">
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addressModal.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
              <button onClick={() => setAddressModal({ show: false, mode: 'add', id: null, type: '', text: '' })} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X className="w-4 h-4" /></button>
              <h3 className="text-xl font-black text-slate-900 mb-4">{addressModal.mode === 'edit' ? 'Edit Address' : 'Add Address'}</h3>
              <div className="space-y-3">
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Label (Home, Work, etc.)</label><input type="text" value={addressModal.type} onChange={(e) => setAddressModal({...addressModal, type: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Gym" /></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label><textarea value={addressModal.text} onChange={(e) => setAddressModal({...addressModal, text: e.target.value})} rows="3" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none" placeholder="Enter complete address..."></textarea></div>
                <button onClick={saveAddress} className="w-full mt-2 bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm">Save Address</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmModal.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl relative text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 className="w-6 h-6" /></div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Confirm</h3>
              <p className="text-slate-500 text-sm mb-6">{confirmModal.message}</p>
              <div className="flex space-x-2">
                <button onClick={() => setConfirmModal({ show: false, message: '', onConfirm: null })} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg">Cancel</button>
                <button onClick={confirmModal.onConfirm} className="flex-1 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDonateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
              <button onClick={() => setShowDonateModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X className="w-4 h-4" /></button>
              <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center mb-4"><HeartHandshake className="w-5 h-5" /></div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Donate Points</h3>
              <p className="text-slate-500 text-xs mb-4">Support partnered NGOs. 100 points = 1 fresh meal.</p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 flex justify-between items-center"><span className="font-bold text-slate-700 text-sm">Balance:</span><span className="font-black text-teal-600">{impactData.rewardPoints} pts</span></div>
              <button onClick={handleDonatePoints} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm">Donate 100 Points</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFAQModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
              <button onClick={() => setShowFAQModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X className="w-4 h-4" /></button>
              <h3 className="text-xl font-black text-slate-900 mb-4">Help Center & FAQs</h3>
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><h4 className="font-bold text-slate-900 text-sm mb-1">How does FlashFood work?</h4><p className="text-slate-600 text-xs">Merchants list their surplus food at a steep discount just before closing. You purchase it, wait for pickup time, and collect.</p></div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><h4 className="font-bold text-slate-900 text-sm mb-1">Are the meals fresh?</h4><p className="text-slate-600 text-xs">Absolutely! All listed food is perfectly good to eat, made on the same day.</p></div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><h4 className="font-bold text-slate-900 text-sm mb-1">What if order cancels?</h4><p className="text-slate-600 text-xs">You receive a full refund instantly, along with bonus points.</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComplaintModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
              <button onClick={() => setShowComplaintModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X className="w-4 h-4" /></button>
              <h3 className="text-xl font-black text-slate-900 mb-4">Send Feedback</h3>
              <form onSubmit={handleSubmitComplaint} className="space-y-3">
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Subject</label><input type="text" required value={complaintData.subject} onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Brief subject" /></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Description</label><textarea required value={complaintData.description} onChange={(e) => setComplaintData({...complaintData, description: e.target.value})} rows="4" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none" placeholder="Tell us what happened..."></textarea></div>
                <button type="submit" disabled={complaintLoading} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm">{complaintLoading ? 'Sending...' : 'Submit'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
              <button onClick={() => setShowTermsModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X className="w-4 h-4" /></button>
              <h3 className="text-xl font-black text-slate-900 mb-4">Terms & Privacy</h3>
              <div className="prose prose-sm text-slate-600">
                <h4 className="font-bold text-slate-900 text-sm">1. Acceptance of Terms</h4><p className="text-xs mb-3">By accessing FlashFood, you agree to these Terms. Purchases are final.</p>
                <h4 className="font-bold text-slate-900 text-sm">2. Privacy Policy</h4><p className="text-xs mb-3">Your info is encrypted. We don't sell data.</p>
                <h4 className="font-bold text-slate-900 text-sm">3. User Conduct</h4><p className="text-xs">Show up for pickup. Failure may result in suspension.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
