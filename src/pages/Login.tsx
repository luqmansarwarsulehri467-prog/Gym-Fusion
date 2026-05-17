import React from 'react';
import { motion } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create profile if it doesn't exist
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'member',
          status: 'active',
          feeStatus: 'pending',
          registeredAt: new Date().toISOString(),
        });
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-orange-600 rounded-2xl transform shadow-2xl shadow-orange-900/20">
            <Dumbbell className="text-white" size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-black uppercase italic mb-2 tracking-tight">Welcome to Fusion</h1>
        <p className="text-zinc-500 mb-8 uppercase text-xs tracking-widest font-bold">Authorized Access Only</p>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-zinc-100 text-black font-bold py-4 rounded-none transition-all uppercase tracking-widest text-sm skew-x-[-6deg]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 skew-x-[6deg]" />
          <span className="skew-x-[6deg]">Sign in with Google</span>
        </button>

        <p className="mt-8 text-xs text-zinc-600 leading-relaxed uppercase tracking-wider">
          By signing in, you agree to our <span className="text-zinc-400 underline cursor-pointer">Terms of Service</span> and <span className="text-zinc-400 underline cursor-pointer">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
