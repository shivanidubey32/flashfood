import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Timer, Heart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ListingCard = ({ listing, isWishlisted, onToggleWishlist, linkTo }) => {
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(listing.expiryTime) - new Date();
      if (difference > 0) {
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${h > 0 ? h + 'h ' : ''}${m}m ${s}s`);
      } else {
        setTimeLeft('Expired');
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [listing.expiryTime]);

  const discount = Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100);
  const destination = linkTo || (location.pathname.startsWith('/customer') ? `/customer/food/${listing._id}` : `/food/${listing._id}`);
  const stock = listing.quantityAvailable !== undefined ? listing.quantityAvailable : (listing.quantity ?? 0);
  const isSoldOut = listing.status === 'Sold Out' || stock <= 0;
  const isExpired = timeLeft === 'Expired';
  const hasRating = listing.rating && Number(listing.rating) > 0;

  return (
    <Link to={destination} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={isExpired || isSoldOut ? {} : { y: -5 }}
        className={`glass rounded-2xl overflow-hidden flex flex-col h-full group cursor-pointer transition-all duration-300 ${
          isExpired || isSoldOut ? 'opacity-75' : ''
        }`}
      >
        <div className="relative h-48 overflow-hidden shrink-0">
          <img 
            src={listing.image ? (listing.image.startsWith('http') ? listing.image : ((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + listing.image)) : (listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000')} 
            alt={listing.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isSoldOut ? 'grayscale' : 'group-hover:scale-110'}`}
          />
          
          {isSoldOut ? (
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Sold Out
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {discount}% OFF
            </div>
          )}

          <button 
            onClick={(e) => {
              e.preventDefault();
              if(onToggleWishlist) onToggleWishlist(listing._id);
            }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-20"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>

          <div className={`absolute bottom-4 right-4 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg ${
            isExpired ? 'bg-slate-900/90 text-white' : 'bg-white/90 text-red-600 animate-pulse'
          }`}>
            <Timer className="w-3.5 h-3.5 mr-1" />
            {timeLeft}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{listing.title}</h3>
              <p className="text-sm text-slate-500 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {listing.merchant?.businessName || listing.merchant?.name || 'Local Store'}
              </p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="text-lg font-bold text-slate-900">₹{listing.discountedPrice}</p>
              <p className="text-xs text-slate-400 line-through">₹{listing.originalPrice}</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center justify-between mb-4 text-xs">
            {/* Rating display */}
            <div className="flex items-center space-x-1">
              {hasRating ? (
                <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{Number(listing.rating).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal ml-1">({listing.numReviews || 1})</span>
                </div>
              ) : (
                <span className="text-slate-400 font-medium">No reviews yet</span>
              )}
            </div>

            {/* Stock indicator */}
            <div>
              {isSoldOut ? (
                <span className="text-red-600 bg-red-50 font-bold px-2.5 py-0.5 rounded-md">
                  Sold Out
                </span>
              ) : (
                <span className="text-emerald-700 bg-emerald-50 font-semibold px-2.5 py-0.5 rounded-md">
                  {stock} left
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-auto pt-2 border-t border-slate-100">
            <button 
              disabled={isSoldOut || isExpired}
              className={`flex items-center text-sm font-semibold px-4 py-2 rounded-full transition-colors z-10 ${
                isSoldOut || isExpired
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'text-white bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {isSoldOut ? 'Sold Out' : isExpired ? 'Expired' : 'View Deal'}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ListingCard;
