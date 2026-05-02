import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit, X, Save, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'faqs'));
      setFaqs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      if (editingFaq.id) {
        const { id, ...rest } = editingFaq;
        await updateDoc(doc(db, 'faqs', id), rest);
      } else {
        await addDoc(collection(db, 'faqs'), editingFaq);
      }
      setIsModalOpen(false);
      setEditingFaq(null);
      fetchFaqs();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFaq = async (id: string) => {
    if (!window.confirm('IRREVERSIBLE ACTION: Purge intelligence data?')) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Knowledge Base</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Information Support Database</p>
        </div>
        <button 
          onClick={() => { setEditingFaq({ question: '', answer: '', category: 'General' }); setIsModalOpen(true); }}
          className="bg-orange-600 hover:bg-orange-500 px-6 py-3 font-black uppercase italic tracking-widest text-xs transition-all flex items-center space-x-2 skew-x-[-12deg]"
        >
          <Plus className="skew-x-[12deg]" size={16} />
          <span className="skew-x-[12deg]">Inject Intel</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-zinc-900 border border-zinc-800 p-6 group hover:border-orange-600 transition-all">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-600/10 px-2 py-0.5">{faq.category}</span>
                   <h4 className="font-black uppercase italic text-lg text-white">{faq.question}</h4>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                   <button onClick={() => { setEditingFaq(faq); setIsModalOpen(true); }} className="p-2 text-zinc-500 hover:text-white transition-colors"><Edit size={16} /></button>
                   <button onClick={() => deleteFaq(faq.id!)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
             </div>
             <p className="mt-4 text-zinc-500 text-sm leading-relaxed font-sans italic">"{faq.answer}"</p>
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
                   <HelpCircle className="text-orange-600" size={18} />
                   <span>Intelligence Uplink</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Query Designation (Question)</label>
                   <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white font-bold text-sm outline-none focus:border-orange-600" value={editingFaq?.question} onChange={e => setEditingFaq({...editingFaq!, question: e.target.value})} />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Classification (Category)</label>
                   <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingFaq?.category} onChange={e => setEditingFaq({...editingFaq!, category: e.target.value})} />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Response Content (Answer)</label>
                   <textarea required rows={5} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none focus:border-orange-600 resize-none font-sans" value={editingFaq?.answer} onChange={e => setEditingFaq({...editingFaq!, answer: e.target.value})} />
                </div>

                <button type="submit" className="w-full bg-orange-600 py-4 font-black uppercase italic tracking-widest text-sm hover:bg-orange-500 transition-all flex items-center justify-center space-x-2">
                   <Save size={16} />
                   <span>ENCODE INTO DATABASE</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQManager;
