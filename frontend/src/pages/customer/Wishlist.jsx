import { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Loader, CheckCircle, Search, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '../../components/ListingCard';

const Wishlist = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '' });
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/listings');
        
        // Filter listings that are in the user's wishlist
        const wishlistItems = data.filter(item => wishlist.includes(item._id));
        setListings(wishlistItems);
      } catch (error) {
        console.error('Error fetching wishlist', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleToggleWishlist = (id) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(id);
      const newWishlist = isRemoving ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      showToast(isRemoving ? 'Removed from Wishlist' : 'Added to Wishlist');
      
      // Update local listings state to remove the item immediately if removed from wishlist
      if (isRemoving) {
        setListings(prevListings => prevListings.filter(item => item._id !== id));
      }
      
      return newWishlist;
    });
  };

  const wishlistedItems = listings.filter(item => wishlist.includes(item._id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 bg-slate-900 text-white"
          >
            <CheckCircle className="w-5 h-5 text-red-500" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center">
        Your Wishlist <Heart className="ml-3 w-8 h-8 text-red-500 fill-red-500" />
      </h1>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader className="w-10 h-10 animate-spin text-red-500 mb-4" />
          <p className="text-slate-500 font-bold">Loading your favorites...</p>
        </div>
      ) : wishlistedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedItems.map(listing => (
            <ListingCard 
              key={listing._id} 
              listing={listing} 
              isWishlisted={true}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm p-12">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-red-300 fill-red-100" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Save your favorite deals</h2>
          <p className="text-slate-500 mb-8 max-w-sm">Tap the heart icon on any food item to save it here for later. Don't wait too long, deals sell out fast!</p>
          <Link to="/customer/explore" className="bg-slate-900 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-slate-800 transition-all">
            Explore Deals
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
