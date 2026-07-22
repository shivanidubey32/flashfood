import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    // Simulate API call for forgot password
    setIsForgotOpen(false);
    setForgotEmail('');
    showToast(`Password reset link sent to ${forgotEmail}!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Save token and user info
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect based on role
      if (data.role === 'Admin') {
        navigate('/dashboard/admin');
      } else if (data.role === 'Merchant') {
        navigate('/dashboard/merchant');
      } else if (data.role === 'NGO') {
        navigate('/dashboard/ngo');
      } else {
        navigate('/customer/explore');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Toast Notification */}
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-slate-600 mt-2">Login to rescue more food</p>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-slate-700">Remember me</label>
            </div>
            <div className="text-sm">
              <button 
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="font-medium text-red-500 hover:text-red-400"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-red-500/30 text-sm font-medium text-white transition-colors ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-red-500 hover:text-red-400">
            Sign up now
          </Link>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsForgotOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Reset Password</h2>
              <p className="text-slate-500 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={forgotEmail} 
                    onChange={e => setForgotEmail(e.target.value)} 
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-shadow" 
                  />
                </div>
                <button type="submit" className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 mt-4 shadow-lg shadow-red-500/30 transition-colors">
                  Send Reset Link
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
