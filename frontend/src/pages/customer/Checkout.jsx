import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, MapPin, CreditCard, CheckCircle, Loader2, XCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const tax = cartTotal * 0.05;
  const total = cartTotal + tax;

  const getMerchantAddress = (merchant) => {
    if (!merchant || !merchant.address) return 'Pickup address will be provided on the final receipt.';
    if (typeof merchant.address === 'string') return merchant.address;
    
    const parts = [];
    if (merchant.address.street) parts.push(merchant.address.street);
    if (merchant.address.city) parts.push(merchant.address.city);
    if (merchant.address.state) parts.push(merchant.address.state);
    if (merchant.address.zipCode) parts.push(merchant.address.zipCode);
    
    return parts.length > 0 ? parts.join(', ') : 'Pickup address will be provided on the final receipt.';
  };

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
          
          const orderTotal = items.reduce((sum, i) => sum + ((i.discountedPrice || i.price || 0) * (i.cartQuantity || i.qty || 1)), 0);
          const orderTax = orderTotal * 0.05;

          const orderData = {
            merchantId: merchantId,
            orderItems: items.map(i => ({
              listing: i._id,
              name: i.title,
              qty: i.cartQuantity || i.qty || 1,
              price: i.discountedPrice || i.price || 0
            })),
            totalPrice: orderTotal + orderTax,
            pickupMethod: deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup',
            deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
            isPaid: paymentMethod !== 'cod',
            paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'
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
      const msg = error.response?.data?.message || "Payment failed. Please try again.";
      showToast(msg, "error");
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Order Successful!</h2>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          {deliveryMethod === 'delivery' 
            ? 'Your order has been sent to the merchant and will be delivered to your address.' 
            : 'Your order has been sent to the merchant. Please head to the store within your pickup window.'}
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

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Step 1: Order Items */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Order Summary</h2>
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

        {/* Step 2: Fulfillment */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Order Fulfillment</h2>
          <div className="flex space-x-2 mb-6">
             <button onClick={() => setDeliveryMethod('pickup')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors border-2 ${deliveryMethod === 'pickup' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}>Store Pickup</button>
             <button onClick={() => setDeliveryMethod('delivery')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors border-2 ${deliveryMethod === 'delivery' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}>Delivery</button>
          </div>
          
          <div className="space-y-4">
            {deliveryMethod === 'pickup' ? (
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <MapPin className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  {Array.from(new Map(cartItems.map(item => [item.merchant?._id || item.merchant?.businessName, item.merchant])).values()).length === 1 ? (
                    <>
                      <p className="font-semibold text-sm">{cartItems[0]?.merchant?.businessName || 'Local Store'}</p>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        {getMerchantAddress(cartItems[0]?.merchant)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-sm">Multiple Locations</p>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">Check individual item receipts for precise store locations and pickup windows after payment.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Delivery Address</label>
                
                {/* Saved Address 1 */}
                <div 
                  onClick={() => { setDeliveryAddress('123 Tech Park, Phase 1, Kanpur'); }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryAddress === '123 Tech Park, Phase 1, Kanpur' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-sm">Home</span>
                    {deliveryAddress === '123 Tech Park, Phase 1, Kanpur' && <CheckCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-slate-500 text-xs">123 Tech Park, Phase 1, Kanpur</p>
                </div>
                
                {/* Saved Address 2 */}
                <div 
                  onClick={() => { setDeliveryAddress('45 Business Tower, IT Hub, Kanpur'); }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryAddress === '45 Business Tower, IT Hub, Kanpur' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-sm">Work</span>
                    {deliveryAddress === '45 Business Tower, IT Hub, Kanpur' ? <CheckCircle className="w-4 h-4 text-red-500" /> : null}
                  </div>
                  <p className="text-slate-500 text-xs">45 Business Tower, IT Hub, Kanpur</p>
                </div>

                {/* Other Address */}
                <div 
                  onClick={() => { setDeliveryAddress(''); }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryAddress !== '123 Tech Park, Phase 1, Kanpur' && deliveryAddress !== '45 Business Tower, IT Hub, Kanpur' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900 text-sm">Other Address</span>
                    {deliveryAddress !== '123 Tech Park, Phase 1, Kanpur' && deliveryAddress !== '45 Business Tower, IT Hub, Kanpur' ? <CheckCircle className="w-4 h-4 text-red-500" /> : null}
                  </div>
                  {deliveryAddress !== '123 Tech Park, Phase 1, Kanpur' && deliveryAddress !== '45 Business Tower, IT Hub, Kanpur' && (
                    <textarea 
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full street address, apartment, and city..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-20 text-sm"
                    ></textarea>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Payment Form */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">3. Payment Method</h2>
            <div className="flex items-center space-x-1 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold uppercase text-[10px]">Secure</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="flex space-x-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-colors border-2 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-colors border-2 ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <span className="font-black text-sm leading-5 mb-1">UPI</span>
                <span className="text-xs font-bold opacity-80">App</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-colors border-2 ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <Wallet className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">COD</span>
              </button>
            </div>

            {paymentMethod === 'cod' ? (
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center space-y-3 mb-6">
                 <Wallet className="w-10 h-10 text-slate-400 mx-auto" />
                 <h3 className="font-bold text-slate-700">Cash on Delivery</h3>
                 <p className="text-sm text-slate-500">You can pay via cash or UPI when your order is {deliveryMethod === 'delivery' ? 'delivered to your address' : 'picked up at the store'}.</p>
              </div>
            ) : paymentMethod === 'card' ? (
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
              disabled={loading || cartItems.length === 0 || (deliveryMethod === 'delivery' && !deliveryAddress)}
              className="w-full mt-8 flex items-center justify-center bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : paymentMethod === 'cod' ? `Place Order • ₹${total.toFixed(2)}` : `Pay ₹${total.toFixed(2)}`}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
