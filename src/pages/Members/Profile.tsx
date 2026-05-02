import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Dumbbell, Utensils, Users, Calendar, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const fetchExtraData = async () => {
      if (profile) {
        const extra: any = {};
        if (profile.trainerId) {
          const t = await getDoc(doc(db, 'trainers', profile.trainerId));
          if (t.exists()) extra.trainer = t.data();
        }
        if (profile.workoutPlanId) {
          const w = await getDoc(doc(db, 'workoutPlans', profile.workoutPlanId));
          if (w.exists()) extra.workout = w.data();
        }
        if (profile.dietPlanId) {
          const d = await getDoc(doc(db, 'dietPlans', profile.dietPlanId));
          if (d.exists()) extra.diet = d.data();
        }
        setDetails(extra);
      }
    };
    fetchExtraData();
  }, [profile]);

  if (loading) return <div className="p-20 text-center uppercase font-black text-orange-600 animate-pulse">Synchronizing Profile...</div>;
  if (!user) return <div className="p-20 text-center text-zinc-500 uppercase font-black">No User Data Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: User Card */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 overflow-hidden relative">
            <div className="h-24 bg-orange-600 opacity-20 absolute top-0 left-0 w-full -z-10"></div>
            <div className="p-8 pt-12 flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={profile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-zinc-950 bg-zinc-800 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 bg-orange-600 p-2 rounded-full border-2 border-zinc-950">
                  <Shield size={16} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-1">{profile?.fullName || user.displayName}</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">{profile?.role || 'Member'}</p>
              
              <div className="w-full space-y-4">
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <Mail size={16} className="text-orange-600" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <Calendar size={16} className="text-orange-600" />
                  <span>Joined {profile?.registeredAt ? new Date(profile.registeredAt).toLocaleDateString() : 'Recently'}</span>
                </div>
              </div>

              {!profile && (
                <Link to="/register" className="mt-8 w-full bg-orange-600 py-3 text-center font-black uppercase italic tracking-widest text-xs hover:bg-orange-500 transition-all">
                  Complete Registration
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Plans & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">Active Protocols</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trainer Cargo */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-orange-600 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-zinc-950 rounded-lg">
                  <Users className="text-orange-600" size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Assigned Coach</span>
              </div>
              {details?.trainer ? (
                <div>
                  <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">{details.trainer.name}</h4>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{details.trainer.experience} Experience</p>
                </div>
              ) : (
                <p className="text-zinc-600 italic text-sm">No trainer assigned. Find a coach in the coaching terminal.</p>
              )}
            </div>

            {/* Workout Module */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-orange-600 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-zinc-950 rounded-lg">
                  <Dumbbell className="text-orange-600" size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Training Routine</span>
              </div>
              {details?.workout ? (
                <div>
                  <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">{details.workout.name}</h4>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{details.workout.duration} Protocol</p>
                </div>
              ) : (
                <p className="text-zinc-600 italic text-sm">No active routine. Select a workout plan to begin.</p>
              )}
            </div>

            {/* Nutrition Module */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-orange-600 transition-all md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-zinc-950 rounded-lg">
                  <Utensils className="text-orange-600" size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Fuel Strategy</span>
              </div>
              {details?.diet ? (
                <div>
                  <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">{details.diet.name}</h4>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{details.diet.type} Optimization</p>
                </div>
              ) : (
                <p className="text-zinc-600 italic text-sm">Self-managed nutrition active. Consult our specialists for optimization.</p>
              )}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-black uppercase italic mb-6">Recent Activity</h3>
            <div className="border border-zinc-800 divide-y divide-zinc-800">
               <div className="p-4 flex justify-between items-center bg-zinc-900/30">
                 <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Membership Activated</span>
                 <span className="text-zinc-600 text-[10px] font-medium">{profile?.registeredAt ? new Date(profile.registeredAt).toLocaleDateString() : 'N/A'}</span>
               </div>
               <div className="p-4 flex justify-between items-center text-zinc-500 italic text-xs">
                 <span>No recent data logs available.</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
