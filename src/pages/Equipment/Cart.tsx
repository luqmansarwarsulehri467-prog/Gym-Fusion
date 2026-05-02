import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { settings } = useSettings();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-zinc-900/50 border border-zinc-800 p-12 inline-block rounded-3xl mb-8">
          <ShoppingCart size={48} className="text-zinc-800 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase italic italic text-zinc-500 mb-2">Cart Empty</h2>
          <p className="text-zinc-600 text-sm uppercase tracking-widest">You haven't added any gear yet</p>
        </div>
        <div>
          <Link to="/equipment" className="bg-orange-600 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-950/20 active:scale-95 inline-flex items-center space-x-2">
            <span>Browse The Armory</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-12">Your <span className="text-orange-600">Cart</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 p-4 flex items-center space-x-6 group"
            >
              <div className="w-24 h-24 bg-zinc-950 shrink-0 overflow-hidden">
                <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-black uppercase italic tracking-tight mb-1">{item.name}</h3>
                <p className="text-orange-600 font-bold text-sm tracking-widest">{settings.currency}{item.price}</p>
              </div>

              <div className="flex items-center space-x-4 bg-zinc-950 border border-zinc-800 p-1 rounded-lg">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1.5 hover:text-orange-600 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1.5 hover:text-orange-600 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-zinc-600 hover:text-red-500 transition-colors border border-zinc-800 hover:border-red-500/20"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 p-8 sticky top-32">
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 pb-4 border-b border-zinc-800 text-orange-600">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-500 uppercase text-xs font-black tracking-widest">
                <span>Subtotal</span>
                <span>{settings.currency}{cartTotal}</span>
              </div>
              <div className="flex justify-between text-zinc-500 uppercase text-xs font-black tracking-widest">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-end">
                <span className="text-xs font-bold uppercase text-zinc-400">Total Bill</span>
                <span className="text-3xl font-black italic tracking-tighter text-white">{settings.currency}{cartTotal}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-orange-600 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-950/20 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={14} />
            </Link>
            
            <p className="mt-6 text-[10px] text-zinc-600 text-center uppercase tracking-tighter leading-tight font-medium">
              Tax is included in the item prices. Free shipping on all armory orders today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
