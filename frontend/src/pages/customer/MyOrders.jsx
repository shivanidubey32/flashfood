import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  Package, CheckCircle2, Clock, MapPin, 
  ChefHat, XCircle, QrCode, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// In production, this should point to your deployed URL
const socket = io(import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'));

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(null); 
  const [reviewModal, setReviewModal] = useState({ show: false, orderId: null, rating: 5, comment: '' });
  const [reviewedOrders, setReviewedOrders] = useState([]);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!userInfo.token) {
      setLoading(false);
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api/orders/myorders'), config);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Listen for real-time status updates from the Merchant Portal
    const updateListener = (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    };

    socket.on(`order-update-${userInfo._id}`, updateListener);

    return () => {
      socket.off(`order-update-${userInfo._id}`, updateListener);
    };
  }, [userInfo._id, userInfo.token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Accepted': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'Preparing': return <ChefHat className="w-5 h-5 text-purple-500" />;
      case 'Ready': return <Package className="w-5 h-5 text-green-500 animate-pulse" />;
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Accepted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Preparing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Ready': return 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const submitReview = async () => {
    if (!reviewModal.comment.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/reviews', {
        orderId: reviewModal.orderId,
        listingId: reviewModal.listingId,
        rating: reviewModal.rating,
        comment: reviewModal.comment
      }, config);
      setReviewedOrders(prev => [...prev, reviewModal.orderId]);
      setReviewModal({ show: false, orderId: null, listingId: null, rating: 5, comment: '' });
      alert("Review submitted successfully! Thank you.");
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message === 'You have already reviewed this order') {
        setReviewedOrders(prev => [...prev, reviewModal.orderId]);
        alert("You have already reviewed this order.");
      } else {
        alert("Failed to submit review.");
      }
      setReviewModal({ show: false, orderId: null, listingId: null, rating: 5, comment: '' });
    }
  };

  if (loading) return <div className="p-8 text-center mt-20">Loading orders...</div>;
  if (!userInfo.token) return <div className="p-8 text-center mt-20">Please log in to view your orders.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Order Tracking</h1>

      {orders.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-3xl border border-slate-100 shadow-sm">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">No orders yet</h2>
          <p className="text-slate-500 mt-2">When you save food, your active orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                  <div className={`px-3 py-1.5 rounded-full border flex items-center text-xs font-bold ${getStatusColor(order.status)}`}>
                    <span className="mr-1.5">{getStatusIcon(order.status)}</span>
                    {order.status}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{item.qty}x {item.name}</span>
                      <span className="text-slate-500">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">Total</span>
                  <span className="text-lg font-black text-slate-900">₹{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="md:w-64 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pickup Information</p>
                  <p className="text-sm font-semibold text-slate-900 flex items-start mb-2">
                    <MapPin className="w-4 h-4 text-slate-400 mr-1.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {order.merchant?.address?.street 
                        ? `${order.merchant.address.street}, ${order.merchant.address.city}`
                        : `${order.merchant?.businessName || order.merchant?.name || 'Merchant'} Location`}
                    </span>
                  </p>
                </div>
                
                {order.status === 'Ready' && (
                  <button 
                    onClick={() => setShowQR(order._id)}
                    className="w-full mt-4 flex items-center justify-center bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Pickup QR
                  </button>
                )}
                {order.status === 'Completed' && (
                  reviewedOrders.includes(order._id) ? (
                    <div className="w-full mt-4 text-sm font-bold text-green-600 bg-green-50 text-center py-2.5 rounded-xl border border-green-200">
                      Reviewed
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReviewModal({ show: true, orderId: order._id, listingId: order.orderItems[0]?.listing?._id || order.orderItems[0]?.listing, rating: 5, comment: '' })}
                      className="w-full mt-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors border border-slate-300 py-2.5 rounded-xl hover:bg-slate-100"
                    >
                      Leave a Review
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal for Verification */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 relative flex flex-col items-center"
            >
              <button 
                onClick={() => setShowQR(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-black text-slate-900 mb-2">Pickup Verification</h3>
              <p className="text-sm text-slate-500 text-center mb-8">Show this code to the merchant to securely pick up your food.</p>
              
              <div className="w-48 h-48 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden p-4">
                {/* Mock QR Pattern generator for visually appealing UI */}
                <div className="absolute inset-2 grid grid-cols-5 grid-rows-5 gap-1">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className={`bg-slate-900 ${Math.random() > 0.3 ? 'opacity-100' : 'opacity-0'} rounded-sm`}></div>
                  ))}
                  <div className="absolute top-0 left-0 w-8 h-8 border-4 border-slate-900 rounded-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-4 border-slate-900 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-4 border-slate-900 rounded-lg"></div>
                </div>
              </div>
              
              <p className="mt-8 font-mono font-bold text-slate-400 tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                {showQR.slice(-8).toUpperCase()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 relative flex flex-col items-center"
            >
              <button 
                onClick={() => setReviewModal({ show: false, orderId: null, listingId: null, rating: 5, comment: '' })}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-black text-slate-900 mb-2">Leave a Review</h3>
              <p className="text-sm text-slate-500 text-center mb-6">How was your rescued food experience?</p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setReviewModal(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <svg 
                      className={`w-10 h-10 ${star <= reviewModal.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>

              <textarea 
                value={reviewModal.comment}
                onChange={(e) => setReviewModal(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your thoughts about the meal and merchant..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none h-32 focus:ring-2 focus:ring-slate-900 focus:outline-none mb-6"
              ></textarea>
              
              <button 
                onClick={submitReview}
                disabled={!reviewModal.comment.trim()}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
