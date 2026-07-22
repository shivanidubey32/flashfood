import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Users, HandHeart, Store, ShieldCheck, 
  Lightbulb, Globe, TrendingDown, Clock, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Counter Component
const Counter = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(animate);
        }
      };
      window.requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Reusable Section Reveal Component
const RevealSection = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  return (
    <div className="w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center pt-24 pb-16 px-4">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 font-semibold text-sm mb-6">
              Our Mission
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Reimagining the future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
                food sustainability.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              We connect food outlets with surplus food to conscious consumers and local NGOs, ensuring good food ends up in bellies, not landfills.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/explore" className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/40 hover:-translate-y-1 w-full sm:w-auto">
                Join the Movement
              </Link>
              <Link to="/partner" className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:border-red-500 hover:text-red-500 transition-all w-full sm:w-auto">
                Become a Partner
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Story */}
      <RevealSection className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-orange-50 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200" 
                alt="Food sustainability and community" 
                className="relative rounded-3xl shadow-xl w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Our Story</h2>
              
              <h3 className="text-xl text-red-500 font-semibold mb-4 flex items-center">
                <TrendingDown className="w-6 h-6 mr-2" />
                The Problem of Food Waste
              </h3>
              
              {/* Added explicit image for food waste reduction */}
              <img 
                src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=1000" 
                alt="Food Waste Illustration" 
                className="w-full h-48 object-cover rounded-2xl shadow-md mb-6"
              />

              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Every year, one-third of all food produced globally goes to waste, while millions suffer from food insecurity. This waste contributes heavily to greenhouse gas emissions. We realized that much of this "waste" is actually perfectly good, fresh food that simply wasn't sold by the end of the day.
              </p>
              
              <h3 className="text-xl text-green-500 font-semibold mb-4">The FlashFood Solution</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                FlashFood was born from a simple idea: build a technological bridge between surplus food and empty plates. Our hyper-local marketplace empowers restaurants to recover costs, allows customers to access premium meals at huge discounts, and enables seamless donations to NGOs. 
              </p>
              
              <div className="flex items-center space-x-4 text-slate-800 font-semibold">
                <Leaf className="w-6 h-6 text-green-500" />
                <span>Better for people. Better for the planet.</span>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 3. Impact Statistics */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact So Far</h2>
            <p className="text-slate-400 text-lg">Every meal saved is a step towards a sustainable future.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { label: "Meals Saved", value: 125, suffix: "K+" },
              { label: "Partner Merchants", value: 450, suffix: "+" },
              { label: "Active NGOs", value: 85, suffix: "+" },
              { label: "Happy Customers", value: 45, suffix: "K+" },
              { label: "CO₂ Prevented", value: 320, suffix: "T" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-500 mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-sm md:text-base text-slate-300 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How FlashFood Works */}
      <RevealSection className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A seamless ecosystem designed to benefit everyone involved.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Customers</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-blue-500 mr-2 shrink-0" /> Browse local flash deals.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-blue-500 mr-2 shrink-0" /> Reserve food at 50-70% off.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-blue-500 mr-2 shrink-0" /> Pick up in-store and enjoy.</li>
              </ul>
            </motion.div>

            {/* Merchant Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Merchants</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-orange-500 mr-2 shrink-0" /> List surplus inventory easily.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-orange-500 mr-2 shrink-0" /> Recover sunk costs & attract users.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-orange-500 mr-2 shrink-0" /> Donate directly to NGOs.</li>
              </ul>
            </motion.div>

            {/* NGO Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <HandHeart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For NGOs</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-green-500 mr-2 shrink-0" /> Receive real-time donation alerts.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-green-500 mr-2 shrink-0" /> Claim bulk surplus food instantly.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 text-green-500 mr-2 shrink-0" /> Feed communities in need.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* 5. Core Values */}
      <RevealSection className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Our Core Values</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { icon: Globe, title: "Sustainability", desc: "Protecting our planet first." },
              { icon: HandHeart, title: "Community", desc: "Uplifting local neighborhoods." },
              { icon: ShieldCheck, title: "Transparency", desc: "Honest and open operations." },
              { icon: Lightbulb, title: "Innovation", desc: "Tech-driven green solutions." }
            ].map((value, idx) => (
              <div key={idx} className="flex flex-col items-center max-w-xs p-6 group">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 text-slate-700 shadow-sm">
                  <value.icon className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h4>
                <p className="text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* 6. Why Choose FlashFood (Feature Cards) */}
      <RevealSection className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose FlashFood</h2>
            <p className="text-lg text-slate-600">Delivering value across the entire food supply chain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingDown, title: "Reduce Food Waste", color: "text-green-600 bg-green-100", desc: "Directly contribute to minimizing the massive ecological footprint of wasted food.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800" },
              { icon: Clock, title: "Affordable Meals", color: "text-blue-600 bg-blue-100", desc: "Access high-quality restaurant meals at a fraction of the original cost.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800" },
              { icon: Store, title: "Support Local Business", color: "text-orange-600 bg-orange-100", desc: "Help local cafes and bakeries recover costs and stay profitable.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800" },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col ${feature.image ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {feature.image && (
                  <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover rounded-xl mb-6 shadow-sm" />
                )}
                <div className="flex gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-500 to-orange-500 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-red-100 mb-10">
            Whether you're looking for a great meal, want to sell surplus food, or represent an NGO, there's a place for you here.
          </p>
          <Link to="/register" className="inline-block bg-white text-red-600 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:bg-slate-50 hover:scale-105 transition-all">
            Get Started Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
