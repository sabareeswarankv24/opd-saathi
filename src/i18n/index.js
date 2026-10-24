import en from './en.js';
import hi from './hi.js';
import ta from './ta.js';

export const TRANSLATIONS = { en, hi, ta };

// Each language is shown in its own script in the picker.
export const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'ta', label: 'தமிழ்' },
];

export function translate(lang, key, params) {
  const table = TRANSLATIONS[lang] || en;
  let s = table[key];
  if (s === undefined) s = en[key];
  if (s === undefined) return key;
  if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m));
  return s;
}

export function makeT(lang) {
  return (key, params) => translate(lang, key, params);
}
