import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="absolute inset-0 w-full h-full">
          {/* Abstract background shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Rescue delicious food, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              save the planet.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Discover surplus food from your favorite local restaurants and cafes at up to 70% off before it goes to waste.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/explore" className="group flex items-center justify-center space-x-2 bg-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 w-full sm:w-auto">
              <span>Find Food Nearby</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/partner" className="group flex items-center justify-center space-x-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:border-red-500 hover:text-red-500 transition-all w-full sm:w-auto">
              <span>I'm a Business</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How FlashFood Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to save money and reduce food waste.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: MapPin, title: "1. Discover", desc: "Find nearby stores with surplus food on our interactive map." },
              { icon: Tag, title: "2. Reserve", desc: "Reserve your mystery bag or specific items at a massive discount." },
              { icon: Clock, title: "3. Pick Up", desc: "Head to the store at the specified time to collect your food." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
