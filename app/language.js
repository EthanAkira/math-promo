'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ language: 'ko', setLanguage: () => {} });

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ko');
  useEffect(() => { if (window.localStorage.getItem('math-promo-language') === 'en') setLanguage('en'); }, []);
  function chooseLanguage(next) {
    setLanguage(next);
    window.localStorage.setItem('math-promo-language', next);
    document.documentElement.lang = next;
  }
  return <LanguageContext.Provider value={{ language, setLanguage: chooseLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
