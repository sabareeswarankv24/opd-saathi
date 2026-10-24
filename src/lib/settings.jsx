import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { makeT } from '../i18n/index.js';

const KEY = 'opd.settings.v1';
const DEFAULTS = {
  lang: null, // null = first visit, ask for a language
  size: 0, // 0 normal, 1 large, 2 largest
  contrast: false,
  read: false,
  avoid: false,
  assist: false,
  myToken: '',
  alerted: {}, // token -> { close: bool, called: bool }
  draft: { step: 1, name: '', age: '', gender: '', mobile: '', dept: '' },
};

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && typeof raw === 'object') {
      return { ...DEFAULTS, ...raw, draft: { ...DEFAULTS.draft, ...(raw.draft || {}) }, alerted: raw.alerted || {} };
    }
  } catch {
    /* use defaults */
  }
  return { ...DEFAULTS };
}

const Ctx = createContext(null);

export function SettingsProvider({ children }) {
  const [s, setS] = useState(load);

  const set = useCallback((patch) => {
    setS((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.size = String(s.size);
    root.classList.toggle('hc', !!s.contrast);
    root.classList.toggle('assisted', !!s.assist);
    root.lang = s.lang === 'hi' ? 'hi' : 'en';
  }, [s.size, s.contrast, s.assist, s.lang]);

  const lang = s.lang || 'en';
  const t = useMemo(() => makeT(lang), [lang]);
  const value = useMemo(() => ({ ...s, lang, firstVisit: s.lang === null, set, t }), [s, lang, set, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
