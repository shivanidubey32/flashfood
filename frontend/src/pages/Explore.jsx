import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '../components/ListingCard';
import { Search, Filter, Map as MapIcon, X, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DUMMY_ITEMS } from '../utils/dummyData';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

// Component to handle map re-centering
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

// Create a custom modern map pin using Lucide icon
const createCustomIcon = (price) => {
  return new L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        <MapPin className="text-red-500 w-10 h-10 fill-white drop-shadow-md" />
        <span className="absolute top-2 text-[10px] font-bold text-red-600">₹{price}</span>
      </div>
    ),
    className: 'custom-map-marker bg-transparent border-none',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// New Delhi center coordinate for the map
const MAP_CENTER = [28.6139, 77.2090];

const Explore = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [mapCenter, setMapCenter] = useState(MAP_CENTER);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Deals');
  
  // Advanced Filters State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    category: 'All',
    dietaryType: 'All',
    maxPrice: 1000,
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  const handleToggleWishlist = (id) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Could not get your location. Please check browser permissions.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/listings');
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter Logic
  const filteredListings = useMemo(() => {
    let result = listings;

    // Apply Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title?.toLowerCase().includes(lowerSearch) ||
        item.merchant?.businessName?.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply Chip Filter
    if (activeFilter === 'Wishlist 💖') {
      result = result.filter(item => wishlist.includes(item._id));
    } else if (activeFilter === 'Vegetarian 🥬') {
      result = result.filter(item => item.dietaryType === 'Veg');
    } else if (activeFilter === 'Non-Veg 🍗') {
      result = result.filter(item => item.dietaryType === 'Non-Veg');
    } else if (activeFilter === 'Under ₹100 💰') {
      result = result.filter(item => item.discountedPrice < 100);
    }

    // Apply Advanced Filters
    if (advancedFilters.category !== 'All') {
      // Dummy data might not have standard categories, so do a fuzzy match or exact if possible
      result = result.filter(item => item.category === advancedFilters.category);
    }
    if (advancedFilters.dietaryType !== 'All') {
      result = result.filter(item => item.dietaryType === advancedFilters.dietaryType);
    }
    if (advancedFilters.maxPrice < 1000) {
      result = result.filter(item => item.discountedPrice <= advancedFilters.maxPrice);
    }

    return result;
  }, [listings, searchTerm, activeFilter, advancedFilters]);

  const filterChips = [
    'All Deals',
    'Wishlist 💖',
    'Vegetarian 🥬',
    'Non-Veg 🍗',
    'Under ₹100 💰'
  ];

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({
      category: 'All',
      dietaryType: 'All',
      maxPrice: 1000,
    });
    setActiveFilter('All Deals');
    setIsFilterModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Explore Nearby Deals</h1>
          <p className="text-slate-500 mt-1">Discover rescued food around you before it's gone.</p>
        </div>
        
        <div className="flex flex-col w-full md:w-auto">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search food, restaurants..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
              />
            </div>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-red-500 hover:border-red-500 transition-colors shadow-sm"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{viewMode === 'grid' ? 'Map View' : 'List View'}</span>
            </button>
          </div>
          
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full md:max-w-md lg:max-w-full">
            {filterChips.map(chip => (
              <span 
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors border ${
                  activeFilter === chip 
                    ? 'bg-red-50 text-red-600 border-red-100 font-semibold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50'
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="animate-pulse bg-slate-200 rounded-2xl h-80"></div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map(listing => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                isWishlisted={wishlist.includes(listing._id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-500 text-lg">
              No deals match your selected filters. 😢
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 z-0 relative">
          <button 
            onClick={handleLocateMe}
            disabled={locationLoading}
            className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700 transition-colors"
          >
            <Navigation className={`w-5 h-5 mr-2 text-red-500 ${locationLoading ? 'animate-spin' : ''}`} />
            {locationLoading ? 'Locating...' : 'Locate Me'}
          </button>
          <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0">
            <MapUpdater center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {filteredListings.map((listing) => {
              let position;
              if (listing.merchant?.address?.coordinates?.lat && listing.merchant?.address?.coordinates?.lng) {
                position = [listing.merchant.address.coordinates.lat, listing.merchant.address.coordinates.lng];
              } else {
                // Fallback: deterministic hash based offset from map center
                const hash = listing._id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const latOffset = (Math.sin(hash * 13) * 0.05);
                const lngOffset = (Math.cos(hash * 17) * 0.05);
                position = [MAP_CENTER[0] + latOffset, MAP_CENTER[1] + lngOffset];
              }
              
              const imgUrl = listing.image 
                ? (listing.image.startsWith('http') ? listing.image : ((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + listing.image)) 
                : (listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000');

              return (
                <Marker 
                  key={listing._id} 
                  position={position}
                  icon={createCustomIcon(listing.discountedPrice)}
                >
                  <Popup className="custom-popup" closeButton={false} autoPanPadding={[50, 50]}>
                    <div className="w-48 overflow-hidden rounded-xl border-none shadow-xl flex flex-col">
                      <img 
                        src={imgUrl} 
                        alt={listing.title} 
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-3 bg-white flex flex-col flex-grow">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{listing.title}</h3>
                        <p className="text-xs text-slate-500 truncate mb-3">{listing.merchant?.businessName || listing.merchant?.name || 'Local Merchant'}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-red-500 text-sm">₹{listing.discountedPrice}</span>
                          <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                            {listing.quantityAvailable || listing.quantity} left
                          </span>
                        </div>
                        <Link to={`/customer/food/${listing._id}`} className="w-full block text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition-colors mt-auto">
                          View Deal
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}

      {/* Advanced Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-red-500" /> Advanced Filters
                </h2>
                <button onClick={() => setIsFilterModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Food Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Cooked Food', 'Groceries', 'Baked Goods', 'Produce', 'Other'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setAdvancedFilters({...advancedFilters, category: cat})}
                        className={`py-2 px-3 rounded-xl text-sm font-semibold transition-colors ${
                          advancedFilters.category === cat 
                            ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Filter */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Dietary Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Veg', 'Non-Veg', 'Vegan', 'Mixed'].map(diet => (
                      <button
                        key={diet}
                        onClick={() => setAdvancedFilters({...advancedFilters, dietaryType: diet})}
                        className={`py-2 px-3 rounded-xl text-sm font-semibold transition-colors ${
                          advancedFilters.dietaryType === diet 
                            ? 'bg-green-500 text-white shadow-md shadow-green-500/20' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-slate-700">Max Price</label>
                    <span className="text-sm font-black text-red-500">
                      {advancedFilters.maxPrice === 1000 ? 'Any Price' : `Under ₹${advancedFilters.maxPrice}`}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="50"
                    value={advancedFilters.maxPrice}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>₹50</span>
                    <span>₹500</span>
                    <span>Any</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                <button 
                  onClick={handleResetFilters}
                  className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
