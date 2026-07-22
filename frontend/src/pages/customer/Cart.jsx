import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    showToast('Item removed from cart', 'success');
  };

  const tax = cartTotal * 0.05; // 5% mock tax
  const total = cartTotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added any delicious surplus food yet.</p>
        <Link to="/customer/explore" className="bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all">
          Explore Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <img 
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100'} 
                alt={item.title} 
                className="w-20 h-20 object-cover rounded-xl shrink-0" 
              />
              
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">{item.title}</h3>
                <p className="text-sm text-slate-500 truncate">{item.merchant?.businessName || 'Local Store'}</p>
                <div className="text-red-500 font-bold mt-1">₹{item.discountedPrice}</div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <button onClick={() => handleRemove(item._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition-colors font-bold"
                  >-</button>
                  <span className="w-8 text-center font-bold text-slate-900 text-sm">{item.cartQuantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition-colors font-bold"
                  >+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-medium text-slate-600 mb-6 border-b border-slate-100 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees (5%)</span>
                <span className="text-slate-900 font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Platform Fee</span>
                <span>Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-slate-900">Total to Pay</span>
              <span className="text-2xl font-black text-slate-900">₹{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => navigate('/customer/checkout')}
              className="w-full flex items-center justify-center bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
