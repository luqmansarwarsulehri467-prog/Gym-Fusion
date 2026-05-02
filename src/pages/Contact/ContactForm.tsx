import React, { useState } from 'react';
import { motion } from 'motion/react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const ContactForm = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'new',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2">Connect</h2>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-8">Get In Touch</h1>
          <p className="text-zinc-500 mb-12 leading-relaxed italic">
            "Communication is the bridge between goals and achievement. Let us help you cross that bridge."
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="bg-zinc-900 p-4 border border-zinc-800 text-orange-600">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-2">Our Fortress</h4>
                <p className="text-zinc-400 text-sm">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-zinc-900 p-4 border border-zinc-800 text-orange-600">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-2">Hotline</h4>
                <p className="text-zinc-400 text-sm">{settings.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-zinc-900 p-4 border border-zinc-800 text-orange-600">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-2">Transmission</h4>
                <p className="text-zinc-400 text-sm">{settings.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-10 relative">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-orange-900/50">
                <Send className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tight text-white">Transmission Sent</h3>
              <p className="text-zinc-500 uppercase text-xs tracking-widest font-bold mb-8">We will respond within 24 hours</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-orange-600 border border-orange-600 px-6 py-2 uppercase font-black italic text-xs tracking-widest hover:bg-orange-600 hover:text-white transition-all"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Identity</label>
                  <input
                    required
                    type="text"
                    placeholder="YOUR NAME"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-4 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors uppercase font-medium placeholder:text-zinc-700"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Electronic Mail</label>
                  <input
                    required
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-4 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors uppercase font-medium placeholder:text-zinc-700"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="PURPOSE OF CONTACT"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-4 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors uppercase font-medium placeholder:text-zinc-700"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="DESCRIBE YOUR REQUEST"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-4 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors uppercase font-medium placeholder:text-zinc-700 resize-none"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-orange-600 py-5 font-black uppercase italic tracking-[0.25em] text-sm hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 skew-x-[-12deg]"
              >
                <span className="skew-x-[12deg]">{loading ? 'TRANSMITTING...' : 'DISPATCH MESSAGE'}</span>
                {!loading && <Send className="skew-x-[12deg]" size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
