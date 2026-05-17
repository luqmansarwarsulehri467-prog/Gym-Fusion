import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search, 
  UserPlus, 
  DollarSign, 
  Mail, 
  Plus, 
  X,
  CreditCard,
  AlertCircle,
  Upload
} from 'lucide-react';

interface Member {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  registeredAt: string;
  photoURL?: string;
  feeStatus?: 'paid' | 'pending';
  registrationFee?: number;
  monthlyFee?: number;
  trainerFee?: number;
  dietFee?: number;
  totalFee?: number;
  lastPaymentDate?: string;
}

const MembersManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);
  
  // Form State
  const [newMember, setNewMember] = useState({
    fullName: '',
    email: '',
    photoURL: '',
    trainerId: '',
    workoutPlanId: '',
    dietPlanId: '',
    includeReg: true,
    includeGym: true,
    includeTrainer: false,
    trainerFee: 1500,
    includeDiet: false,
    dietFee: 1000
  });

  const REG_FEE = 2000;
  const GYM_FEE = 5000;

  useEffect(() => {
    fetchMembers();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const trainersSnap = await getDocs(collection(db, 'trainers'));
      const workoutSnap = await getDocs(collection(db, 'workoutPlans'));
      const dietSnap = await getDocs(collection(db, 'dietPlans'));
      
      setTrainers(trainersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setWorkoutPlans(workoutSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDietPlans(dietSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
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
        setNewMember({ ...newMember, photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('registeredAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data: typeof newMember) => {
    let total = 0;
    if (data.includeReg) total += REG_FEE;
    if (data.includeGym) total += GYM_FEE;
    if (data.includeTrainer) total += data.trainerFee;
    if (data.includeDiet) total += data.dietFee;
    return total;
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totalFee = calculateTotal(newMember);
      const memberId = `member_${Date.now()}`;
      
      const memberData = {
        fullName: newMember.fullName,
        email: newMember.email,
        photoURL: newMember.photoURL,
        trainerId: newMember.trainerId,
        workoutPlanId: newMember.workoutPlanId,
        dietPlanId: newMember.dietPlanId,
        role: 'member',
        status: 'active',
        feeStatus: 'pending',
        registrationFee: newMember.includeReg ? REG_FEE : 0,
        monthlyFee: newMember.includeGym ? GYM_FEE : 0,
        trainerFee: newMember.includeTrainer ? newMember.trainerFee : 0,
        dietFee: newMember.includeDiet ? newMember.dietFee : 0,
        totalFee: totalFee,
        registeredAt: new Date().toISOString(),
        uid: memberId
      };

      await setDoc(doc(db, 'users', memberId), memberData);
      setMembers([{ id: memberId, ...memberData }, ...members]);
      setShowAddModal(false);
      setNewMember({
        fullName: '',
        email: '',
        photoURL: '',
        trainerId: '',
        workoutPlanId: '',
        dietPlanId: '',
        includeReg: true,
        includeGym: true,
        includeTrainer: false,
        trainerFee: 1500,
        includeDiet: false,
        dietFee: 1000
      });
    } catch (error) {
      console.error(error);
      alert('Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (member: Member) => {
    try {
      await updateDoc(doc(db, 'users', member.id), { 
        feeStatus: 'paid',
        lastPaymentDate: new Date().toISOString()
      });
      setMembers(members.map(m => m.id === member.id ? { ...m, feeStatus: 'paid' } : m));
    } catch (error) {
      console.error(error);
    }
  };

  const sendReminder = (member: Member) => {
    const subject = encodeURIComponent('GYM FUSION: Fee Payment Reminder');
    const body = encodeURIComponent(`Hi ${member.fullName},\n\nThis is a friendly reminder that your gym fee of Rs ${member.totalFee} is currently pending.\n\nPlease clear your dues at the reception.\n\nThank you,\nGym Fusion Admin`);
    window.location.href = `mailto:${member.email}?subject=${subject}&body=${body}`;
  };

  const deleteMember = async (id: string) => {
    if (!window.confirm('IRREVERSIBLE ACTION: Purge user data?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Personnel <span className="text-orange-600">HQ</span></h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Operational Assets & Financial Tracking</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
              type="text"
              placeholder="SCAN FOR IDENTITY..."
              className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-600 transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 p-4 skew-x-[-12deg] hover:bg-orange-500 transition-all flex items-center space-x-2 shadow-lg shadow-orange-950/20"
          >
            <UserPlus size={18} className="skew-x-[12deg]" />
            <span className="skew-x-[12deg] text-[10px] font-black uppercase tracking-widest hidden sm:inline">Add Member</span>
          </button>
        </div>
      </div>

      {/* Members Grid/Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-500">
              <th className="px-8 py-6">Member Identity</th>
              <th className="px-8 py-6 text-center">Fee Status</th>
              <th className="px-8 py-6">Billing Matrix (Rs)</th>
              <th className="px-8 py-6">Total Due</th>
              <th className="px-8 py-6 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center animate-pulse text-zinc-600 text-xs font-black tracking-[0.5em] uppercase">Synchronizing Neural Net...</td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-zinc-700 text-sm font-black tracking-widest uppercase italic">0 Assets Detected in Sector</td>
              </tr>
            ) : filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-zinc-800/50 group transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img src={m.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`} alt="" className="w-12 h-12 rounded-none bg-zinc-950 object-cover grayscale group-hover:grayscale-0 transition-all border border-zinc-800" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-base font-black uppercase italic tracking-tight text-white">{m.fullName}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col items-center">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${
                      m.feeStatus === 'paid' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                    }`}>
                      {m.feeStatus || 'PENDING'}
                    </span>
                    {m.feeStatus === 'pending' && (
                      <button 
                        onClick={() => markAsPaid(m)}
                        className="mt-2 text-[8px] font-black uppercase tracking-tighter text-zinc-500 hover:text-white transition-colors"
                      >
                        [ MARK AS PAID ]
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1 text-[9px] font-bold uppercase tracking-tight text-zinc-500">
                    {m.registrationFee! > 0 && <p>Reg: <span className="text-white">{m.registrationFee}</span></p>}
                    {m.monthlyFee! > 0 && <p>Gym: <span className="text-white">{m.monthlyFee}</span></p>}
                    {m.trainerFee! > 0 && <p>Trainer: <span className="text-white">{m.trainerFee}</span></p>}
                    {m.dietFee! > 0 && <p>Diet: <span className="text-white">{m.dietFee}</span></p>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xl font-black italic tracking-tighter text-orange-600">
                    Rs {m.totalFee || (GYM_FEE + REG_FEE)}
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.feeStatus !== 'paid' && (
                      <button 
                        onClick={() => sendReminder(m)}
                        title="Send Email Reminder"
                        className="p-3 bg-zinc-950 text-zinc-500 hover:text-orange-600 border border-zinc-800 hover:border-orange-600/30 transition-all"
                      >
                        <Mail size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMember(m.id)} 
                      className="p-3 bg-zinc-950 text-zinc-500 hover:text-red-500 border border-zinc-800 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute right-6 top-6 text-zinc-600 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Deploy <span className="text-orange-600">Asset</span></h2>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2">New Personnel Protocol Initialization</p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Subject Full Name</label>
                      <input 
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs font-black uppercase outline-none focus:border-orange-600 transition-colors"
                        value={newMember.fullName}
                        onChange={e => setNewMember({...newMember, fullName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Comms Address (Email)</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs font-medium outline-none focus:border-orange-600 transition-colors"
                        value={newMember.email}
                        onChange={e => setNewMember({...newMember, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Subject Image Asset</label>
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-zinc-900 border border-zinc-800 p-4 text-[10px] font-black text-zinc-500 overflow-hidden truncate">
                          {newMember.photoURL ? 'IMAGE LOADED' : 'NO ASSET SELECTED'}
                        </div>
                        <label className="bg-orange-600 hover:bg-orange-500 px-4 flex items-center justify-center cursor-pointer transition-colors">
                          <Upload size={16} className="text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                      </div>
                      {newMember.photoURL && (
                        <div className="mt-4 h-32 w-full border border-zinc-800 bg-black overflow-hidden flex items-center justify-center">
                          <img src={newMember.photoURL} alt="Preview" className="h-full w-auto object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Service Matrix (Select Plans)</label>
                    
                    <div className="space-y-2">
                       <label className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-orange-600/30 transition-all">
                          <span className="text-[10px] font-black uppercase">Initial Registration (Rs 2000)</span>
                          <input 
                            type="checkbox" 
                            checked={newMember.includeReg}
                            onChange={e => setNewMember({...newMember, includeReg: e.target.checked})}
                            className="accent-orange-600"
                          />
                       </label>
                       
                       <label className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-orange-600/30 transition-all">
                          <span className="text-[10px] font-black uppercase">Monthly Gym Fee (Rs 5000)</span>
                          <input 
                            type="checkbox" 
                            checked={newMember.includeGym}
                            onChange={e => setNewMember({...newMember, includeGym: e.target.checked})}
                            className="accent-orange-600"
                          />
                       </label>

                       <div className="space-y-2 pt-2">
                         <label className="flex flex-col space-y-2 p-3 bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-orange-600/30 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase">Personal Trainer Add-on</span>
                              <input 
                                type="checkbox" 
                                checked={newMember.includeTrainer}
                                onChange={e => setNewMember({...newMember, includeTrainer: e.target.checked})}
                                className="accent-orange-600"
                              />
                            </div>
                            {newMember.includeTrainer && (
                              <select 
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-[10px] font-black uppercase outline-none focus:border-orange-600"
                                value={newMember.trainerId}
                                onChange={e => {
                                  const selected = trainers.find(t => t.id === e.target.value);
                                  setNewMember({
                                    ...newMember, 
                                    trainerId: e.target.value,
                                    trainerFee: selected ? selected.fees : 1500
                                  });
                                }}
                              >
                                <option value="">SELECT TRAINER</option>
                                {trainers.map(t => (
                                  <option key={t.id} value={t.id}>{t.name} (Rs {t.fees})</option>
                                ))}
                              </select>
                            )}
                         </label>
                         {newMember.includeTrainer && !newMember.trainerId && (
                           <input 
                              type="number"
                              placeholder="Manual Trainer Fee"
                              className="w-full bg-zinc-950 border border-zinc-800 p-3 text-[10px] font-black uppercase outline-none focus:border-orange-600"
                              value={newMember.trainerFee}
                              onChange={e => setNewMember({...newMember, trainerFee: Number(e.target.value)})}
                           />
                         )}
                       </div>

                       <div className="space-y-2 pt-2">
                         <label className="flex flex-col space-y-2 p-3 bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-orange-600/30 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase">Custom Diet Plan Add-on</span>
                              <input 
                                type="checkbox" 
                                checked={newMember.includeDiet}
                                onChange={e => setNewMember({...newMember, includeDiet: e.target.checked})}
                                className="accent-orange-600"
                              />
                            </div>
                            {newMember.includeDiet && (
                              <select 
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-[10px] font-black uppercase outline-none focus:border-orange-600"
                                value={newMember.dietPlanId}
                                onChange={e => {
                                  const selected = dietPlans.find(p => p.id === e.target.value);
                                  setNewMember({
                                    ...newMember, 
                                    dietPlanId: e.target.value,
                                    dietFee: selected ? selected.additionalFee : 1000
                                  });
                                }}
                              >
                                <option value="">SELECT DIET PLAN</option>
                                {dietPlans.map(p => (
                                  <option key={p.id} value={p.id}>{p.name} (Rs {p.additionalFee})</option>
                                ))}
                              </select>
                            )}
                         </label>
                         {newMember.includeDiet && !newMember.dietPlanId && (
                           <input 
                              type="number"
                              placeholder="Manual Diet Plan Fee"
                              className="w-full bg-zinc-950 border border-zinc-800 p-3 text-[10px] font-black uppercase outline-none focus:border-orange-600"
                              value={newMember.dietFee}
                              onChange={e => setNewMember({...newMember, dietFee: Number(e.target.value)})}
                           />
                         )}
                       </div>

                       <div className="space-y-2 pt-2">
                          <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1 px-1">Workout Protocol</label>
                          <select 
                            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-[10px] font-black uppercase outline-none focus:border-orange-600"
                            value={newMember.workoutPlanId}
                            onChange={e => setNewMember({...newMember, workoutPlanId: e.target.value})}
                          >
                            <option value="">SELECT WORKOUT PLAN</option>
                            {workoutPlans.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Combined Fee Matrix</p>
                    <p className="text-3xl font-black italic tracking-tighter text-white">Rs {calculateTotal(newMember)}</p>
                  </div>
                  <button 
                    type="submit"
                    className="bg-orange-600 px-10 py-4 uppercase font-black italic tracking-widest text-[10px] hover:bg-orange-500 transition-all skew-x-[-12deg]"
                  >
                    <span className="skew-x-[12deg] flex items-center space-x-2">
                      <Plus size={14} />
                      <span>INITIALIZE PERSONNEL</span>
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersManager;
