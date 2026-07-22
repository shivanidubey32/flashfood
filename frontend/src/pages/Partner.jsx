import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Banknote, Leaf, Users, HeartHandshake,
  Utensils, Coffee, Croissant, ShoppingCart, Home,
  ArrowRight, CheckCircle2
} from 'lucide-react';

const Partner = () => {
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setToast({ show: true, message: 'Registration request sent! We will contact you soon.' });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
    e.target.reset(); // Optionally clear the form
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
        >
          Partner With FlashFood
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-300 max-w-2xl mx-auto mb-10"
        >
          Join our mission to eliminate food waste. Sell surplus food to reach new customers, or donate it to support local communities.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10">
        {/* 1. Partner Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Banknote, title: 'Earn More Revenue', desc: 'Turn surplus food into profit instead of a loss.', color: 'text-green-500', bg: 'bg-green-100' },
            { icon: Leaf, title: 'Reduce Food Waste', desc: 'Lower your carbon footprint and help the environment.', color: 'text-teal-500', bg: 'bg-teal-100' },
            { icon: Users, title: 'Reach New Customers', desc: 'Attract eco-conscious diners to your business.', color: 'text-blue-500', bg: 'bg-blue-100' },
            { icon: HeartHandshake, title: 'Support Communities', desc: 'Donate directly to verified local NGOs.', color: 'text-rose-500', bg: 'bg-rose-100' }
          ].map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${benefit.bg}`}>
                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 2. How It Works */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">A simple process designed for busy businesses.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
            
            {[
              { step: '1', title: 'Register', desc: 'Sign up as a Partner' },
              { step: '2', title: 'List Surplus', desc: 'Post unsold food easily' },
              { step: '3', title: 'Discover', desc: 'Users & NGOs find it' },
              { step: '4', title: 'Impact', desc: 'Food is sold or donated' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative w-full md:w-1/4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-black border-4 border-slate-50 mb-4 z-10 shadow-lg">
                  {item.step}
                </div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* 3. Who Can Join */}
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Who Can Join?</h2>
            <p className="text-slate-500 mb-8">If you deal with food, you belong on FlashFood.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Utensils, label: 'Restaurants' },
                { icon: Coffee, label: 'Cafés' },
                { icon: Croissant, label: 'Bakeries' },
                { icon: ShoppingCart, label: 'Grocery Stores' },
                { icon: Home, label: 'NGOs' }
              ].map((type, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3 hover:border-slate-400 transition-colors">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                    <type.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Impact Statistics */}
          <div className="bg-slate-900 text-white rounded-3xl p-10 shadow-xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-bold mb-8 relative z-10">Our Collective Impact</h2>
            
            <div className="grid grid-cols-2 gap-8 relative z-10">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-green-400"
                >
                  500+
                </motion.div>
                <div className="text-slate-400 text-sm mt-1 font-medium">Partner Businesses</div>
              </div>
              
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-black text-blue-400"
                >
                  10k+
                </motion.div>
                <div className="text-slate-400 text-sm mt-1 font-medium">Meals Saved</div>
              </div>
              
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-black text-rose-400"
                >
                  50+
                </motion.div>
                <div className="text-slate-400 text-sm mt-1 font-medium">NGO Partners</div>
              </div>
              
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black text-amber-400"
                >
                  1k+
                </motion.div>
                <div className="text-slate-400 text-sm mt-1 font-medium">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Partner Registration Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">Become a Partner</h2>
            <p className="text-slate-500 mt-2">Fill out the form below and our team will contact you shortly.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Business/NGO Name</label>
              <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="e.g. Fresh Bakery" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="hello@bakery.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 font-bold text-sm">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    required 
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Please enter a valid 10-digit mobile number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-slate-900" 
                    placeholder="98765 43210" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Partner Type</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option>Restaurant / Café</option>
                  <option>Bakery</option>
                  <option>Grocery Store</option>
                  <option>NGO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="e.g. Kanpur" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl mt-4 hover:bg-slate-800 transition-colors flex items-center justify-center">
              Submit Request <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>
        </div>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 font-bold border border-slate-700"
          >
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Partner;
