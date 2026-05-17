import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Users, 
  Utensils, 
  ShoppingBasket, 
  HelpCircle, 
  Mail, 
  User,
  Home,
  Info,
  ShoppingBag,
  ClipboardList,
  UserPlus,
  ScrollText,
  ShoppingCart,
  Star,
  Shield,
  Facebook, 
  Instagram, 
  MessageCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'About', path: '/about', icon: <Info size={16} /> },
    { name: 'Shop', path: '/equipment', icon: <ShoppingBag size={16} /> },
    { name: 'Plans', path: '/plans', icon: <ClipboardList size={16} /> },
    { name: 'Register', path: '/register', icon: <UserPlus size={16} /> },
    { name: 'Rules', path: '/rules', icon: <ScrollText size={16} /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle size={16} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={16} /> },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <nav className="max-w-[1400px] mx-auto bg-zinc-950/80 backdrop-blur-xl text-white border border-zinc-800/50 rounded-[40px] px-8 py-2 pointer-events-auto shadow-2xl">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-orange-600 rounded-xl group-hover:bg-orange-500 transition-all shadow-lg shadow-orange-950/20">
                <Dumbbell className="text-white" size={20} />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase italic">
                Gym<span className="text-orange-600">Fusion</span>
              </span>
            </Link>
          </div>

          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'text-orange-600' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-orange-600' : 'text-zinc-500'}>{item.icon}</span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/cart" className="text-zinc-400 hover:text-white transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-800" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                      <User size={16} />
                    </div>
                  )}
                </Link>
                <button
                  onClick={() => signOut(auth)}
                  className="bg-zinc-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-zinc-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-orange-600 selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Dumbbell className="text-orange-600" size={24} />
                <span className="font-bold text-xl uppercase italic">
                  Gym<span className="text-orange-600">Fusion</span>
                </span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Premium fitness destination for those who want to push their limits and achieve their dream physique.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest text-orange-600">Quick Links</h4>
              <ul className="space-y-2 text-zinc-500 text-sm">
                <li><Link to="/trainers" className="hover:text-white transition-colors">Trainers</Link></li>
                <li><Link to="/workout-plans" className="hover:text-white transition-colors">Workout Plans</Link></li>
                <li><Link to="/diet-plans" className="hover:text-white transition-colors">Diet Plans</Link></li>
                <li><Link to="/equipment" className="hover:text-white transition-colors">Equipment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest text-orange-600">Connect With Us</h4>
              <div className="flex space-x-4 mb-8">
                <a 
                  href={settings.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-orange-600 hover:border-orange-600 transition-all shadow-lg"
                  title="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-orange-600 hover:border-orange-600 transition-all shadow-lg"
                  title="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href={settings.whatsapp} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-orange-600 hover:border-orange-600 transition-all shadow-lg"
                  title="WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
              <div className="pt-4 border-t border-zinc-900 group">
                <Link to="/adminpanel456" className="text-zinc-700 group-hover:text-orange-600 transition-all flex items-center space-x-2">
                  <Shield size={14} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Admin Dashboard</span>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest text-orange-600">Inquiry</h4>
              <p className="text-[10px] text-zinc-600 uppercase mb-4 tracking-tighter leading-tight">Need assistance with your training or orders? Reach out via WhatsApp for instant support.</p>
              <a href={settings.whatsapp} className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-md text-[10px] font-black uppercase tracking-widest hover:border-orange-600 transition-all block text-center">
                Chat Support
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs uppercase tracking-widest">
            © 2026 Gym Fusion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
