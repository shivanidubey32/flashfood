import { motion } from 'framer-motion';
import { MapPin, Clock, ShoppingBag, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ListingCard = ({ listing, isWishlisted, onToggleWishlist }) => {
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

  return (
    <Link to={`/customer/food/${listing._id}`} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className="glass rounded-2xl overflow-hidden flex flex-col h-full group cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden shrink-0">
          <img 
            src={listing.image ? (listing.image.startsWith('http') ? listing.image : ((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + listing.image)) : (listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000')} 
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {discount}% OFF
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if(onToggleWishlist) onToggleWishlist(listing._id);
            }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-20"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>
          <div className={`absolute bottom-4 right-4 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg ${timeLeft === 'Expired' ? 'bg-slate-900/90 text-white' : 'bg-white/90 text-red-600 animate-pulse'}`}>
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
          
          <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
            {listing.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {listing.quantity} left
            </span>
            <button className="flex items-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full transition-colors z-10">
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Deal
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ListingCard;
