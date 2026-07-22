import { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Reviews = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // We can fetch from public route if we have merchant ID, or we can use our ID
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/reviews/merchant/${userInfo._id}`);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [userInfo._id, userInfo.token]);

  const handleReply = async (id) => {
    if(!replyText[id]) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/reviews/${id}/reply`, {
        reply: replyText[id]
      }, config);
      
      setReviews(reviews.map(r => r._id === id ? { ...r, reply: data.reply } : r));
      setReplyText({ ...replyText, [id]: '' });
      showToast('Reply posted successfully!');
    } catch (error) {
      console.error("Error replying to review", error);
      showToast('Failed to post reply.', 'error');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customer Reviews</h1>
        <p className="text-slate-600 mt-1">Read and respond to feedback from your customers.</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading reviews...</div>
        ) : (
          <AnimatePresence>
            {reviews.map((review, idx) => (
              <motion.div 
                key={review._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
              >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{review.customer?.name || 'Customer'}</h3>
                  <span className="text-xs text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 mr-1 fill-current" /> {review.rating}.0
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">{review.comment}</p>
              
              {review.reply ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                  <MessageSquare className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Your Reply</h4>
                    <p className="text-slate-600 text-sm">{review.reply}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={replyText[review._id] || ''}
                    onChange={(e) => setReplyText({...replyText, [review._id]: e.target.value})}
                    placeholder="Write a reply..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <button 
                    onClick={() => handleReply(review._id)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Reviews;
