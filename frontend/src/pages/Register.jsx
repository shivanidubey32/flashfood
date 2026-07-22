import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer', // Default role
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/register', formData);
      
      // Save token and user info
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect based on role
      if (data.role === 'Merchant') {
        navigate('/dashboard/merchant');
      } else if (data.role === 'NGO') {
        navigate('/dashboard/ngo');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Create an Account</h2>
          <p className="text-slate-600 mt-2">Join FlashFood to make a difference</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input 
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-shadow"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-shadow"
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

          <div>
            <label className="block text-sm font-medium text-slate-700">I am a...</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-shadow"
            >
              <option value="Customer">Customer (Looking for food)</option>
              <option value="Merchant">Business (Selling surplus food)</option>
              <option value="NGO">NGO (Accepting donations)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-red-500/30 text-sm font-medium text-white transition-colors ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-red-500 hover:text-red-400">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
