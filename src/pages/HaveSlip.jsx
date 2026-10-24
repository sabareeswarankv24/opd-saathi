import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import { Heading } from '../components/UI.jsx';
import { useSettings } from '../lib/settings.jsx';
import { getState, normalizeToken } from '../lib/store.js';

const canScan = typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia;

export default function HaveSlip() {
  const { t } = useSettings();
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [scanning, setScanning] = useState(false);
  const video = useRef(null);
  const stream = useRef(null);

  const open = (raw) => {
    const token = normalizeToken(raw);
    if (!token || !getState().patients[token]) {
      setErr(t('have.notFound'));
      return false;
    }
    nav(`/turn/${token}`);
    return true;
  };

  const stop = () => {
    if (stream.current) stream.current.getTracks().forEach((tr) => tr.stop());
    stream.current = null;
    setScanning(false);
  };
  useEffect(() => stop, []);

  const scan = async () => {
    setErr('');
    try {
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setScanning(true);
      await new Promise((r) => setTimeout(r, 50));
      const v = video.current;
      v.srcObject = stream.current;
      await v.play();
      const loop = async () => {
        if (!stream.current) return;
        try {
          const codes = await detector.detect(v);
          for (const c of codes) {
            const m = String(c.rawValue).match(/[A-Za-z]{3}-?\d{1,4}/);
            if (m && open(m[0])) {
              stop();
              return;
            }
          }
        } catch {
          /* keep trying */
        }
        setTimeout(loop, 400);
      };
      loop();
    } catch {
      stop();
      setErr(t('have.cameraFail'));
    }
  };

  return (
    <Layout>
      <Heading>{t('have.title')}</Heading>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setErr('');
          open(text);
        }}
      >
        <div>
          <label htmlFor="token" className="mb-1 block text-xl font-bold">{t('have.enter')}</label>
          <p id="token-hint" className="mb-2 text-muted">{t('have.hint')}</p>
          <input id="token" className="field text-2xl font-bold uppercase" dir="ltr" value={text} onChange={(e) => setText(e.target.value)} aria-describedby="token-hint" autoComplete="off" autoCapitalize="characters" maxLength={9} aria-label={t('have.label')} />
        </div>
        {err ? <p role="alert" className="flex items-center gap-2 font-bold text-danger"><Icon name="warn" size={22} /> {err}</p> : null}
        <button type="submit" className="btn btn-primary"><Icon name="clock" /> <span>{t('have.open')}</span></button>
      </form>

      {canScan ? (
        <div className="mt-4 space-y-3">
          {scanning ? (
            <>
              <p className="font-bold">{t('have.scanning')}</p>
              <video ref={video} muted playsInline className="w-full rounded-xl border-4 border-brand" aria-label={t('have.scan')} />
              <button type="button" className="btn" onClick={stop}><Icon name="close" /> <span>{t('have.stopScan')}</span></button>
            </>
          ) : (
            <button type="button" className="btn" onClick={scan}><Icon name="scan" /> <span>{t('have.scan')}</span></button>
          )}
        </div>
      ) : null}
    </Layout>
  );
}
