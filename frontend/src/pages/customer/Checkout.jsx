import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, MapPin, CreditCard, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const tax = cartTotal * 0.05;
  const total = cartTotal + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Group items by merchant (since backend expects 1 merchant per order)
      const ordersByMerchant = cartItems.reduce((acc, item) => {
        const merchantId = item.merchant?._id || item.merchant; // handle populated vs unpopulated
        if (!acc[merchantId]) acc[merchantId] = [];
        acc[merchantId].push(item);
        return acc;
      }, {});

      // Simulate a realistic payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo.token;

      if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Post an order for each merchant
        for (const merchantId in ordersByMerchant) {
          const items = ordersByMerchant[merchantId];
          
          const orderTotal = items.reduce((sum, i) => sum + (i.discountedPrice * i.cartQuantity), 0);
          const orderTax = orderTotal * 0.05;

          const orderData = {
            merchantId: merchantId,
            orderItems: items.map(i => ({
              listing: i._id,
              name: i.title,
              qty: i.cartQuantity,
              price: i.discountedPrice
            })),
            totalPrice: orderTotal + orderTax,
            pickupMethod: 'Pickup',
            isPaid: true
          };

          await axios.post(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/orders', orderData, config);
        }
      }

      setPaymentSuccess(true);
      clearCart();
      
      // Redirect after showing success
      setTimeout(() => {
        navigate('/customer/orders');
      }, 2000);

    } catch (error) {
      console.error("Payment failed", error);
      showToast("Payment failed. Please try again.", "error");
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h2>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          Your order has been sent to the merchant. Please head to the store within your pickup window.
        </p>
      </div>
    );
  }

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
            {toast.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Payment Form (Mock Razorpay style inside page) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-8 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-bold tracking-wide uppercase text-sm">Secure Checkout</span>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors border-2 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors border-2 ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <span className="text-lg font-black tracking-tighter">UPI</span>
                <span className="text-xs font-normal opacity-80">(GPay/Paytm)</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Card Information</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="4111 1111 1111 1111" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      defaultValue="4242 4242 4242 4242"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" defaultValue="12/26" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CVC</label>
                    <input type="password" placeholder="123" defaultValue="123" required maxLength="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cardholder Name</label>
                  <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Enter UPI ID</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input 
                      type="text" 
                      required
                      placeholder="username@okaxis" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Works with Google Pay, PhonePe, Paytm, and BHIM</p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || cartItems.length === 0}
              className="w-full mt-8 flex items-center justify-center bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pay ₹${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <h2 className="text-xl font-bold mb-6 relative z-10">Pickup Details</h2>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  {Array.from(new Map(cartItems.map(item => [item.merchant?._id || item.merchant?.businessName, item.merchant])).values()).length === 1 ? (
                    <>
                      <p className="font-semibold text-sm">{cartItems[0]?.merchant?.businessName || 'Local Store'}</p>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {cartItems[0]?.merchant?.address?.street 
                          ? `${cartItems[0].merchant.address.street}, ${cartItems[0].merchant.address.city}`
                          : 'Pickup address will be provided on the final receipt.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-sm">Multiple Locations</p>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">Check individual item receipts for precise store locations and pickup windows after payment.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Items</h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-700">{item.cartQuantity}x</span>
                    <span className="text-slate-600">{item.title}</span>
                  </div>
                  <span className="font-semibold text-slate-900">₹{(item.discountedPrice * item.cartQuantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-semibold">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="text-slate-900 font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
