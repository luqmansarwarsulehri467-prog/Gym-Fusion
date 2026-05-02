import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Users, Zap, Shield, Heart, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="text-white bg-zinc-950 min-h-screen">
      {/* Header Section */}
      <section className="relative py-32 overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571902258032-6803f3d6e9e1?q=80&w=2070&auto=format&fit=crop" 
            alt="Gym Landscape" 
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950 to-zinc-950"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-orange-600 font-bold uppercase tracking-[0.4em] text-xs mb-4">Establishing Excellence</h2>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-none">
              ABOUT <span className="text-orange-600">GYMFUSION</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
              Founded on the principles of extreme dedication and biological optimization, GymFusion is more than a training facility—it's the epicenter of physical evolution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-orange-600/20 blur-3xl rounded-full z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop" 
                alt="Gym Equipment" 
                className="relative z-10 w-full h-[600px] object-cover rounded-3xl grayscale border border-zinc-800 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-10 -right-10 bg-orange-600 p-8 rounded-2xl skew-x-[-12deg] shadow-2xl z-20 hidden md:block">
                <p className="skew-x-[12deg] text-3xl font-black italic tracking-tighter">SINCE 2018</p>
              </div>
            </motion.div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-orange-600 font-bold uppercase tracking-[0.2em] text-sm">Our Mission</h3>
                <h4 className="text-4xl font-black uppercase italic tracking-tight leading-tight">Elite Training For The <span className="text-orange-600">Dedicated Few.</span></h4>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  At GymFusion, we believe that mediocrity is a choice. Our facility was built to provide the tools, environment, and expertise necessary for those who refuse to settle. We've combined industrial-grade equipment with scientific recovery protocols to create a comprehensive ecosystem for high-performance living.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 w-fit rounded-xl">
                    <Target className="text-orange-600" size={24} />
                  </div>
                  <h5 className="font-black uppercase italic tracking-widest text-sm">Growth Mindset</h5>
                  <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-tighter">We focus on measurable progress and continuous physical breakthroughs.</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 w-fit rounded-xl">
                    <Shield className="text-orange-600" size={24} />
                  </div>
                  <h5 className="font-black uppercase italic tracking-widest text-sm">Discipline Matrix</h5>
                  <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-tighter">Structure is the foundation of freedom. We maintain the highest training standards.</p>
                </div>
              </div>

              <div className="pt-8 block">
                 <div className="bg-zinc-900/50 border-l-4 border-orange-600 p-6 italic">
                   <p className="text-zinc-400 font-medium">"Transformation is not an event, it's a relentless pursuit of the better version of yourself. We provide the forge; you provide the fire."</p>
                   <p className="mt-4 text-white font-black uppercase tracking-widest text-xs">— Luqman Sarwar, Founder</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: "500+", label: "Active Assets" },
              { val: "15+", label: "Elite Coaches" },
              { val: "100+", label: "Industrial Machines" },
              { val: "24/7", label: "Sector Access" },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-4xl md:text-6xl font-black italic tracking-tighter text-orange-600 mb-2">{stat.val}</p>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-orange-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Operational Sector</h3>
            <h4 className="text-5xl font-black uppercase italic tracking-tighter">THE ARMORY</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
                title: "Resistance Zone",
                desc: "Equipped with custom-calibrated Hammer Strength and Rogue Fitness machinery for maximum muscular activation."
              },
              {
                img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
                title: "Recovery Bay",
                desc: "Integrated IR saunas and cryo-stations designed to accelerate mitochondrial repair and systemic recovery."
              },
              {
                img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2069&auto=format&fit=crop",
                title: "Functional Lab",
                desc: "Turf lanes and dynamic rigs for metabolic conditioning and neurological athletic development."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group"
              >
                <div className="h-80 overflow-hidden mb-6 border border-zinc-800 rounded-3xl relative">
                   <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale transition-all group-hover:scale-110 group-hover:grayscale-0 duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                </div>
                <h5 className="text-xl font-black uppercase italic italic tracking-tight mb-3 group-hover:text-orange-600 transition-colors">{item.title}</h5>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 p-8 border border-zinc-800 rounded-3xl flex items-start space-x-6">
              <div className="p-4 bg-orange-600/10 rounded-2xl text-orange-600">
                <MapPin size={24} />
              </div>
              <div>
                <h6 className="text-xs font-black uppercase tracking-widest mb-2 text-zinc-300">HQ Location</h6>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight">{settings.address}</p>
              </div>
            </div>
            <div className="bg-zinc-900/50 p-8 border border-zinc-800 rounded-3xl flex items-start space-x-6">
              <div className="p-4 bg-orange-600/10 rounded-2xl text-orange-600">
                <Clock size={24} />
              </div>
              <div>
                <h6 className="text-xs font-black uppercase tracking-widest mb-2 text-zinc-300">Operational Hours</h6>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight">Mon - Sat: 05:00 - 23:00</p>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight">Sun: 08:00 - 18:00</p>
              </div>
            </div>
            <div className="bg-zinc-900/50 p-8 border border-zinc-800 rounded-3xl flex items-start space-x-6">
              <div className="p-4 bg-orange-600/10 rounded-2xl text-orange-600">
                <Phone size={24} />
              </div>
              <div>
                <h6 className="text-xs font-black uppercase tracking-widest mb-2 text-zinc-300">Comms Line</h6>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight">{settings.phone}</p>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight">{settings.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
