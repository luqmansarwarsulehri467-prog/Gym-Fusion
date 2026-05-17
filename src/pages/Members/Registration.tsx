import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Dumbbell, Utensils, Users, CheckCircle2, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

const Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    photoURL: '',
    trainerId: '',
    workoutPlanId: '',
    dietPlanId: '',
  });

  const [options, setOptions] = useState({
    trainers: [] as any[],
    workoutPlans: [] as any[],
    dietPlans: [] as any[],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert('File size too large. Please upload an image smaller than 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const trainers = await getDocs(collection(db, 'trainers'));
      const workoutPlans = await getDocs(collection(db, 'workoutPlans'));
      const dietPlans = await getDocs(collection(db, 'dietPlans'));
      
      setOptions({
        trainers: trainers.docs.map(d => ({ id: d.id, ...d.data() })),
        workoutPlans: workoutPlans.docs.map(d => ({ id: d.id, ...d.data() })),
        dietPlans: dietPlans.docs.map(d => ({ id: d.id, ...d.data() })),
      });
    };
    fetchData();

    // Prefill if user logged in
    if (auth.currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        photoURL: auth.currentUser?.photoURL || '',
      }));
    }
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.email || !formData.fullName) {
      alert('Identity data is incomplete.');
      setStep(1);
      return;
    }
    
    setLoading(true);
    try {
      // Use auth UID if logged in, otherwise use a random ID
      const uid = auth.currentUser?.uid || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await setDoc(doc(db, 'users', uid), {
        ...formData,
        uid: uid,
        role: 'member',
        status: 'active',
        feeStatus: 'pending',
        registeredAt: new Date().toISOString()
      }, { merge: true });
      
      alert('Registration Successful! Welcome to Gym Fusion.');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Identity', icon: <User size={20} /> },
    { title: 'Coaching', icon: <Users size={20} /> },
    { title: 'Training', icon: <Dumbbell size={20} /> },
    { title: 'Nutrition', icon: <Utensils size={20} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -z-10"></div>
        {steps.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-4 bg-zinc-950 px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step > idx + 1 ? 'bg-orange-600 border-orange-600' : step === idx + 1 ? 'border-orange-600 text-orange-600' : 'border-zinc-800 text-zinc-600'}`}>
              {step > idx + 1 ? <CheckCircle2 size={18} className="text-white" /> : s.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === idx + 1 ? 'text-orange-600' : 'text-zinc-600'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-10 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key={1} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic mb-8">Personal Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Legal Name</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-orange-600 outline-none uppercase font-bold"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-orange-600 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Profile Asset (Image Upload)</label>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 p-4 text-[10px] font-black text-zinc-600 overflow-hidden truncate">
                      {formData.photoURL ? 'BIOMETRIC ASSET LOADED' : 'NO ASSET SELECTED'}
                    </div>
                    <label className="bg-orange-600 hover:bg-orange-500 px-6 flex items-center justify-center cursor-pointer transition-colors shadow-lg shadow-orange-950/20">
                      <Upload size={18} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                  {formData.photoURL && (
                    <div className="mt-4 h-40 w-full border border-zinc-800 bg-black overflow-hidden flex items-center justify-center rounded-xl">
                      <img src={formData.photoURL} alt="Preview" className="h-full w-auto object-contain" />
                    </div>
                  )}
                  <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter mt-1 italic">Or paste a direct URL below</p>
                  <input
                    type="text"
                    placeholder="URL ASSET OVERRIDE..."
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-orange-600 outline-none text-[10px]"
                    value={formData.photoURL.startsWith('data:') ? '' : formData.photoURL}
                    onChange={e => setFormData({ ...formData, photoURL: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key={2} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black uppercase italic mb-8">Select Your Elite Trainer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.trainers.length > 0 ? options.trainers.map(t => (
                  <label key={t.id} className={`p-6 border cursor-pointer transition-all ${formData.trainerId === t.id ? 'border-orange-600 bg-orange-600/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <input type="radio" className="hidden" name="trainer" value={t.id} checked={formData.trainerId === t.id} onChange={() => setFormData({ ...formData, trainerId: t.id })} />
                    <div className="flex items-center space-x-4">
                      <img src={t.photoURL} alt={t.name} className="w-12 h-12 rounded-full grayscale" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-black uppercase italic text-sm">{t.name}</h4>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{t.experience} Experience</p>
                      </div>
                    </div>
                  </label>
                )) : <p className="text-zinc-500 uppercase text-xs">No trainers available. You can skip this for now.</p>}
                <label className={`p-6 border cursor-pointer transition-all ${formData.trainerId === '' ? 'border-orange-600 bg-orange-600/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                  <input type="radio" className="hidden" name="trainer" value="" checked={formData.trainerId === ''} onChange={() => setFormData({ ...formData, trainerId: '' })} />
                  <p className="font-bold uppercase text-xs tracking-widest text-center">No Trainer / Manual Training</p>
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key={3} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black uppercase italic mb-8">Choose Training Protocol</h2>
              <div className="space-y-4">
                {options.workoutPlans.length > 0 ? options.workoutPlans.map(p => (
                  <label key={p.id} className={`p-6 border cursor-pointer block transition-all ${formData.workoutPlanId === p.id ? 'border-orange-600 bg-orange-600/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <input type="radio" className="hidden" name="workout" value={p.id} checked={formData.workoutPlanId === p.id} onChange={() => setFormData({ ...formData, workoutPlanId: p.id })} />
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black uppercase italic text-lg">{p.name}</h4>
                        <p className="text-zinc-500 text-xs italic">"{p.goal}" - {p.duration}</p>
                      </div>
                      <div className="text-orange-600"><Dumbbell size={20} /></div>
                    </div>
                  </label>
                )) : <p className="text-zinc-500 uppercase text-xs">No plans found.</p>}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key={4} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black uppercase italic mb-8">Add Nutrition Optimization</h2>
              <div className="space-y-4 mb-8">
                {options.dietPlans.length > 0 ? options.dietPlans.map(p => (
                  <label key={p.id} className={`p-6 border cursor-pointer block transition-all ${formData.dietPlanId === p.id ? 'border-orange-600 bg-orange-600/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <input type="radio" className="hidden" name="diet" value={p.id} checked={formData.dietPlanId === p.id} onChange={() => setFormData({ ...formData, dietPlanId: p.id })} />
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black uppercase italic text-lg">{p.name}</h4>
                        <p className="text-zinc-500 text-xs italic">{p.type} plan (+Rs {p.additionalFee})</p>
                      </div>
                      <div className="text-orange-600"><Utensils size={20} /></div>
                    </div>
                  </label>
                )) : <p className="text-zinc-500 uppercase text-xs">No diet plans found.</p>}
                <label className={`p-6 border cursor-pointer block transition-all ${formData.dietPlanId === '' ? 'border-orange-600 bg-orange-600/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                   <input type="radio" className="hidden" name="diet" value="" checked={formData.dietPlanId === ''} onChange={() => setFormData({ ...formData, dietPlanId: '' })} />
                   <p className="font-bold uppercase text-xs tracking-widest">Self-Managed Nutrition</p>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-10 flex justify-between">
          {step > 1 ? (
            <button onClick={handlePrev} className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors uppercase font-black text-xs tracking-widest">
              <ChevronLeft size={16} />
              <span>Backtrack</span>
            </button>
          ) : <div />}
          
          {step < 4 ? (
            <button onClick={handleNext} className="bg-zinc-800 hover:bg-zinc-700 px-8 py-3 font-black uppercase italic tracking-widest text-xs transition-all flex items-center space-x-2 skew-x-[-12deg]">
              <span className="skew-x-[12deg]">Proceed</span>
              <ChevronRight size={16} className="skew-x-[12deg]" />
            </button>
          ) : (
            <button 
              disabled={loading}
              onClick={handleSubmit} 
              className="bg-orange-600 hover:bg-orange-500 px-10 py-4 font-black uppercase italic tracking-widest text-sm transition-all shadow-xl shadow-orange-900/40 skew-x-[-12deg]"
            >
              <span className="skew-x-[12deg]">{loading ? 'INITIALIZING...' : 'FINALIZE REGISTRATION'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
