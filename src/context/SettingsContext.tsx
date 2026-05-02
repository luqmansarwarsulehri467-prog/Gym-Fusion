import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Settings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  currency: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
}

const defaultSettings: Settings = {
  address: '45 Gym Fusion, Wah Cantt',
  phone: '+923251463034',
  email: 'luqmansarwarsulehri467@gmail.com',
  whatsapp: 'https://wa.me/923251463034',
  instagram: 'https://instagram.com/gymfusion',
  facebook: 'https://facebook.com/gymfusion',
  currency: 'Rs'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to global settings
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() } as Settings);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
