import { ShieldCheck, MapPin, Mail, Phone, Clock, FileText, CheckCircle, Upload, User, Lock, X, Loader, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo') || '{}'));
  
  const [formData, setFormData] = useState({
    name: userInfo.name || '',
    phoneNumber: userInfo.phone || '',
    address: userInfo.address || ''
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

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

  // OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', config);
        setFormData(prev => ({ ...prev, name: data.name, phoneNumber: data.phoneNumber || prev.phoneNumber, address: data.address || prev.address }));
        setUserInfo(prev => ({...prev, isVerified: data.isVerified, address: data.address, isPhoneVerified: data.isPhoneVerified}));
        setDocuments(data.verificationDocuments || []);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, [userInfo.token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/auth/profile'), {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      }, config);
      
      const updatedInfo = { ...userInfo, name: data.name, phone: data.phoneNumber, address: data.address, isPhoneVerified: data.isPhoneVerified };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      showToast('Profile updated successfully!');
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

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File must be smaller than 5MB", "error");
        return;
      }
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('document', file);
      
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' } };
        const { data: uploadData } = await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/upload/document', formDataUpload, config);
        
        const newDoc = {
          name: file.name,
          url: uploadData.document,
          status: 'Pending',
          uploadedAt: new Date().toISOString()
        };
        const updatedDocs = [...documents, newDoc];
        
        // Save to backend
        const updateConfig = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', {
          verificationDocuments: updatedDocs
        }, updateConfig);
        
        setDocuments(updatedDocs);
        showToast('Document uploaded successfully!');
      } catch (error) {
        showToast('Failed to upload document', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteDocument = async (docUrl) => {
    try {
      setLoading(true);
      const updatedDocs = documents.filter(doc => doc.url !== docUrl);
      
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', {
        verificationDocuments: updatedDocs
      }, config);
      
      setDocuments(updatedDocs);
      showToast('Document deleted successfully');
    } catch (error) {
      showToast('Failed to delete document', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/send-otp', {}, config);
      showToast('OTP sent to your mobile number!', 'success');
      setShowOtpModal(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/verify-otp', { otp }, config);
      
      const updatedInfo = { ...userInfo, isPhoneVerified: data.isPhoneVerified };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);

      showToast('Phone number verified successfully!', 'success');
      setShowOtpModal(false);
      setOtp('');
    } catch (error) {
      showToast(error.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
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

      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">NGO Profile & Settings</h1>
           <p className="text-slate-500 mt-1">Manage your organization's public details and verification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Verification Badge & Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            
            <div className="p-8 relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border-4 border-white/20">
                <span className="text-3xl font-black">{userInfo.name ? userInfo.name[0] : 'H'}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{userInfo.name || 'Helping Hands NGO'}</h2>
              <p className="text-slate-400 text-sm mb-6 flex items-center justify-center">
                <MapPin className="w-3 h-3 mr-1" /> {userInfo.address || 'Address not set'}
              </p>

              {/* Verification Badge */}
              <div className={`w-full p-1 rounded-2xl ${userInfo.isVerified ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-slate-700'}`}>
                <div className="bg-slate-900 p-4 rounded-xl flex items-center justify-center">
                  <ShieldCheck className={`w-6 h-6 mr-2 ${userInfo.isVerified ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <p className={`text-[10px] uppercase font-bold tracking-wider ${userInfo.isVerified ? 'text-blue-400' : 'text-slate-500'}`}>Status</p>
                    <p className={`text-sm font-bold leading-tight ${userInfo.isVerified ? 'text-white' : 'text-slate-400'}`}>
                      {userInfo.isVerified ? 'Verified Partner' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-800 p-6 space-y-3 text-sm text-slate-300">
              <p className="flex items-center"><Mail className="w-4 h-4 mr-3 text-slate-500" /> {userInfo.email || 'ngo@gmail.com'}</p>
              <p className="flex items-center"><Phone className="w-4 h-4 mr-3 text-slate-500" /> {userInfo.phone || '+91 9876543210'}</p>
            </div>
            <div className="border-t border-slate-800 p-6">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center border border-slate-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Verification Documents</h3>
            
            <div className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-6 text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No documents uploaded yet.
                </div>
              ) : (
                documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center overflow-hidden mr-4">
                      <FileText className="w-8 h-8 text-blue-500 shrink-0 mr-4" />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-500 font-medium">Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.status === 'Verified' ? 'bg-green-100 text-green-700' : doc.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                        {doc.status}
                      </span>
                      {doc.status === 'Pending' && (
                        <button 
                          onClick={() => handleDeleteDocument(doc.url)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete Document"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.jpg,.png" 
                ref={fileInputRef}
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Upload className="w-5 h-5 mr-2" />
                {loading ? 'Uploading...' : 'Upload New Document'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Basic Details</h3>
            
            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">NGO Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-slate-400" />
                    Contact Phone
                  </div>
                  {userInfo.phone && formData.phoneNumber === userInfo.phone && (
                    userInfo.isPhoneVerified ? (
                      <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-md flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="text-[10px] font-black uppercase bg-slate-200 text-slate-700 hover:bg-slate-300 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {otpLoading ? 'Sending...' : 'Verify Now'}
                      </button>
                    )
                  )}
                </label>
                <input 
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                  Office Address
                </label>
                <textarea 
                  rows="2"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" 
                ></textarea>
              </div>
              <div className="md:col-span-2 mt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
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
              
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Change Password</h3>
              <p className="text-slate-500 text-sm mb-6">Enter a new secure password for your NGO account.</p>
              
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
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
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

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
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
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Verify Mobile</h3>
              <p className="text-slate-500 text-sm mb-6">Enter the 6-digit code sent to your mobile number.</p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono tracking-[0.5em] text-center text-lg font-bold"
                    placeholder="------"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={otpLoading || otp.length !== 6}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {otpLoading ? 'Verifying...' : 'Verify Code'}
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
