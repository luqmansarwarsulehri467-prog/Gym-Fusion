import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit, X, Save, Dumbbell, Utensils } from 'lucide-react';

interface Plan {
  id?: string;
  name: string;
  type?: string; 
  goal?: string;
  duration?: string;
  intensity?: string;
  description?: string;
  details?: string;
  additionalFee?: number;
}

const PlansManager = () => {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [activeTab]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const collectionName = activeTab === 'workout' ? 'workoutPlans' : 'dietPlans';
      const querySnapshot = await getDocs(collection(db, collectionName));
      setPlans(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const collectionName = activeTab === 'workout' ? 'workoutPlans' : 'dietPlans';
      if (editingPlan.id) {
        const { id, ...rest } = editingPlan;
        await updateDoc(doc(db, collectionName, id), rest);
      } else {
        await addDoc(collection(db, collectionName), editingPlan);
      }
      setIsModalOpen(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePlan = async (id: string) => {
    if (!window.confirm('IRREVERSIBLE ACTION: Purge protocol data?')) return;
    try {
      const collectionName = activeTab === 'workout' ? 'workoutPlans' : 'dietPlans';
      await deleteDoc(doc(db, collectionName, id));
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Protocol Architect</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Optimization Logic Management</p>
        </div>
        
        <div className="flex bg-zinc-900 p-1 border border-zinc-800 skew-x-[-12deg]">
          <button 
            onClick={() => setActiveTab('workout')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all skew-x-[12deg] ${activeTab === 'workout' ? 'bg-orange-600 text-white' : 'text-zinc-600 hover:text-white'}`}
          >
            Workouts
          </button>
          <button 
            onClick={() => setActiveTab('diet')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all skew-x-[12deg] ${activeTab === 'diet' ? 'bg-orange-600 text-white' : 'text-zinc-600 hover:text-white'}`}
          >
            Nutrition
          </button>
        </div>
      </div>

      <button 
        onClick={() => { 
          setEditingPlan(activeTab === 'workout' 
            ? { name: '', goal: '', duration: '', intensity: '', description: '' } 
            : { name: '', type: '', additionalFee: 0, details: '' }
          ); 
          setIsModalOpen(true); 
        }}
        className="w-full bg-zinc-900 border border-zinc-800 hover:border-orange-600 py-4 font-black uppercase italic tracking-[0.2em] text-xs transition-colors flex items-center justify-center space-x-3 text-zinc-500 hover:text-white"
      >
        <Plus size={16} />
        <span>Deploy New Protocol</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between group h-full">
             <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="text-orange-600">
                      {activeTab === 'workout' ? <Dumbbell size={20} /> : <Utensils size={20} />}
                   </div>
                   <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingPlan(plan); setIsModalOpen(true); }} className="p-2 text-zinc-500 hover:text-white transition-colors"><Edit size={14} /></button>
                      <button onClick={() => deletePlan(plan.id!)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                   </div>
                </div>
                <h4 className="font-black uppercase italic text-lg text-white mb-2">{plan.name}</h4>
                <p className="text-zinc-500 text-xs line-clamp-3 italic">"{plan.description || plan.details}"</p>
             </div>
             <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span>{plan.goal || plan.type}</span>
                <span className="text-orange-600">{plan.duration || `Rs ${plan.additionalFee}`}</span>
             </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-xl relative z-10 overflow-hidden"
            >
              <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-black uppercase italic tracking-tighter flex items-center space-x-2">
                   {activeTab === 'workout' ? <Dumbbell className="text-orange-600" size={18} /> : <Utensils className="text-orange-600" size={18} />}
                   <span>{activeTab === 'workout' ? 'Workout Routine Architect' : 'Nutrition Formula Editor'}</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Internal Codename</label>
                   <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingPlan?.name} onChange={e => setEditingPlan({...editingPlan!, name: e.target.value})} />
                </div>

                {activeTab === 'workout' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Goal (e.g. Mass Gain)</label>
                         <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingPlan?.goal} onChange={e => setEditingPlan({...editingPlan!, goal: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Duration (e.g. 12 Weeks)</label>
                         <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingPlan?.duration} onChange={e => setEditingPlan({...editingPlan!, duration: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Intensity Level</label>
                       <select className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingPlan?.intensity} onChange={e => setEditingPlan({...editingPlan!, intensity: e.target.value})}>
                          <option value="Low">Low Intensity</option>
                          <option value="Standard">Standard Intensity</option>
                          <option value="High">High Intensity</option>
                          <option value="Extreme">Extreme Intensity</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Operational Description</label>
                       <textarea required rows={3} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white italic text-sm outline-none focus:border-orange-600 resize-none" value={editingPlan?.description} onChange={e => setEditingPlan({...editingPlan!, description: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Strategy Type (e.g. Keto)</label>
                         <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingPlan?.type} onChange={e => setEditingPlan({...editingPlan!, type: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Additional Cost (Rs)</label>
                         <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingPlan?.additionalFee} onChange={e => setEditingPlan({...editingPlan!, additionalFee: Number(e.target.value)})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Formula & Benefits Details</label>
                       <textarea required rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white italic text-sm outline-none focus:border-orange-600 resize-none" value={editingPlan?.details} onChange={e => setEditingPlan({...editingPlan!, details: e.target.value})} />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full bg-orange-600 py-4 font-black uppercase italic tracking-widest text-sm hover:bg-orange-500 transition-all flex items-center justify-center space-x-2">
                   <Save size={16} />
                   <span>COMMIT DATA</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlansManager;
