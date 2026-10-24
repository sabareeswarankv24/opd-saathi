// Reading aloud (speech synthesis), speaking to type (speech recognition), sounds and vibration.
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

const LANG_CODE = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };

export function hasVoiceFor(lang) {
  if (!canSpeak) return false;
  const code = LANG_CODE[lang] || 'en-IN';
  return !!pickVoice(code);
}

function pickVoice(code) {
  if (!canSpeak) return null;
  const voices = window.speechSynthesis.getVoices();
  const base = code.split('-')[0];
  return voices.find((v) => v.lang === code) || voices.find((v) => v.lang.replace('_', '-').startsWith(base)) || null;
}

export function speak(text, lang = 'en') {
  if (!canSpeak || !text) return;
  const code = LANG_CODE[lang] || 'en-IN';
  const u = new SpeechSynthesisUtterance(text);
  u.lang = code;
  const v = pickVoice(code);
  if (v) u.voice = v;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export function speakNow(text, lang = 'en') {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  speak(text, lang);
}

export function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
}

// "MED-042" -> "M E D, 0 4 2" so every letter and digit is read clearly.
export function spellToken(token) {
  return String(token).replace('-', ' ').split('').join(' ').replace(/\s+/g, ' ');
}

export const SpeechRecognitionCtor =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition || null : null;

// Browsers block sound and vibration until the person has touched the page once.
export function userActive() {
  return typeof navigator !== 'undefined' && navigator.userActivation ? navigator.userActivation.hasBeenActive : true;
}

// ---- sound ----
let audio = null;
export function audioCtx() {
  try {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    return audio;
  } catch {
    return null;
  }
}

export function beep(kind = 'soft') {
  if (!userActive()) return false;
  const ctx = audioCtx();
  if (!ctx) return false;
  const seq = kind === 'alarm' ? [880, 660, 880, 660] : [660, 880];
  const dur = kind === 'alarm' ? 0.18 : 0.15;
  let t = ctx.currentTime;
  for (const f of seq) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = kind === 'alarm' ? 'square' : 'sine';
    o.frequency.value = f;
    g.gain.value = kind === 'alarm' ? 0.12 : 0.2;
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
    t += dur + 0.04;
  }
  return true;
}

export function vibrate(pattern = [300, 150, 300, 150, 600]) {
  if (!userActive()) return;
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* not supported */
  }
}
