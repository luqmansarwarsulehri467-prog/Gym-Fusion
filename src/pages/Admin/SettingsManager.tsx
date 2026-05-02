import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Loader2, Globe, Phone, Mail, Instagram, Facebook, MessageCircle, MapPin, DollarSign } from 'lucide-react';

interface Settings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  currency: string;
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          setSettings(docSnap.data() as Settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      setMessage('Configuration updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update settings.');
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
