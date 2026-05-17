import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Dumbbell, 
  Utensils, 
  ShoppingBasket, 
  HelpCircle, 
  LayoutDashboard, 
  MessageSquare, 
  LogOut,
  Shield,
  Menu,
  X,
  Globe,
  User
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [adminProfile, setAdminProfile] = useState<{name: string, photoURL: string} | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'settings', 'adminProfile'));
      if (snap.exists()) {
        setAdminProfile(snap.data() as any);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/adminpanel456');
  };

  const navItems = [
    { name: 'Members', path: '/admin/members', icon: <Users size={18} /> },
    { name: 'Trainers', path: '/admin/trainers', icon: <Shield size={18} /> },
    { name: 'Workout & Diet', path: '/admin/plans', icon: <Utensils size={18} /> },
    { name: 'Store', path: '/admin/equipment', icon: <ShoppingBasket size={18} /> },
    { name: 'FAQ', path: '/admin/faq', icon: <HelpCircle size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Globe size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex text-white font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col z-50`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <Dumbbell className="text-orange-600" size={24} />
              <span className="font-black italic text-lg uppercase tracking-tight">HQ <span className="text-orange-600">PANEL</span></span>
            </div>
          ) : (
            <Dumbbell className="text-orange-600 mx-auto" size={24} />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-zinc-500 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-none transition-all group ${
                  isActive 
                    ? 'bg-orange-600 text-white border-l-4 border-white' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              <div className="shrink-0">{item.icon}</div>
              {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-4 py-3 text-zinc-500 hover:text-red-500 transition-colors group"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 italic">System Status: <span className="text-green-500">Online</span></h2>
          <div className="flex items-center space-x-6">
             <div className="text-right">
               <p className="text-[10px] font-black uppercase text-white leading-none">{adminProfile?.name || 'Admin Authority'}</p>
               <p className="text-[8px] text-orange-600 uppercase tracking-widest font-bold">Lvl 1 Access</p>
             </div>
             <div className="w-10 h-10 rounded-none bg-zinc-800 border border-zinc-700 flex items-center justify-center skew-x-[-12deg] overflow-hidden">
               {adminProfile?.photoURL ? (
                 <img src={adminProfile.photoURL} alt="" className="w-full h-full object-cover skew-x-[12deg]" />
               ) : (
                 <Shield className="text-orange-600 skew-x-[12deg]" size={20} />
               )}
             </div>
          </div>
        </header>

        <section className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
