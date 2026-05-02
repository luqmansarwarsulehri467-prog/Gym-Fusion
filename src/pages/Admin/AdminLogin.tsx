import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertTriangle, ChevronRight, Key } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      // Auto-assign admin role to the specified master identity if not already assigned
      if (email === 'luqmansarwarsulehri467@gmail.com') {
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          await setDoc(userDocRef, {
            fullName: 'Master Admin',
            email: email,
            role: 'admin',
            status: 'active',
            registeredAt: new Date().toISOString()
          }, { merge: true });
        }
        navigate('/admin/members');
        return;
      }

      if (userDoc.exists() && userDoc.data().role === 'admin') {
        navigate('/admin/members');
      } else {
        setError('ACCESS DENIED: Insufficient Privileges');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-950 border border-zinc-800 p-10 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-orange-600 rounded-none mb-6 skew-x-[-12deg] shadow-lg shadow-orange-900/40">
            <Shield className="text-white skew-x-[12deg]" size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Central Command</h1>
          <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Administrative Interface</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900 flex items-center space-x-3 text-red-500 text-xs font-bold uppercase tracking-widest">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Terminal Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                <input
                  required
                  type="email"
                  placeholder="admin@gymfusion.pro"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 text-white text-sm focus:border-orange-600 outline-none font-medium placeholder:text-zinc-800"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Secure Protocol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 text-white text-sm focus:border-orange-600 outline-none placeholder:text-zinc-800"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-orange-600 py-4 font-black uppercase italic tracking-[0.2em] text-sm hover:bg-orange-500 transition-all flex items-center justify-center space-x-2 skew-x-[-12deg]"
            >
              <span className="skew-x-[12deg]">{loading ? 'AUTHENTICATING...' : 'ESTABLISH LINK'}</span>
              {!loading && <ChevronRight className="skew-x-[12deg]" size={20} />}
            </button>

            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="w-full text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              System Access Recovery?
            </button>
          </form>
        ) : (
          <AnimatePresence mode="wait">
            {!resetSent ? (
              <motion.form
                key="reset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleReset}
                className="space-y-6"
              >
                <p className="text-zinc-500 text-xs leading-relaxed italic mb-4">
                  Enter your administrative email to receive a secure recovery transmission.
                </p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Recovery Target</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white text-sm focus:border-orange-600 outline-none font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-white text-black py-4 font-black uppercase italic tracking-widest text-sm hover:bg-orange-600 hover:text-white transition-all skew-x-[-12deg]"
                >
                  <span className="skew-x-[12deg]">SEND TRANSMISSION</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Return to Base
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Key className="text-orange-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase italic">Transmission Sent</h3>
                <p className="text-zinc-500 text-sm mb-8">Check your encrypted mail for the recovery link.</p>
                <button
                  onClick={() => { setResetSent(false); setMode('login'); }}
                  className="text-orange-600 font-black uppercase text-xs tracking-widest hover:underline"
                >
                  Return to Base
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
