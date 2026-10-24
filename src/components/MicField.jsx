import { useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { useSettings } from '../lib/settings.jsx';
import { SpeechRecognitionCtor } from '../lib/speech.js';

// A text box with a big microphone button (only where the browser can listen).
export default function MicField({ id, label, hint, value, onChange, error, inputMode, type = 'text', digitsOnly = false, maxLength, autoComplete }) {
  const { t, lang } = useSettings();
  const [listening, setListening] = useState(false);
  const [fail, setFail] = useState(false);
  const rec = useRef(null);

  const start = () => {
    if (!SpeechRecognitionCtor) return;
    if (listening && rec.current) {
      rec.current.stop();
      return;
    }
    setFail(false);
    const r = new SpeechRecognitionCtor();
    r.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      let text = e.results[0][0].transcript || '';
      if (digitsOnly) text = text.replace(/\D/g, '');
      else text = text.replace(/[.,!?]/g, '').trim();
      if (maxLength) text = text.slice(0, maxLength);
      onChange(text);
    };
    r.onerror = () => {
      setFail(true);
      setListening(false);
    };
    r.onend = () => setListening(false);
    rec.current = r;
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
      setFail(true);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xl font-bold">{label}</label>
      {hint ? <p id={`${id}-hint`} className="mb-2 text-muted">{hint}</p> : null}
      <div className="flex items-stretch gap-2">
        <input
          id={id}
          className="field min-w-0 flex-1"
          type={type}
          inputMode={inputMode}
          value={value}
          maxLength={maxLength}
          autoComplete={autoComplete || 'off'}
          aria-describedby={`${hint ? `${id}-hint ` : ''}${error ? `${id}-err` : ''}`.trim() || undefined}
          aria-invalid={error ? 'true' : undefined}
          onChange={(e) => onChange(digitsOnly ? e.target.value.replace(/\D/g, '') : e.target.value)}
        />
        {SpeechRecognitionCtor ? (
          <button type="button" onClick={start} aria-pressed={listening} aria-label={`${t('reg.mic')}: ${label}`} className={`btn btn-inline min-w-[72px] flex-col gap-0 px-2 ${listening ? 'btn-primary pulse' : ''}`}>
            <Icon name="mic" size={30} />
            <span className="text-sm">{t('reg.mic')}</span>
          </button>
        ) : null}
      </div>
      {listening ? <p role="status" className="mt-2 font-bold text-brand">{t('reg.mic.listening')}</p> : null}
      {fail ? <p role="alert" className="mt-2 font-bold text-danger">{t('reg.mic.fail')}</p> : null}
      {error ? <p id={`${id}-err`} role="alert" className="mt-2 flex items-center gap-2 font-bold text-danger"><Icon name="warn" size={22} />{error}</p> : null}
    </div>
  );
}
