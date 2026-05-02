import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, CreditCard, Truck, ArrowLeft, Loader2, Package } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    address: '',
    paymentMethod: 'cod' as 'card' | 'cod'
  });

  if (cart.length === 0 && !success) {
    return (
      <div className="p-20 text-center uppercase font-black italic text-zinc-500">
        Cart is empty. Redirecting...
        {setTimeout(() => navigate('/equipment'), 2000)}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user?.uid || 'guest',
        customerDetails: {
          name: formData.name,
          email: formData.email,
          address: formData.address
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart and show success
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl"
        >
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">Order <span className="text-orange-600">Locked</span></h2>
          <p className="text-zinc-500 uppercase text-xs font-black tracking-widest leading-relaxed mb-10">
            Your gears are being prepared for deployment. You will receive a confirmation email shortly.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-white text-black px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
          >
            Return to HQ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="mb-12">
        <button 
          onClick={() => navigate('/cart')}
          className="text-zinc-500 hover:text-white flex items-center space-x-2 uppercase text-[10px] font-black tracking-widest transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mt-4">Safe <span className="text-orange-600">Supply</span></h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 mb-6 flex items-center space-x-2">
              <span className="w-6 h-[1px] bg-orange-600"></span>
              <span>Delivery Intelligence</span>
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Target Name</label>
                <input 
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 transition-colors outline-none uppercase font-black tracking-widest text-xs"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Comms Channel (Email)</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 transition-colors outline-none font-medium text-xs lowercase"
                  placeholder="name@nexus.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value.toLowerCase()})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Drop Location (Full Address)</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 transition-colors outline-none uppercase font-black tracking-widest text-xs"
                  placeholder="Street, City, Zip Code"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 mb-6 flex items-center space-x-2">
              <span className="w-6 h-[1px] bg-orange-600"></span>
              <span>Extraction Method</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  formData.paymentMethod === 'card' 
                  ? 'border-orange-600 bg-orange-600/5' 
                  : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <CreditCard className={`mx-auto mb-3 ${formData.paymentMethod === 'card' ? 'text-orange-600' : 'text-zinc-600'}`} />
                <span className={`block text-[10px] font-black uppercase tracking-widest ${formData.paymentMethod === 'card' ? 'text-white' : 'text-zinc-500'}`}>Card Payment</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  formData.paymentMethod === 'cod' 
                  ? 'border-orange-600 bg-orange-600/5' 
                  : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Truck className={`mx-auto mb-3 ${formData.paymentMethod === 'cod' ? 'text-orange-600' : 'text-zinc-600'}`} />
                <span className={`block text-[10px] font-black uppercase tracking-widest ${formData.paymentMethod === 'cod' ? 'text-white' : 'text-zinc-500'}`}>COD (CASH ON DELIVERY)</span>
              </button>
            </div>
          </section>
        </div>

        <div>
          <div className="bg-zinc-900 border border-zinc-800 p-8 sticky top-32">
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-8 flex items-center space-x-3">
              <Package className="text-orange-600" size={20} />
              <span>Manifest</span>
            </h3>

            <div className="max-h-60 overflow-y-auto mb-8 space-y-4 pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest">{item.name}</p>
                    <p className="text-[9px] text-zinc-600 uppercase">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-[10px] font-black text-orange-600">{settings.currency}{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-800 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest mb-1">Total Bill</p>
                  <p className="text-4xl font-black italic tracking-tighter text-white">{settings.currency}{cartTotal}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 text-[10px] font-black uppercase tracking-widest">Free Shipping</p>
                  <p className="text-zinc-600 text-[9px] uppercase">Secure Encrypted Session</p>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase italic mb-4">{error}</p>}

            <button 
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center space-x-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <span>CONFIRM DEPLOYMENT</span>
                  <CheckCircle size={14} className="group-hover:scale-125 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
