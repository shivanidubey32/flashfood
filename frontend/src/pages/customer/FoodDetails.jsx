import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { 
  MapPin, Clock, Star, ShoppingBag, Heart, ArrowLeft, Store, ShieldCheck, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchListingAndReviews = async () => {
      try {
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/listings');
        const allListings = data;
        const found = allListings.find(l => l._id === id);
        
        if(found) {
          setListing(found);
          // Fetch reviews for this specific food listing
          try {
            const reviewsRes = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/reviews/listing/${id}`);
            setReviews(reviewsRes.data);
          } catch (rErr) {
            console.error('Error fetching reviews', rErr);
          }
        }
      } catch (error) {
        console.error('Error fetching', error);
        const found = DUMMY_ITEMS.find(l => l._id === id);
        if(found) setListing(found);
      } finally {
        setLoading(false);
      }
    };
    fetchListingAndReviews();
  }, [id]);

  if (loading) return <div className="p-8 text-center mt-20">Loading...</div>;
  if (!listing) return <div className="p-8 text-center mt-20">Food not found.</div>;

  const discount = Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100);
  const expiry = new Date(listing.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleAddToCart = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.role !== 'Customer') {
      showToast('Please log in as a Customer to buy food.', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    addToCart(listing, quantity);
    setAdded(true);
    showToast(`${quantity}x ${listing.title} added to cart!`, 'success');
    
    // Reset added state after animation
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      
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
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-red-500 mb-6 font-semibold">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image */}
        <div className="md:w-1/2 relative h-64 md:h-auto min-h-[300px]">
          <img 
            src={listing.image ? (listing.image.startsWith('http') ? listing.image : ((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + listing.image)) : (listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000')} 
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            {discount}% OFF
          </div>
          <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-lg transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">{listing.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className="flex items-center text-sm font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md">
              <Star className="w-4 h-4 fill-amber-500 mr-1" /> 
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'New'}
            </span>
            <span className="text-sm font-semibold text-slate-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" /> 0.8 km away
            </span>
          </div>

          <p className="text-slate-600 mb-6 leading-relaxed">
            {listing.description}
          </p>

          <div className="flex items-center space-x-6 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Flash Price</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-red-500">₹{listing.discountedPrice}</span>
                <span className="text-sm text-slate-400 line-through font-semibold">₹{listing.originalPrice}</span>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Before</p>
              <div className="flex items-center text-slate-900 font-bold text-lg">
                <Clock className="w-5 h-5 mr-1.5 text-slate-400" />
                {expiry}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Store className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{listing.merchant?.businessName || listing.merchant?.name || 'Local Store'}</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Merchant</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                {listing.quantityAvailable || listing.quantity} left
              </span>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center bg-slate-100 rounded-xl px-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors font-bold"
                >-</button>
                <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(listing.quantityAvailable || listing.quantity, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors font-bold"
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 flex items-center justify-center font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                  added 
                    ? 'bg-green-500 text-white shadow-green-500/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                }`}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {added ? 'Added to Cart! ✅' : 'Add to Cart'}
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Dynamic Reviews Section */}
      <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Customer Reviews {reviews.length > 0 && <span className="text-slate-400 text-base font-medium">({reviews.length})</span>}
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No reviews yet. Be the first to try and review!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{review.customer?.name || 'Happy Customer'}</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium bg-slate-50 px-2 py-0.5 rounded-md">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
