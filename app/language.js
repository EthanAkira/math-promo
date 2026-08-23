'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isRtl, LANGUAGES } from './i18n';

const LanguageContext = createContext({ language: 'ko', setLanguage: () => {} });

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ko');
  useEffect(() => {
    const saved = window.localStorage.getItem('math-promo-language');
    if (LANGUAGES.some((item) => item.code === saved)) {
      setLanguage(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = isRtl(saved) ? 'rtl' : 'ltr';
    }
  }, []);
  function chooseLanguage(next) {
    setLanguage(next);
    window.localStorage.setItem('math-promo-language', next);
    document.documentElement.lang = next;
    document.documentElement.dir = isRtl(next) ? 'rtl' : 'ltr';
  }
  return <LanguageContext.Provider value={{ language, setLanguage: chooseLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
