import React, { useState } from 'react';
import WorkoutPlans from './WorkoutPlans';
import DietPlans from './DietPlans';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Utensils } from 'lucide-react';

const Plans = () => {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-orange-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Elite Protocol Hub</h2>
        <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white mb-10">Training & Nutrition</h1>
        
        <div className="flex justify-center">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-full flex items-center space-x-1">
            <button 
              onClick={() => setActiveTab('workout')}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'workout' 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Dumbbell size={16} />
              <span>Workout Protocols</span>
            </button>
            <button 
              onClick={() => setActiveTab('diet')}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'diet' 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Utensils size={16} />
              <span>Nutrition Systems</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'workout' ? <WorkoutPlans /> : <DietPlans />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Plans;
