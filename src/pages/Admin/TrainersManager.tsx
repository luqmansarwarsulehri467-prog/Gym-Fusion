import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit, X, Save, Shield, Upload } from 'lucide-react';

interface Trainer {
  id?: string;
  name: string;
  experience: string;
  fees: number;
  specializations: string; // Stored as comma-separated in form
  photoURL: string;
  bio: string;
}

const TrainersManager = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'trainers'));
      setTrainers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trainer)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert('File size too large. Please upload an image smaller than 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingTrainer) {
          setEditingTrainer({ ...editingTrainer, photoURL: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;

    try {
      const data = {
        ...editingTrainer,
        specializations: typeof editingTrainer.specializations === 'string' 
          ? editingTrainer.specializations.split(',').map(s => s.trim()) 
          : editingTrainer.specializations
      };

      if (editingTrainer.id) {
        const { id, ...rest } = data;
        await updateDoc(doc(db, 'trainers', id), rest);
      } else {
        await addDoc(collection(db, 'trainers'), data);
      }
      setIsModalOpen(false);
      setEditingTrainer(null);
      fetchTrainers();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTrainer = async (id: string) => {
    if (!window.confirm('IRREVERSIBLE ACTION: Purge specialist data?')) return;
    try {
      await deleteDoc(doc(db, 'trainers', id));
      setTrainers(trainers.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Trainer Command</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Specialist Resource Management</p>
        </div>
        <button 
          onClick={() => { setEditingTrainer({ name: '', experience: '', fees: 0, specializations: '', photoURL: '', bio: '' }); setIsModalOpen(true); }}
          className="bg-orange-600 hover:bg-orange-500 px-6 py-3 font-black uppercase italic tracking-widest text-xs transition-all flex items-center space-x-2 skew-x-[-12deg]"
        >
          <Plus className="skew-x-[12deg]" size={16} />
          <span className="skew-x-[12deg]">Recruit Specialist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-zinc-900 border border-zinc-800 p-6 flex items-center justify-between group">
             <div className="flex items-center space-x-4">
                <img src={trainer.photoURL} alt="" className="w-12 h-12 grayscale border border-zinc-700 bg-zinc-950" referrerPolicy="no-referrer" />
                <div>
                   <h4 className="font-black uppercase italic text-sm text-white">{trainer.name}</h4>
                   <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{trainer.experience} Experience</p>
                </div>
             </div>
             <div className="flex space-x-1">
                <button 
                  onClick={() => { 
                    setEditingTrainer({ 
                      ...trainer, 
                      specializations: Array.isArray(trainer.specializations) ? trainer.specializations.join(', ') : trainer.specializations 
                    }); 
                    setIsModalOpen(true); 
                  }}
                  className="p-2 text-zinc-600 hover:text-white transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteTrainer(trainer.id!)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
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
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-black uppercase italic tracking-tighter flex items-center space-x-2">
                   <Shield className="text-orange-600" size={18} />
                   <span>Specialist Protocol Editor</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Codename / Identity</label>
                      <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingTrainer?.name} onChange={e => setEditingTrainer({...editingTrainer!, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Experience (e.g. 10 Years)</label>
                      <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingTrainer?.experience} onChange={e => setEditingTrainer({...editingTrainer!, experience: e.target.value})} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Session Fee (Rs)</label>
                      <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingTrainer?.fees} onChange={e => setEditingTrainer({...editingTrainer!, fees: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Visual Asset</label>
                      <div className="flex space-x-2">
                        <input className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none focus:border-orange-600" placeholder="Image URL..." value={editingTrainer?.photoURL} onChange={e => setEditingTrainer({...editingTrainer!, photoURL: e.target.value})} />
                        <label className="cursor-pointer bg-zinc-800 border border-zinc-700 px-4 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                          <Upload size={16} className="text-orange-600" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                      </div>
                      {editingTrainer?.photoURL && (
                        <div className="mt-2 h-24 w-full border border-zinc-800 overflow-hidden bg-black rounded-lg">
                          <img src={editingTrainer.photoURL} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Specializations (Comma Separated)</label>
                   <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingTrainer?.specializations} onChange={e => setEditingTrainer({...editingTrainer!, specializations: e.target.value})} />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Professional Biography</label>
                   <textarea required rows={3} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white italic text-sm outline-none focus:border-orange-600 resize-none" value={editingTrainer?.bio} onChange={e => setEditingTrainer({...editingTrainer!, bio: e.target.value})} />
                </div>

                <button type="submit" className="w-full bg-orange-600 py-4 font-black uppercase italic tracking-widest text-sm hover:bg-orange-500 transition-all flex items-center justify-center space-x-2">
                   <Save size={16} />
                   <span>COMMIT CHANGES</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainersManager;
