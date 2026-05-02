import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Zap, Shield, Heart } from 'lucide-react';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=2070&auto=format&fit=crop"
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={HERO_IMAGES[currentImageIndex]}
                alt="Gym Background"
                className="w-full h-full object-cover grayscale brightness-50"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-tight leading-[0.9] mb-4">
              FORGE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 italic">LEGACY</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium">
              Transform your body, elevate your mind. Join GymFusion and unlock your true potential with world-class trainers and cutting-edge equipment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest transition-all scale-100 hover:scale-105 active:scale-95 shadow-xl shadow-orange-950/20"
              >
                Join Now →
              </Link>
              <Link
                to="/about"
                className="bg-white/5 border border-white/20 hover:bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest transition-all scale-100 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3">
          {HERO_IMAGES.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 transition-all duration-500 rounded-full ${
                idx === currentImageIndex 
                  ? 'w-12 bg-orange-600' 
                  : 'w-2 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Logo Text Opacity Background */}
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none hidden xl:block">
          <span className="text-[400px] font-black italic">ELITE</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-orange-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Unmatched Standards</h2>
            <h3 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">Superior Infrastructure</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Award className="text-orange-600" size={40} />, 
                title: "Elite Coaching", 
                desc: "Certified professionals with olympic-level experience to guide your journey." 
              },
              { 
                icon: <Zap className="text-orange-600" size={40} />, 
                title: "Dynamic Growth", 
                desc: "Data-driven training methods optimized for significant physical transformation." 
              },
              { 
                icon: <Shield className="text-orange-600" size={40} />, 
                title: "Elite Arsenal", 
                desc: "Top-tier industrial machinery maintained to the absolute highest specifications." 
              },
              { 
                icon: <Heart className="text-orange-600" size={40} />, 
                title: "Metabolic Logic", 
                desc: "Biological optimization through precision nutrition and recovery protocols." 
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900/50 p-10 border border-zinc-800 rounded-3xl hover:border-orange-600/50 transition-all hover:bg-zinc-900 duration-500"
              >
                <div className="mb-8 p-4 bg-orange-600/10 w-fit rounded-2xl">{feature.icon}</div>
                <h4 className="text-xl font-black uppercase mb-4 italic tracking-tight">{feature.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-zinc-900/20 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-orange-600/20 blur-3xl rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop" 
                alt="Gym Interior" 
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl grayscale brightness-75 border border-zinc-800"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center animate-pulse">
                  <Shield size={40} className="text-white" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <div>
                <h2 className="text-orange-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Our History</h2>
                <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-6">Built For The <span className="text-orange-600">Committed</span></h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                  GymFusion started with a simple goal: provide a no-nonsense environment for serious athletes. We've eliminated the fluff and focused on the essentials—heavy iron, expert guidance, and an atmosphere that demands progress. 
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-black italic tracking-tighter text-white mb-2">15+</p>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Elite Trainers</p>
                </div>
                <div>
                  <p className="text-4xl font-black italic tracking-tighter text-white mb-2">100+</p>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Iron Machines</p>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center space-x-3 text-orange-600 font-black uppercase italic tracking-widest hover:text-white transition-all group"
              >
                <span>Full Story</span>
                <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-orange-600 to-red-700 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-8 text-white tracking-tighter leading-none">
            Forge A <br /> New Reality
          </h2>
          <p className="text-orange-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
            Stop making excuses. A year from today, you'll wish you had started now. The elite tribe is waiting.
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-600 hover:bg-orange-50 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all scale-100 hover:scale-105 active:scale-95 shadow-2xl"
          >
            Claim Your Spot
          </Link>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none overflow-hidden">
          <span className="text-[30vw] font-black uppercase italic text-black whitespace-nowrap">EXTREME EXTREME</span>
        </div>
      </section>
    </div>
  );
};

export default Home;

