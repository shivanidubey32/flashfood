import { useState, useRef, useEffect } from 'react';
import { Camera, Building, MapPin, Phone, Mail, Lock, X, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo') || '{}'));
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    businessName: userInfo.name || '',
    email: userInfo.email || '',
    phone: userInfo.phone || '',
    address: userInfo.address || '',
    description: '',
    logo: userInfo.logo || null,
  });
  const [loading, setLoading] = useState(false);

  // Password Modal
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

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userInfo.token) return;
        const { data } = await API.get('/auth/profile');
        setFormData(prev => ({
          ...prev,
          businessName: data.name,
          phone: data.phoneNumber || prev.phone,
          address: data.address || prev.address,
          description: data.businessDescription || prev.description
        }));
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, [userInfo.token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image must be smaller than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', {
        name: formData.businessName,
        phoneNumber: formData.phone,
        address: formData.address,
        businessDescription: formData.description
      });
      
      const updatedInfo = { ...userInfo, name: data.name, phone: data.phoneNumber, address: data.address, businessDescription: data.businessDescription, logo: formData.logo };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update profile.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      await API.put('/auth/profile', {
        password: passwordData.newPassword,
        currentPassword: passwordData.currentPassword
      });
      
      showToast('Password updated successfully!', 'success');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update password.', 'error');
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Business Profile</h1>
        <p className="text-slate-600 mt-1">Update your shop details and public appearance.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Logo Upload */}
          <div className="flex items-center space-x-6 mb-8">
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 relative group cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden"
            >
              {formData.logo ? (
                <img src={formData.logo} alt="Shop Logo" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-orange-500 transition-colors" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Shop Logo</h3>
              <p className="text-sm text-slate-500 mb-2">JPG, GIF or PNG. Max size of 2MB.</p>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                Upload new image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Store Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 pt-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <textarea name="address" rows="2" required value={formData.address} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Description</label>
              <textarea name="description" rows="3" required value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button 
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="w-full sm:w-auto px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <Lock className="w-4 h-4 mr-2" /> Change Password
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
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
              
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Change Password</h3>
              <p className="text-slate-500 text-sm mb-6">Enter a new secure password for your merchant account.</p>
              
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
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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
    </div>
  );
};

export default Profile;
