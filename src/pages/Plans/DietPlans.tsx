import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Utensils, Flame, Scale, Coffee } from 'lucide-react';

interface DietPlan {
  id: string;
  name: string;
  type: string;
  additionalFee: number;
  details: string;
}

const DietPlans = () => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const mockPlans: DietPlan[] = [
    {
      id: '1',
      name: 'Clean Bulking Pro',
      type: 'Mass Gain',
      additionalFee: 50,
      details: 'High calorie, high protein macros designed for lean mass acquisition without the fat spillover.'
    },
    {
      id: '2',
      name: 'Keto Burner',
      type: 'Fat Loss',
      additionalFee: 40,
      details: 'Strict ketogenic approach focused on fat adaptation and hormonal optimization for cutting.'
    },
    {
      id: '3',
      name: 'Performance Base',
      type: 'Maintenance',
      additionalFee: 30,
      details: 'Balanced nutrition for optimal physical performance, mental clarity, and consistent energy levels.'
    }
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dietPlans'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DietPlan));
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
    return <div className="p-20 text-center animate-pulse text-orange-600 font-bold uppercase tracking-widest">Calculating Macros...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col h-full bg-zinc-900/50 border-l-2 border-orange-600 p-8 hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="text-orange-600">
                <Flame size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase italic italic">{plan.name}</h3>
            </div>

            <p className="text-zinc-500 mb-8 italic flex-grow leading-relaxed">"{plan.details}"</p>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Plan Type</span>
                <span className="text-white font-bold uppercase tracking-tighter">{plan.type}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Additional Fee</span>
                <span className="text-orange-600 font-black tracking-tight">${plan.additionalFee} USD</span>
              </div>
            </div>

            <button className="bg-white text-black py-4 uppercase font-black italic tracking-widest text-sm hover:bg-orange-600 hover:text-white transition-all transform hover:translate-x-2">
              Select Plan →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DietPlans;
