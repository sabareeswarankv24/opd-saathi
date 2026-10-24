import { useState } from 'react';
import Icon from './Icon.jsx';
import { useSettings } from '../lib/settings.jsx';
import { canSpeak, speakNow, stopSpeaking, hasVoiceFor } from '../lib/speech.js';

export function Heading({ children, sub, id }) {
  return (
    <div className="mb-4">
      <h1 id={id} className="text-2xl font-extrabold leading-tight">{children}</h1>
      {sub ? <p className="mt-1 text-muted">{sub}</p> : null}
    </div>
  );
}

// A switch with a label. Shows On/Off in words too, so colour is never the only signal.
export function Switch({ checked, onChange, label, sub, icon, id }) {
  const { t } = useSettings();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className="flex w-full min-h-[56px] items-center gap-3 rounded-2xl border-[3px] border-line bg-card px-3 py-2 text-start"
    >
      {icon ? <Icon name={icon} /> : null}
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{label}</span>
        {sub ? <span className="block text-sm text-muted">{sub}</span> : null}
      </span>
      <span className="flex shrink-0 flex-col items-center gap-0.5">
        <span
          aria-hidden="true"
          className={`flex h-8 w-14 items-center rounded-full border-2 border-ink px-1 ${checked ? 'bg-brand justify-end' : 'bg-soft justify-start'}`}
        >
          <span className="h-5 w-5 rounded-full bg-ink" />
        </span>
        <span className="text-sm font-bold">{checked ? t('common.on') : t('common.off')}</span>
      </span>
    </button>
  );
}

// Reads the given text aloud. Hidden if the browser cannot speak or has no voice for the selected language.
export function Listen({ text, label, className = '' }) {
  const { t, lang } = useSettings();
  const [on, setOn] = useState(false);
  if (!canSpeak || !hasVoiceFor(lang)) return null;
  const go = () => {
    if (on) {
      stopSpeaking();
      setOn(false);
      return;
    }
    speakNow(typeof text === 'function' ? text() : text, lang);
    setOn(true);
    setTimeout(() => setOn(false), 4000);
  };
  return (
    <button type="button" className={`btn btn-inline ${className}`} onClick={go} aria-label={label || t('common.listen')}>
      <Icon name="speaker" />
      <span>{on ? t('common.stopListen') : label || t('common.listen')}</span>
    </button>
  );
}

// One-line explanation for a term the first time it appears.
export function Explain({ children }) {
  return <p className="mt-1 rounded-xl bg-soft px-3 py-2 text-base">{children}</p>;
}

export function LinkLikeButton({ icon, children, ...rest }) {
  return (
    <button type="button" className="btn" {...rest}>
      {icon ? <Icon name={icon} /> : null}
      <span>{children}</span>
    </button>
  );
}
