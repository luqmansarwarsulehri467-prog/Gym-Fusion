import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ShieldCheck, Info } from 'lucide-react';

interface Rule {
  id: string;
  title: string;
  content: string;
}

const GymRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const mockRules: Rule[] = [
    { id: '1', title: 'Hygiene Standards', content: 'Members must use a towel on all equipment. Wipe down machines after use with provided sanitizer.' },
    { id: '2', title: 'Equipment Etiquette', content: 'Return all weights and accessories to their designated storage after use. Do not drop dumbbells from height.' },
    { id: '3', title: 'Proper Attire', content: 'Closed-toe athletic shoes and appropriate gym wear are mandatory. Strictly no denim or street clothes on the floor.' },
    { id: '4', title: 'Safe Training', content: 'No photography or filming without prior approval from management. Respect the privacy of all members.' },
  ];

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rules'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rule));
        setRules(docs.length > 0 ? docs : mockRules);
      } catch (error) {
        setRules(mockRules);
      }
    };
    fetchRules();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <div className="inline-block p-4 bg-orange-600 rounded-full mb-6">
          <ShieldCheck className="text-white" size={40} />
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Code of Conduct</h1>
        <p className="text-zinc-500 uppercase text-xs tracking-[0.2em] font-bold">Gym Rules & Regulations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rules.map((rule, idx) => (
          <div key={rule.id} className="bg-zinc-900 border border-zinc-800 p-10 hover:border-orange-600 transition-colors relative h-full">
            <span className="absolute top-0 left-0 bg-zinc-800 text-zinc-500 text-[10px] font-black px-3 py-1 uppercase tracking-widest">Rule 0{idx + 1}</span>
            <h3 className="text-xl font-black uppercase italic mb-4 mt-2 text-white">{rule.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">{rule.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 border border-zinc-800 flex items-start space-x-6">
        <div className="text-orange-600 mt-1">
          <Info size={24} />
        </div>
        <p className="text-zinc-400 text-xs leading-relaxed uppercase tracking-widest font-bold">
          Violation of these rules may result in immediate suspension or termination of membership. Gym Fusion maintains a zero-tolerance policy for harassment or unsafe behavior.
        </p>
      </div>
    </div>
  );
};

export default GymRules;
