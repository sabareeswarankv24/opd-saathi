import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import LanguagePicker from '../components/LanguagePicker.jsx';
import { Heading, Switch } from '../components/UI.jsx';
import { useSettings } from '../lib/settings.jsx';
import { canSpeak } from '../lib/speech.js';

export default function Settings() {
  const { t, size, contrast, read, avoid, assist, set, myToken } = useSettings();
  const [prompt, setPrompt] = useState(() => window.__installPrompt || null);

  // "Install app" appears only when the browser offers it.
  useEffect(() => {
    const on = (e) => {
      e.preventDefault();
      window.__installPrompt = e;
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', on);
    return () => window.removeEventListener('beforeinstallprompt', on);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    window.__installPrompt = null;
    setPrompt(null);
  };

  return (
    <Layout>
      <Heading>{t('set.title')}</Heading>
      <div className="space-y-5">
        <section aria-labelledby="s-lang">
          <h2 id="s-lang" className="mb-2 flex items-center gap-2 text-xl font-extrabold"><Icon name="globe" /> {t('set.language')}</h2>
          <LanguagePicker compact onPick={(id) => set({ lang: id })} />
        </section>

        <section aria-labelledby="s-size">
          <h2 id="s-size" className="mb-2 flex items-center gap-2 text-xl font-extrabold"><Icon name="text" /> {t('set.size')}</h2>
          <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="s-size">
            {[0, 1, 2].map((n) => (
              <button key={n} type="button" aria-pressed={size === n} onClick={() => set({ size: n })} className={`btn px-1 ${size === n ? 'btn-primary' : ''}`}>
                <span style={{ fontSize: `${1 + n * 0.1}rem` }}>{t(`set.size.${n}`)}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 rounded-xl bg-soft p-3">{t('set.sample.text')}</p>
        </section>

        <Switch checked={contrast} onChange={(v) => set({ contrast: v })} icon="contrast" label={t('set.contrast')} sub={t('set.contrast.sub')} />
        {canSpeak ? (
          <Switch checked={read} onChange={(v) => set({ read: v })} icon="speaker" label={t('set.read')} sub={t('set.read.sub')} />
        ) : (
          <p className="card">{t('set.noVoice')}</p>
        )}
        <Switch checked={avoid} onChange={(v) => set({ avoid: v })} icon="lift" label={t('set.avoid')} sub={t('set.avoid.sub')} />
        <Switch checked={assist} onChange={(v) => (v ? set({ assist: true, read: true, avoid: true }) : set({ assist: false }))} icon="users" label={t('set.assist')} sub={t('set.assist.sub')} />

        {prompt ? (
          <button type="button" className="btn btn-primary" onClick={install}><Icon name="install" /> <span>{t('set.install')}</span></button>
        ) : null}
        {myToken ? (
          <button type="button" className="btn" onClick={() => set({ myToken: '' })}><Icon name="ban" /> <span>{t('set.reset')}</span></button>
        ) : null}
      </div>
    </Layout>
  );
}
