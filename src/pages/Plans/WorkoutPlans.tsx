import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Dumbbell, Clock, Zap, Target } from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  duration: string;
  intensity: string;
  description: string;
}

const WorkoutPlans = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const mockPlans: WorkoutPlan[] = [
    {
      id: '1',
      name: 'Titan Strength',
      goal: 'Bulking',
      duration: '12 Weeks',
      intensity: 'Extreme',
      description: 'Heavy compound movements designed to pack on massive size and raw power. Not for the faint of heart.'
    },
    {
      id: '2',
      name: 'Iron Shred',
      goal: 'Cutting',
      duration: '8 Weeks',
      intensity: 'High',
      description: 'High volume training focused on metabolic stress and body fat incineration while preserving lean tissue.'
    },
    {
      id: '3',
      name: 'Viking Endurance',
      goal: 'Conditioning',
      duration: '10 Weeks',
      intensity: 'Standard',
      description: 'Unconventional movements and intervals to build an engine that never quits and functional resilience.'
    }
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'workoutPlans'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPlan));
        setPlans(docs.length > 0 ? docs : mockPlans);
      } catch (error) {
        setPlans(mockPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return <div className="p-20 text-center animate-pulse uppercase font-black">Scanning Routines...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h2 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2">Training Systems</h2>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Workout Plans</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 hover:bg-zinc-800 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-zinc-950 rounded-lg group-hover:bg-orange-600 transition-colors">
                <Dumbbell className="text-orange-600 group-hover:text-white" size={24} />
              </div>
              <span className="text-[10px] font-black bg-zinc-950 px-2 py-1 uppercase tracking-widest text-zinc-400 group-hover:text-white">
                {plan.intensity} Intensity
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase italic mb-4">{plan.name}</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed italic">"{plan.description}"</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-950 p-4 border border-zinc-800">
                <div className="flex items-center space-x-2 text-orange-600 mb-1">
                  <Target size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Goal</span>
                </div>
                <span className="text-sm font-bold uppercase">{plan.goal}</span>
              </div>
              <div className="bg-zinc-950 p-4 border border-zinc-800">
                <div className="flex items-center space-x-2 text-orange-600 mb-1">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                </div>
                <span className="text-sm font-bold uppercase">{plan.duration}</span>
              </div>
            </div>

            <button className="w-full bg-orange-600 py-4 font-black uppercase italic tracking-widest text-sm hover:bg-orange-500 transition-colors skew-x-[-12deg]">
              <span className="skew-x-[12deg]">Acquire Plan</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlans;
