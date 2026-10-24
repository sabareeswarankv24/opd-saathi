import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useSettings } from '../lib/settings.jsx';
import { raiseFlag, useHospital } from '../lib/store.js';
import { canSpeak, speakNow, stopSpeaking } from '../lib/speech.js';

function readableText(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll('[data-noread],script,style,svg').forEach((n) => n.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

export default function Layout({ children, back, wide = false }) {
  const { t, lang, read, myToken } = useSettings();
  const state = useHospital();
  const loc = useLocation();
  const nav = useNavigate();
  const mainRef = useRef(null);
  const [raised, setRaised] = useState(false);

  // Read each screen aloud by itself if the patient asked for that.
  useEffect(() => {
    if (!read || !canSpeak) return undefined;
    const id = setTimeout(() => {
      if (mainRef.current) speakNow(readableText(mainRef.current).slice(0, 900), lang);
    }, 500);
    return () => {
      clearTimeout(id);
      stopSpeaking();
    };
  }, [loc.pathname, read, lang]);

  const raise = () => {
    const p = myToken ? state.patients[myToken] : null;
    raiseFlag({ token: p ? p.token : '', name: p ? p.name : '', where: loc.pathname });
    setRaised(true);
    if (read) speakNow(`${t('em.raised.title')}. ${t('em.raised.body')}`, lang);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl pb-36">
      <header className="no-print flex flex-wrap items-center gap-2 px-3 pt-3">
        {back ? (
          <button type="button" className="btn btn-inline px-[10px]" onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))} aria-label={t('common.back')}>
            <Icon name="back" />
            <span>{t('common.back')}</span>
          </button>
        ) : null}
        <Link to="/" className="btn btn-inline min-w-[56px] px-[10px]" aria-label={t('common.home')}>
          <Icon name="home" />
          <span>{t('common.home')}</span>
        </Link>
        <span className="hidden flex-1 min-[420px]:block" />
        {canSpeak ? (
          <button
            type="button"
            className="btn btn-inline min-w-[56px] px-[10px]"
            aria-label={t('common.listenScreen')}
            onClick={() => mainRef.current && speakNow(readableText(mainRef.current).slice(0, 1500), lang)}
          >
            <Icon name="speaker" />
          </button>
        ) : null}
        <Link to="/settings" className="btn btn-inline min-w-[56px] px-[10px]" aria-label={t('home.settings')}>
          <Icon name="settings" />
        </Link>
      </header>

      <main ref={mainRef} className={`px-3 pt-4 ${wide ? '' : 'mx-auto max-w-xl'}`}>
        {children}
      </main>

      {/* Emergency actions are on every screen. Nothing here ever waits for registration. */}
      <nav aria-label={t('em.title')} className="no-print fixed inset-x-0 bottom-0 z-40 border-t-4 border-danger bg-page p-2">
        <div className="mx-auto flex max-w-xl flex-wrap gap-2">
          <Link to="/emergency" className="btn btn-danger min-w-[140px] flex-1 px-2 text-[18px] no-underline">
            <Icon name="siren" />
            <span>{t('em.button')}</span>
          </Link>
          <button type="button" className="btn min-w-[140px] flex-1 border-danger px-2 text-[18px] text-danger" onClick={raise}>
            <Icon name="bell" />
            <span>{t('em.urgent')}</span>
          </button>
        </div>
      </nav>

      {raised ? (
        <div role="alertdialog" aria-modal="true" aria-labelledby="raised-title" className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border-4 border-danger bg-card p-4">
            <h2 id="raised-title" className="flex items-center gap-2 text-2xl font-extrabold text-danger">
              <Icon name="check" size={32} /> {t('em.raised.title')}
            </h2>
            <p className="my-3">{t('em.raised.body')}</p>
            <p className="mb-3 text-sm text-muted">{t('em.staffOnly')}</p>
            <Link to="/emergency" className="btn btn-danger mb-2" onClick={() => setRaised(false)}>
              <Icon name="siren" /> <span>{t('em.showWay')}</span>
            </Link>
            <button type="button" className="btn" onClick={() => setRaised(false)}>
              <Icon name="check" /> <span>{t('common.close')}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
