import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Users, Info, DollarSign, Award } from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  experience: string;
  fees: number;
  specializations: string[];
  photoURL: string;
  bio: string;
}

const TrainerList = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data as fallback
  const mockTrainers: Trainer[] = [
    {
      id: '1',
      name: 'Alex "The Beast" Rivers',
      experience: '12 Years',
      fees: 150,
      specializations: ['Bodybuilding', 'Powerlifting'],
      photoURL: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop',
      bio: 'Champion bodybuilder focused on maximal hypertrophy and structural integrity.',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      experience: '8 Years',
      fees: 120,
      specializations: ['Functional Fitness', 'Nutrition'],
      photoURL: 'https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=200&auto=format&fit=crop',
      bio: 'Expert in high-intensity interval training and performance nutrition strategies.',
    },
    {
      id: '3',
      name: 'Marcus Thorne',
      experience: '15 Years',
      fees: 200,
      specializations: ['Sports Conditioning', 'Rehab'],
      photoURL: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=200&auto=format&fit=crop',
      bio: 'Specialist in elite athletic performance and injury prevention for pros.',
    }
  ];

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'trainers'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trainer));
        if (docs.length > 0) {
          setTrainers(docs);
        } else {
          setTrainers(mockTrainers);
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setTrainers(mockTrainers);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h2 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2">Our Specialists</h2>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Elite Trainers</h1>
        <p className="text-zinc-500 max-w-2xl mt-4">
          Choose from our roster of world-class professionals dedicated to helping you achieve and exceed your physical goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trainers.map((trainer, idx) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 group hover:border-orange-600 transition-all overflow-hidden"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={trainer.photoURL}
                alt={trainer.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-orange-600 px-3 py-1 text-xs font-black uppercase italic italic skew-x-[-12deg]">
                <span className="skew-x-[12deg]">Rs {trainer.fees} / Session</span>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tight">{trainer.name}</h3>
              <div className="flex items-center space-x-2 text-zinc-400 text-xs font-bold uppercase mb-4 tracking-widest">
                <Award size={14} className="text-orange-600" />
                <span>{trainer.experience} Experience</span>
              </div>

              <p className="text-zinc-500 text-sm mb-6 line-clamp-2 italic leading-relaxed">"{trainer.bio}"</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {trainer.specializations.map(spec => (
                  <span key={spec} className="text-[10px] bg-zinc-950 px-2 py-1 rounded-sm border border-zinc-800 text-zinc-400 uppercase tracking-tighter">
                    {spec}
                  </span>
                ))}
              </div>

              <button className="w-full bg-zinc-950 hover:bg-orange-600 py-3 uppercase font-black italic tracking-widest text-sm transition-colors border border-zinc-800 hover:border-orange-600 skew-x-[-6deg]">
                <span className="skew-x-[6deg]">Assigned Trainer</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrainerList;
