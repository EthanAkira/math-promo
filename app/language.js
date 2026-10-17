'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isRtl, LANGUAGES } from './i18n';
import { languageForBrowser, languageForCountry } from './countryLanguage';

const LanguageContext = createContext({ language: 'ko', setLanguage: () => {} });
const SAVED_KEY = 'math-promo-language'; // only ever written by an explicit choice in the picker
const DETECTED_KEY = 'math-promo-language-auto'; // sessionStorage cache of the country-based guess
const CODES = LANGUAGES.map((item) => item.code);

function applyToDocument(code) {
  document.documentElement.lang = code;
  document.documentElement.dir = isRtl(code) ? 'rtl' : 'ltr';
}

function safeGet(storage, key) {
  try { return storage.getItem(key); } catch { return null; }
}

function safeSet(storage, key, value) {
  try { storage.setItem(key, value); } catch { /* storage blocked */ }
}

async function detectLanguage() {
  const cached = safeGet(window.sessionStorage, DETECTED_KEY);
  if (CODES.includes(cached)) return cached;
  let detected = null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('/api/geo', { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timer);
    if (res.ok) detected = languageForCountry((await res.json()).country);
  } catch { /* offline / geo unavailable → browser language */ }
  if (!detected) {
    for (const tag of window.navigator.languages || [window.navigator.language]) {
      detected = languageForBrowser(tag, CODES);
      if (detected) break;
    }
  }
  detected = detected || 'en';
  safeSet(window.sessionStorage, DETECTED_KEY, detected);
  return detected;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ko');
  useEffect(() => {
    let cancelled = false;
    const saved = safeGet(window.localStorage, SAVED_KEY);
    if (CODES.includes(saved)) {
      setLanguage(saved);
      applyToDocument(saved);
      return undefined;
    }
    // First visit: pick the visitor's country language; an explicit choice later always wins.
    detectLanguage().then((code) => {
      if (cancelled || safeGet(window.localStorage, SAVED_KEY)) return;
      setLanguage(code);
      applyToDocument(code);
    });
    return () => { cancelled = true; };
  }, []);
  function chooseLanguage(next) {
    setLanguage(next);
    safeSet(window.localStorage, SAVED_KEY, next);
    applyToDocument(next);
  }
  return <LanguageContext.Provider value={{ language, setLanguage: chooseLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
