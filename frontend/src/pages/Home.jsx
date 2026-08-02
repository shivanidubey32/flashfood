import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full bg-white font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20">
        
        {/* Background Sweeping SVG Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M-100 200 C 300 -100, 600 500, 1500 200" stroke="#d2642b" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M-100 700 C 400 900, 900 100, 1500 600" stroke="#d2642b" strokeWidth="1" strokeOpacity="0.2" fill="none" />
            <path d="M300 -100 C 500 300, 100 700, 600 900" stroke="#1f3a1f" strokeWidth="1" strokeOpacity="0.15" fill="none" />
          </svg>
        </div>

        {/* Floating Elements (Food Images) */}
        {/* Burger - Top Left */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-10 md:left-32 w-32 h-32 md:w-48 md:h-48 z-0 pointer-events-none"
        >
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" alt="Burger" className="w-full h-full object-cover rounded-full mix-blend-multiply shadow-2xl border-4 border-white" />
        </motion.div>

        {/* Pizza - Bottom Right */}
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-10 md:right-32 w-40 h-40 md:w-56 md:h-56 z-0 pointer-events-none"
        >
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop" alt="Pizza" className="w-full h-full object-cover rounded-full mix-blend-multiply shadow-2xl border-4 border-white" />
        </motion.div>

        {/* Dim Sum / Momo - Top Right */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-32 right-20 md:right-48 w-24 h-24 md:w-36 md:h-36 z-0 pointer-events-none"
        >
          <img src="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=500&auto=format&fit=crop" alt="Dumplings" className="w-full h-full object-cover rounded-full mix-blend-multiply shadow-2xl border-4 border-white" />
        </motion.div>

        {/* Tiny tomato / accent - Bottom Left */}
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-52 left-20 md:left-40 w-16 h-16 md:w-20 md:h-20 z-0 pointer-events-none"
        >
          <img src="https://images.unsplash.com/photo-1524586322045-8869cecd9e69?q=80&w=200&auto=format&fit=crop" alt="Tomato" className="w-full h-full object-cover rounded-full mix-blend-multiply shadow-md border-2 border-white" />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex-grow flex flex-col justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8"
            style={{ color: '#d2642b' }}
          >
            Better food for <br/> less waste
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium"
          >
            FlashFood helps customers discover surplus food from local restaurants, cafes, and stores at affordable prices while helping businesses reduce food waste and maximize their revenue.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/explore" className="group flex items-center justify-center space-x-2 text-white px-10 py-4 rounded-full text-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto" style={{ backgroundColor: '#d2642b' }}>
              <span>Order Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/partner" className="group flex items-center justify-center space-x-2 bg-white px-10 py-4 rounded-full text-xl font-bold transition-all shadow-md hover:shadow-lg border-2 w-full sm:w-auto" style={{ color: '#1f3a1f', borderColor: '#1f3a1f' }}>
              <span>Partner With Us</span>
            </Link>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="w-full mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-4 pb-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#fae8b6] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between"
            >
              <div className="flex-1 text-center border-b md:border-b-0 md:border-r border-slate-200 p-4">
                <h3 className="text-4xl md:text-5xl font-black text-[#1f3a1f] mb-2">10,000+</h3>
                <p className="text-slate-500 font-medium text-lg uppercase tracking-wider">Meals Rescued</p>
              </div>
              <div className="flex-1 text-center border-b md:border-b-0 md:border-r border-slate-200 p-4">
                <h3 className="text-4xl md:text-5xl font-black text-[#1f3a1f] mb-2">500+</h3>
                <p className="text-slate-500 font-medium text-lg uppercase tracking-wider">Partner Stores</p>
              </div>
              <div className="flex-1 text-center p-4">
                <h3 className="text-4xl md:text-5xl font-black text-[#1f3a1f] mb-2">50,000+</h3>
                <p className="text-slate-500 font-medium text-lg uppercase tracking-wider">Happy Users</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section (Styled to match new theme) */}
      <section className="py-24" style={{ backgroundColor: '#fae8b6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#1f3a1f] mb-4">How FlashFood Works</h2>
            <p className="text-xl text-slate-700">Three simple steps to save money and reduce waste.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: MapPin, title: "1. Discover", desc: "Find nearby stores with surplus food on our map." },
              { icon: Tag, title: "2. Reserve", desc: "Reserve your bag at a massive discount." },
              { icon: Clock, title: "3. Pick Up", desc: "Head to the store to collect your food." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-10 rounded-3xl bg-white shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8" style={{ backgroundColor: '#f3e9d2', color: '#c4563a' }}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#1b3d22] mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
