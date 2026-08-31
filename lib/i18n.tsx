"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'pt' | 'es';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Import messages
import enMessages from '../messages/en.json';
import ptMessages from '../messages/pt.json';
import esMessages from '../messages/es.json';

const messages = {
  en: enMessages,
  pt: ptMessages,
  es: esMessages,
};

export function I18nProvider({ children, initialLocale = 'en' }: { children: ReactNode; initialLocale?: Locale }) {
  // Initialize with the server-provided locale
  const [locale, setLocale] = useState<Locale>(initialLocale);
  // Keep state in sync with route changes after hydration (prevents mismatch)
  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = messages[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
