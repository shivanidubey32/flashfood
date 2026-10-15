import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useCart } from '../../context/CartContext';
import { 
  MapPin, Clock, Star, ShoppingBag, Heart, ArrowLeft, Store, ShieldCheck, CheckCircle, Search, X, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '../../components/ListingCard';
import Breadcrumbs from '../../components/Breadcrumbs';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  
  // Selected Item State
  const [listing, setListing] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review Form & Eligibility State
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Search & Filter State for Remaining Listings
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Deals');
  
  // Wishlist State (persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const handleToggleWishlist = (listingId) => {
    setWishlist(prev => {
      const updated = prev.includes(listingId) 
        ? prev.filter(x => x !== listingId) 
        : [...prev, listingId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Reset scroll position and quantity whenever selected food ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setAdded(false);
  }, [id]);

  // Fetch all active listings and current listing details + reviews
  useEffect(() => {
    let isMounted = true;

    const fetchListingData = async () => {
      setLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
        const { data: listingsData } = await axios.get(`${backendUrl}/api/listings`);
        
        if (!isMounted) return;
        setAllListings(listingsData || []);

        // Find the selected listing using normalized String ID comparison
        const found = (listingsData || []).find(l => String(l._id) === String(id));
        setListing(found || null);

        // If found, fetch reviews for this listing
        if (found) {
          try {
            const { data: reviewsData } = await axios.get(`${backendUrl}/api/reviews/listing/${id}`);
            if (isMounted) setReviews(reviewsData || []);
          } catch (rErr) {
            console.error('Error fetching reviews for listing', rErr);
            if (isMounted) setReviews([]);
          }
        }
      } catch (error) {
        console.error('Error fetching food listings', error);
        if (isMounted) {
          setListing(null);
          setAllListings([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListingData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Check review eligibility for logged in customer
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo?.token || userInfo?.role !== 'Customer' || !id) {
      setCanReview(false);
      setAlreadyReviewed(false);
      return;
    }

    const checkReviewEligibility = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${backendUrl}/api/reviews/can-review/${id}`, config);
        setCanReview(Boolean(data.canReview));
        setAlreadyReviewed(Boolean(data.alreadyReviewed));
        if (data.orderId) setReviewOrderId(data.orderId);
      } catch (err) {
        console.error('Error checking review eligibility', err);
        setCanReview(false);
      }
    };

    checkReviewEligibility();
  }, [id]);

  // Real-time socket listeners for inventory updates and reviews
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
    const socket = io(backendUrl);

    socket.on('inventory-updated', (data) => {
      if (data && String(data.listingId) === String(id)) {
        setListing(prev => prev ? { ...prev, quantityAvailable: data.quantityAvailable, status: data.status } : prev);
      }
      setAllListings(prev => prev.map(item => 
        String(item._id) === String(data.listingId) 
          ? { ...item, quantityAvailable: data.quantityAvailable, status: data.status }
          : item
      ));
    });

    socket.on(`listing-review-${id}`, (newReview) => {
      setReviews(prev => {
        if (prev.some(r => r._id === newReview._id)) return prev;
        return [newReview, ...prev];
      });
      setListing(prev => {
        if (!prev) return prev;
        const count = (prev.numReviews || 0) + 1;
        const newAvg = (((prev.rating || 0) * (prev.numReviews || 0)) + newReview.rating) / count;
        return { ...prev, rating: parseFloat(newAvg.toFixed(1)), numReviews: count };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Remaining eligible listings (Excludes the currently selected listing by normalized ID)
  const remainingListings = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return allListings.filter(item => 
      String(item._id) !== String(id) && 
      item.status === 'Available'
    );
  }, [allListings, id]);

  // Filtered Remaining Listings based on search term and category chips
  const filteredRemaining = useMemo(() => {
    let result = remainingListings;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item => 
        item.title?.toLowerCase().includes(term) ||
        item.merchant?.businessName?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      );
    }

    // Chip filter
    if (activeFilter === 'Vegetarian 🥬') {
      result = result.filter(item => item.dietaryType === 'Veg');
    } else if (activeFilter === 'Non-Veg 🍗') {
      result = result.filter(item => item.dietaryType === 'Non-Veg');
    } else if (activeFilter === 'Under ₹100 💰') {
      result = result.filter(item => item.discountedPrice < 100);
    } else if (activeFilter === 'Wishlist 💖') {
      result = result.filter(item => wishlist.includes(item._id));
    }

    return result;
  }, [remainingListings, searchTerm, activeFilter, wishlist]);

  const discount = listing 
    ? Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100) 
    : 0;
  
  const expiry = listing?.expiryTime 
    ? new Date(listing.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';
  
  const cartItem = listing ? cartItems.find(item => item._id === listing._id) : null;
  const quantityInCart = cartItem ? cartItem.cartQuantity : 0;
  const totalAvailable = listing ? (listing.quantityAvailable !== undefined ? listing.quantityAvailable : (listing.quantity || 0)) : 0;
  const isSoldOut = listing?.status === 'Sold Out' || totalAvailable <= 0;
  const itemsLeft = Math.max(0, totalAvailable - quantityInCart);

  const handleAddToCart = () => {
    if (!listing) return;
    if (isSoldOut || itemsLeft <= 0) {
      showToast('This item is currently sold out.', 'error');
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo || userInfo.role !== 'Customer') {
      showToast('Please log in as a Customer to buy food.', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    addToCart(listing, quantity);
    setAdded(true);
    showToast(`${quantity}x ${listing.title} added to cart!`, 'success');
    
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please provide written review feedback.', 'error');
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo?.token) {
      showToast('Please log in to submit a review.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`${backendUrl}/api/reviews`, {
        orderId: reviewOrderId,
        listingId: id,
        rating: reviewRating,
        comment: reviewComment.trim()
      }, config);

      setReviews(prev => [data, ...prev]);
      setCanReview(false);
      setAlreadyReviewed(true);
      setReviewComment('');
      
      setListing(prev => {
        if (!prev) return prev;
        const count = (prev.numReviews || 0) + 1;
        const newAvg = (((prev.rating || 0) * (prev.numReviews || 0)) + reviewRating) / count;
        return { ...prev, rating: parseFloat(newAvg.toFixed(1)), numReviews: count };
      });

      showToast('Review submitted successfully! Thank you for reducing food waste.', 'success');
    } catch (err) {
      console.error('Error submitting review', err);
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filterChips = [
    'All Deals',
    'Vegetarian 🥬',
    'Non-Veg 🍗',
    'Under ₹100 💰',
    'Wishlist 💖'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
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

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs 
        className="mb-4"
        items={[
          { label: 'Home', path: location.pathname.startsWith('/customer') ? '/customer/explore' : '/' },
          { label: 'Explore Food', path: location.pathname.startsWith('/customer') ? '/customer/explore' : '/explore' },
          { label: listing?.title || (loading ? 'Loading food...' : 'Food Details') }
        ]}
      />

      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate(location.pathname.startsWith('/customer') ? '/customer/explore' : '/explore');
            }
          }} 
          className="flex items-center text-slate-500 hover:text-red-500 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
        </button>
        {listing && (
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Selected Deal
          </span>
        )}
      </div>

      {/* Loading State for Main Card */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center animate-pulse flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-16 h-16 rounded-full bg-slate-200 mb-4 animate-spin border-4 border-red-500 border-t-transparent"></div>
          <p className="text-slate-500 font-bold text-lg">Loading food rescue details...</p>
        </div>
      ) : !listing ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Food item not found or no longer available</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            This specific listing may have expired, been claimed, or removed. You can browse all other available deals below!
          </p>
        </div>
      ) : (
        /* Selected Food Item (Hero Card) */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row mb-12"
        >
          
          {/* Left: Image */}
          <div className="md:w-1/2 relative h-72 md:h-auto min-h-[320px] bg-slate-100">
            <img 
              src={listing.image ? (listing.image.startsWith('http') ? listing.image : ((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + listing.image)) : (listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000')} 
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
              {discount}% OFF
            </div>
            <button 
              onClick={() => handleToggleWishlist(listing._id)}
              className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-lg transition-all"
            >
              <Heart className={`w-5 h-5 ${wishlist.includes(listing._id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
              Category: {listing.category || 'Surplus Food'}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{listing.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center text-sm font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md">
                <Star className="w-4 h-4 fill-amber-500 mr-1" /> 
                {listing.rating && Number(listing.rating) > 0 
                  ? `${Number(listing.rating).toFixed(1)} (${listing.numReviews || reviews.length})` 
                  : (reviews.length > 0 ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} (${reviews.length})` : 'No reviews yet')}
              </span>
              <span className="text-sm font-semibold text-slate-500 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-red-500" /> 
                {listing.merchant?.address?.city || 'Nearby'}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${listing.dietaryType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {listing.dietaryType || 'Mixed'}
              </span>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed text-sm sm:text-base">
              {listing.description}
            </p>

            {/* Price & Pickup Before */}
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
                  {expiry || 'Today'}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                    <Store className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{listing.merchant?.businessName || listing.merchant?.name || 'Local Store'}</p>
                    <p className="text-xs text-slate-500 font-medium">Verified Merchant Partner</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isSoldOut || itemsLeft <= 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                  {isSoldOut || itemsLeft <= 0 ? 'Sold Out' : `${itemsLeft} left in stock`}
                </span>
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center bg-slate-100 rounded-xl px-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isSoldOut || itemsLeft <= 0}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors font-bold disabled:opacity-40"
                  >-</button>
                  <span className="w-8 text-center font-bold text-slate-900">{isSoldOut || itemsLeft <= 0 ? 0 : quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(itemsLeft, quantity + 1))}
                    disabled={isSoldOut || itemsLeft <= 0 || quantity >= itemsLeft}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={added || isSoldOut || itemsLeft <= 0}
                  className={`flex-1 flex items-center justify-center font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                    added 
                      ? 'bg-green-500 text-white shadow-green-500/20' 
                      : isSoldOut || itemsLeft <= 0 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {added ? 'Added to Cart! ✅' : isSoldOut || itemsLeft <= 0 ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Customer Reviews Section */}
      {listing && (
        <div className="mb-14 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <span>Customer Reviews</span>
                {reviews.length > 0 && <span className="text-slate-400 text-sm font-semibold ml-2">({reviews.length})</span>}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Verified reviews from customers who purchased this meal.</p>
            </div>
            {listing.rating > 0 && (
              <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 text-sm">{Number(listing.rating).toFixed(1)}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
            )}
          </div>

          {/* Review Form for Verified Customers */}
          {canReview && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center">
                  <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
                  Rate & Review Your Experience
                </h4>
                <span className="text-[11px] text-amber-800 bg-amber-100/80 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  Verified Purchaser
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Help other customers rescue great food by reviewing the freshness and quality.
              </p>

              {/* Star selector */}
              <div className="flex items-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewHoverRating(star)}
                    onMouseLeave={() => setReviewHoverRating(0)}
                    className="focus:outline-none p-1 transition-transform hover:scale-125"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= (reviewHoverRating || reviewRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-700 ml-2">
                  {reviewRating} of 5 Stars
                </span>
              </div>

              {/* Comment text */}
              <textarea
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on food quality, portion size, and pickup experience..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none mb-3 resize-none shadow-sm"
                required
              />

              <button
                type="submit"
                disabled={submittingReview || !reviewComment.trim()}
                className="flex items-center text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          )}

          {alreadyReviewed && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center text-xs font-semibold text-emerald-800">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              Thank you! You have reviewed this food rescue item.
            </div>
          )}
          
          {reviews.length === 0 ? (
            <div className="text-center py-6 text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-sm">
              No reviews for this food listing yet. Be the first to rescue and review!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{review.customer?.name || 'Verified Customer'}</span>
                    <span className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION DIVIDER & HEADING FOR OTHER FOOD ITEMS */}
      <div className="pt-6 border-t border-slate-200/80 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                More Food Rescues Nearby
              </h2>
            </div>
            <p className="text-slate-500 text-sm">
              Discover other surplus deals ready for pickup before they go to waste.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full text-xs border border-red-100 shadow-sm">
              {remainingListings.length} more deals available
            </span>
          </div>
        </div>

        {/* Search & Filter Controls for Remaining Food Items */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search other food or stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterChips.map(chip => (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeFilter === chip
                    ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Remaining Food Listings (Loaded directly from database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRemaining.length > 0 ? (
          filteredRemaining.map(item => (
            <ListingCard 
              key={item._id} 
              listing={item} 
              isWishlisted={wishlist.includes(item._id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No other deals match this filter</h3>
            <p className="text-slate-500 text-sm mb-4">Try clearing your search or switching filter categories.</p>
            {(searchTerm || activeFilter !== 'All Deals') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('All Deals');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default FoodDetails;

