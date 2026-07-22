import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { PackageOpen, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AddListing = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cooked Food',
    originalPrice: '',
    discountedPrice: '',
    quantityAvailable: '',
    dietaryType: 'Veg',
    expiryTime: '',
    image: '',
  });
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/listings', formData);
      navigate('/dashboard/merchant/listings');
    } catch (error) {
      console.error("Failed to add listing", error);
      alert(error.response?.data?.message || 'Failed to add listing');
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/upload', formDataUpload, config);
      setFormData({ ...formData, image: data.image });
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
          <PackageOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Listing</h1>
          <p className="text-slate-600 mt-1">Post surplus food to rescue it from waste.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Food Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" placeholder="e.g. Delicious Veg Burger Combo" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea name="description" rows="3" required value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" placeholder="Describe the ingredients, size, and condition of the food..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="Cooked Food">Cooked Food</option>
                <option value="Baked Goods">Baked Goods</option>
                <option value="Groceries">Groceries</option>
                <option value="Produce">Produce</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Type</label>
              <select name="dietaryType" value={formData.dietaryType} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Original Price (₹)</label>
              <input type="number" name="originalPrice" required value={formData.originalPrice} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="150" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Discounted Price (₹)</label>
              <input type="number" name="discountedPrice" required value={formData.discountedPrice} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="50" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity Available</label>
              <input type="number" name="quantityAvailable" required value={formData.quantityAvailable} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 5" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Time</label>
              <input type="datetime-local" name="expiryTime" required value={formData.expiryTime} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Food Image</label>
              <div className="flex items-center space-x-4">
                {formData.image ? (
                  <img src={((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + formData.image} alt="Food preview" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input 
                    type="file" 
                    id="image-upload" 
                    className="hidden" 
                    onChange={uploadFileHandler}
                    accept="image/*"
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors inline-block"
                  >
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  <p className="text-xs text-slate-500 mt-2">Upload a mouth-watering photo of the food. PNG, JPG up to 5MB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-colors shadow-lg ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'}`}
            >
              {loading ? 'Posting Listing...' : 'Post Food Listing'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddListing;
