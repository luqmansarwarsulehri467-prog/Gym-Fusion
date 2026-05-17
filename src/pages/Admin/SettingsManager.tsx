import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Loader2, Globe, Phone, Mail, Instagram, Facebook, MessageCircle, MapPin, DollarSign, User, Upload } from 'lucide-react';

interface Settings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  currency: string;
}

interface AdminProfile {
  name: string;
  photoURL: string;
}

const SettingsManager = () => {
  const [settings, setSettings] = useState<Settings>({
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    currency: 'Rs'
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsSnap, profileSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'global')),
          getDoc(doc(db, 'settings', 'adminProfile'))
        ]);

        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as Settings);
        }
        if (profileSnap.exists()) {
          setAdminProfile(profileSnap.data() as AdminProfile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert('File size too large. Please upload an image smaller than 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile({ ...adminProfile, photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'global'), {
          ...settings,
          updatedAt: serverTimestamp()
        }),
        setDoc(doc(db, 'settings', 'adminProfile'), {
          ...adminProfile,
          updatedAt: serverTimestamp()
        })
      ]);
      setMessage('Configuration & Profile updated.');
    } catch (err) {
      console.error(err);
      setMessage('Update failure.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase italic text-zinc-500">Decrypting System Config...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-2 italic">System Parameters</h2>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">HQ <span className="text-orange-600">Config</span></h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Master Admin Profile */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2 flex items-center space-x-2">
            <User size={12} />
            <span>Master Admin Profile</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Display Name</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none uppercase text-xs font-bold"
                  value={adminProfile.name}
                  onChange={e => setAdminProfile({...adminProfile, name: e.target.value})}
                  placeholder="MASTER ADMIN"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Avatar Asset</label>
                <div className="flex space-x-2">
                  <input 
                    className="flex-1 bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none text-xs font-medium"
                    value={adminProfile.photoURL}
                    onChange={e => setAdminProfile({...adminProfile, photoURL: e.target.value})}
                    placeholder="URL OR UPLOAD →"
                  />
                  <label className="cursor-pointer bg-zinc-800 border border-zinc-700 px-6 rounded-xl flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <Upload size={18} className="text-orange-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>
            {adminProfile.photoURL && (
              <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-800 rounded-2xl h-full min-h-[160px]">
                <img src={adminProfile.photoURL} alt="Admin" className="w-24 h-24 rounded-full border-2 border-orange-600 object-cover mb-2" />
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Profile Preview</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2 flex items-center space-x-2">
                <MapPin size={12} />
                <span>Base Information</span>
              </h3>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">HQ Address</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none uppercase text-xs font-bold"
                  value={settings.address}
                  onChange={e => setSettings({...settings, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Primary Phone</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none uppercase text-xs font-bold"
                  value={settings.phone}
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Admin Email</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none lowercase text-xs font-medium"
                  value={settings.email}
                  onChange={e => setSettings({...settings, email: e.target.value.toLowerCase()})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2 flex items-center space-x-2">
                <Globe size={12} />
                <span>Social Matrix</span>
              </h3>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">WhatsApp Link</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none text-xs font-medium"
                  value={settings.whatsapp}
                  placeholder="https://wa.me/..."
                  onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Instagram Link</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none text-xs font-medium"
                  value={settings.instagram}
                  onChange={e => setSettings({...settings, instagram: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Facebook Link</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none text-xs font-medium"
                  value={settings.facebook}
                  onChange={e => setSettings({...settings, facebook: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2 flex items-center space-x-2 mb-6">
              <DollarSign size={12} />
              <span>Commerce Settings</span>
            </h3>
            <div className="max-w-xs">
              <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Default Currency</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-orange-600 outline-none uppercase text-xs font-black tracking-widest"
                value={settings.currency}
                placeholder="e.g., Rs, $, PKR"
                onChange={e => setSettings({...settings, currency: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className={`text-[10px] font-black uppercase italic tracking-widest ${message.includes('success') ? 'text-green-500' : 'text-orange-600'}`}>
            {message}
          </p>
          <button 
            disabled={saving}
            className="bg-orange-600 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Overwrite System Config</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
