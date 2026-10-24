import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CLINICS } from '../data/departments.js';
import { PLACE_BY_ID } from '../data/hospital.js';
import { makeT } from '../i18n/index.js';
import { clockText, useTick } from '../lib/hooks.js';
import { audioCtx, beep, canSpeak, spellToken, speak, hasVoiceFor } from '../lib/speech.js';
import { delayMinutes, doctorStatus, formatClock, simNow, useHospital } from '../lib/store.js';

// Large-screen board for a TV. Cycles between English, Hindi and Tamil.
export default function Board() {
  const state = useHospital();
  useTick(1000);
  const [lang, setLang] = useState('en');
  const [sound, setSound] = useState(false);
  const lastCall = useRef(Math.max(0, ...state.calls.map((c) => c.id)));
  const t = makeT(lang);

  useEffect(() => {
    const langs = ['en', 'hi', 'ta'];
    const id = setInterval(() => setLang((l) => langs[(langs.indexOf(l) + 1) % langs.length]), 7000);
    return () => clearInterval(id);
  }, []);

  // Say each newly called token out loud (English, Hindi, and Tamil if browser voice exists).
  useEffect(() => {
    const fresh = state.calls.filter((c) => c.id > lastCall.current);
    if (!fresh.length) return;
    lastCall.current = Math.max(...fresh.map((c) => c.id));
    if (!sound) return;
    beep('soft');
    fresh.forEach((c) => {
      const room = CLINICS.find((x) => x.id === c.clinic).room.replace(/^r/, '');
      const token = spellToken(c.token);
      if (canSpeak) {
        speak(makeT('en')('board.announce', { token, room }), 'en');
        speak(makeT('hi')('board.announce', { token, room }), 'hi');
        if (hasVoiceFor('ta')) {
          speak(makeT('ta')('board.announce', { token, room }), 'ta');
        }
      }
    });
  }, [state.calls, sound]);

  const enable = () => {
    audioCtx();
    beep('soft');
    setSound(true);
    if (canSpeak) speak(makeT('en')('board.soundOn'), 'en');
  };

  return (
    <div className="min-h-screen bg-page p-3 text-ink md:p-6" lang={lang}>
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-3xl font-extrabold md:text-5xl">{t('hospital.name')} · {t('board.title')}</h1>
        <p className="text-2xl font-bold md:text-4xl" dir="ltr">{t('board.clock', { time: formatClock(simNow(state)) })}</p>
        {!sound ? (
          <button type="button" className="btn btn-inline btn-primary" onClick={enable}><Icon name="speaker" /> <span>{t('board.sound')}</span></button>
        ) : (
          <span className="chip"><Icon name="speaker" size={20} /> {t('board.soundOn')}</span>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CLINICS.map((c) => {
          const cs = state.clinics[c.id];
          const doc = doctorStatus(state, c.id);
          const room = PLACE_BY_ID[c.room];
          const next = cs.queue.slice(0, 3);
          return (
            <section key={c.id} className="card flex flex-col gap-2" aria-label={`${t(`place.${c.room}`)} ${t(`dept.${c.dept}`)}`}>
              <div>
                <h2 className="text-2xl font-extrabold md:text-3xl">{t('board.room', { room: t(`place.${c.room}`).replace(/^\D+/, '') })}</h2>
                <p className="text-lg font-bold md:text-xl">{t(`dept.${c.dept}`)}</p>
                <p className="text-base text-muted md:text-lg">{t('board.floor', { floor: t(`floor.${room.floor}`) })}</p>
              </div>
              <div className="rounded-xl bg-brand p-2 text-center text-onbrand">
                <p className="text-base md:text-lg">{t('board.serving')}</p>
                <p className="text-4xl font-extrabold md:text-6xl" dir="ltr">{cs.serving || t('board.none')}</p>
              </div>
              <div>
                <p className="text-base font-bold md:text-lg">{t('board.next')}</p>
                <p className="min-h-[2rem] text-xl font-extrabold md:text-3xl" dir="ltr">{next.length ? next.join('  ·  ') : t('board.none')}</p>
                <p className="text-base text-muted md:text-lg">{t('board.waiting', { n: cs.queue.length })}</p>
              </div>
              {doc.kind !== 'in' ? (
                <p className="flex items-center gap-2 rounded-xl border-2 border-warnink bg-warnbg p-2 text-base font-bold text-warnink md:text-lg">
                  <Icon name={doc.kind === 'break' ? 'clock' : 'warn'} />
                  {doc.kind === 'late' ? t('board.delay.late', { n: delayMinutes(state, c.id) }) : t('board.delay.break', { time: formatClock(doc.until) })}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>

      <footer className="mt-4 rounded-2xl border-4 border-danger bg-danger p-3 text-xl font-extrabold text-ondanger md:text-3xl">
        <Icon name="siren" className="mr-2 inline" /> {t('board.emergency')}
      </footer>
      <p className="mt-2 text-sm text-muted">{clockText(state.updatedAt)}</p>
    </div>
  );
}
