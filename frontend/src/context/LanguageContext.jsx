import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { dictionary, DEFAULT_LANGUAGE } from '../i18n/dictionary';
import { getItem, setItem } from '../lib/storage';

const LanguageContext = createContext(null);

/**
 * LanguageProvider — wraps the whole app (see App.jsx). Persists the chosen
 * language across visits and exposes a small t('section.key') helper. This is
 * the "shell" Phase 1 asks for; Phase 7 will add the visible switcher's full
 * polish and translate every page's copy, but the mechanism is complete now.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => getItem('language', DEFAULT_LANGUAGE));

  useEffect(() => {
    setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = useCallback(
    (path) => {
      const parts = path.split('.');
      let node = dictionary[language] ?? dictionary[DEFAULT_LANGUAGE];
      for (const part of parts) {
        node = node?.[part];
      }
      if (node === undefined) {
        // Fall back to English rather than showing a raw key, then warn once in dev.
        let fallback = dictionary[DEFAULT_LANGUAGE];
        for (const part of parts) fallback = fallback?.[part];
        if (import.meta.env?.DEV) {
          console.warn(`Missing translation for "${path}" in "${language}"`);
        }
        return fallback ?? path;
      }
      return node;
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
