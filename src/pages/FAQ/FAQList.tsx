import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQList = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const mockFaqs: FAQ[] = [
    { id: '1', question: 'What are the gym operating hours?', answer: 'We are open 24/7 for all members with a valid access card. Staffed hours are 8 AM to 10 PM.' },
    { id: '2', question: 'Can I freeze my membership?', answer: 'Yes, memberships can be frozen for up to 3 months per year for medical or travel reasons.' },
    { id: '3', question: 'Do you offer personal training for beginners?', answer: 'Absolutely. We have a tier of trainers specifically specialized in foundational movements and safety for newcomers.' },
    { id: '4', question: 'Are shower and locker facilities available?', answer: 'Yes, we provide premium shower facilities, dry saunas, and daily-use digital lockers at no extra cost.' },
  ];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'faqs'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
        setFaqs(docs.length > 0 ? docs : mockFaqs);
      } catch (error) {
        setFaqs(mockFaqs);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-20">
        <div className="inline-block p-3 bg-orange-600 rounded-2xl mb-4">
          <HelpCircle className="text-white" size={32} />
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Knowledge Base</h1>
        <p className="text-zinc-500 uppercase text-xs tracking-[0.2em] font-bold">Frequently Asked Questions</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-zinc-800 bg-zinc-900 overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800 transition-colors"
            >
              <span className="font-bold uppercase tracking-wide text-zinc-200">{faq.question}</span>
              {openId === faq.id ? <Minus className="text-orange-600" size={20} /> : <Plus className="text-orange-600" size={20} />}
            </button>
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-zinc-500 text-sm leading-relaxed italic border-t border-zinc-800 pt-4"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-orange-600 text-center relative overflow-hidden">
        <h3 className="text-3xl font-black uppercase italic text-white mb-4 relative z-10">Still Have Questions?</h3>
        <p className="text-orange-100 mb-8 relative z-10">Our support team is active and ready to assist you with any query.</p>
        <button className="bg-black text-white px-8 py-3 font-black uppercase italic tracking-widest hover:bg-zinc-900 transition-all relative z-10 skew-x-[-12deg]">
          <span className="skew-x-[12deg]">Get In Touch</span>
        </button>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none select-none">
          <HelpCircle size={200} className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default FAQList;
