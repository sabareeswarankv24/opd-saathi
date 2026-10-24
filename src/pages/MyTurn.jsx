import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import RouteView from '../components/RouteView.jsx';
import PlaceSelect from '../components/PlaceSelect.jsx';
import { Heading, Listen } from '../components/UI.jsx';
import { slipInfo } from '../components/SlipCard.jsx';
import { useSettings } from '../lib/settings.jsx';
import { useOnline, useTick, clockText } from '../lib/hooks.js';
import { beep, speakNow, vibrate, canSpeak } from '../lib/speech.js';
import { doctorStatus, delayMinutes, formatClock, normalizeToken, useHospital } from '../lib/store.js';
import { findRoute, walkMinutes } from '../lib/route.js';
import { CLINIC_BY_ID } from '../data/departments.js';

export default function MyTurn() {
  const params = useParams();
  const { t, lang, myToken, set, alerted, read, assist, avoid } = useSettings();
  const token = normalizeToken(params.token) || myToken;
  const state = useHospital();
  const nav = useNavigate();
  const online = useOnline();
  useTick(5000);
  const [from, setFrom] = useState('hall_a');
  const [showWay, setShowWay] = useState(false);
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');
  const info = token ? slipInfo(state, token, t) : null;
  const fired = useRef({});

  useEffect(() => {
    if (!token) nav('/have', { replace: true });
  }, [token, nav]);

  useEffect(() => {
    if (info && token !== myToken) set({ myToken: token });
  }, [!!info, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const status = info ? info.p.status : '';
  const ahead = info ? info.ahead : 0;
  const akey = info ? `${token}@${info.p.createdAt}` : token;
  const mark = alerted[akey] || {};

  // Alerts: when 3 are ahead, and when the token is called.
  useEffect(() => {
    if (!info) return;
    const roomText = info.roomName.replace(/^\D+/, '') || info.roomName;
    const key = `${token}`;
    if (status === 'waiting' && ahead <= 3 && !mark.close && !fired.current[`${key}c`]) {
      fired.current[`${key}c`] = true;
      vibrate();
      beep('soft');
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(t('turn.notif.title'), { body: t('turn.sms.body', { room: roomText, floor: info.floorName }) });
        } catch {
          /* some phones need a service worker for this */
        }
      }
      set((s) => ({ alerted: { ...s.alerted, [akey]: { ...(s.alerted[akey] || {}), close: Date.now() } } }));
    }
    if (status === 'called' && !mark.called && !fired.current[`${key}k`]) {
      fired.current[`${key}k`] = true;
      vibrate([600, 200, 600, 200, 900]);
      beep('alarm');
      if (read || assist) speakNow(t('turn.calledSpeak', { token: token.split('').join(' '), room: roomText }), lang);
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(t('turn.notif.called'), { body: t('turn.called.sub', { room: roomText }) });
        } catch {
          /* ignore */
        }
      }
      set((s) => ({ alerted: { ...s.alerted, [akey]: { ...(s.alerted[akey] || {}), called: Date.now() } } }));
    }
  }); // runs after every update on purpose

  const allow = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      setPerm(await Notification.requestPermission());
    } catch {
      /* ignore */
    }
  };

  if (!token) return null;
  if (!info) {
    return (
      <Layout>
        <Heading>{t('turn.title')}</Heading>
        <p role="alert" className="card border-danger font-bold">{t('turn.notFound', { token })}</p>
        <Link to="/have" className="btn mt-4 no-underline"><Icon name="ticket" /> <span>{t('turn.myOther')}</span></Link>
      </Layout>
    );
  }

  const clinic = CLINIC_BY_ID[info.p.clinic];
  const cs = state.clinics[info.p.clinic];
  const doc = doctorStatus(state, info.p.clinic);
  const delay = delayMinutes(state, info.p.clinic);
  const roomNo = info.roomName.replace(/^\D+/, '') || info.roomName;
  const walkMin = (() => {
    const r = findRoute('entrance', info.roomId, avoid);
    return r ? walkMinutes(r.metres) : 5;
  })();
  const serving = cs.serving;
  const docText = doc.kind === 'break' ? t('turn.doc.break', { time: formatClock(doc.until) }) : doc.kind === 'late' ? t('turn.doc.late', { n: doc.lateMin }) : t('turn.doc.in');
  const docIcon = doc.kind === 'in' ? 'check' : doc.kind === 'break' ? 'clock' : 'warn';
  const aheadText = ahead === 0 ? t('turn.ahead0') : ahead === 1 ? t('turn.ahead1') : t('turn.ahead', { n: ahead });
  const waitText = info.wait === 0 ? t('turn.aboutShort') : t('turn.about', { n: info.wait });
  const spoken = () => t('turn.speak', { token: token.split('').join(' '), ahead: aheadText, wait: waitText, serving: serving ? serving.split('').join(' ') : t('turn.noneServing') });
  const lastText = `${clockText(state.updatedAt)}`;

  const wayBlock = (defFrom) => (
    <div className="mt-4 space-y-3">
      <PlaceSelect id="turn-from" label={t('find.from')} value={from || defFrom} onChange={setFrom} />
      <RouteView from={from || defFrom} to={info.roomId} avoid={avoid} />
    </div>
  );

  // ---- called ----
  if (status === 'called') {
    return (
      <Layout>
        <div role="alert" className="rounded-2xl border-4 border-brand bg-brand p-5 text-center text-onbrand">
          <Icon name="bell" size={56} className="mx-auto" />
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">{t('turn.called')}</h1>
          <p className="mt-2 font-extrabold [font-size:min(3.5rem,14vw)]" dir="ltr">{token}</p>
          <p className="mt-3 text-3xl font-extrabold">{t('turn.called.sub', { room: roomNo })}</p>
          <p className="mt-1 text-2xl font-bold">{t('slip.room.floor', { room: info.roomName, floor: info.floorName })}</p>
        </div>
        <div className="mt-3 flex justify-center">
          <Listen text={() => t('turn.calledSpeak', { token: token.split('').join(' '), room: roomNo })} />
        </div>
        <h2 className="mt-4 text-xl font-extrabold">{t('turn.directions')}</h2>
        {wayBlock('hall_a')}
      </Layout>
    );
  }

  // ---- done / no-show ----
  if (status === 'done' || status === 'noshow') {
    return (
      <Layout>
        <Heading>{status === 'done' ? t('turn.done') : t('turn.noshow')}</Heading>
        <p className="card text-lg">{status === 'done' ? t('turn.done.sub') : t('turn.noshow.sub')}</p>
        <div className="mt-4 grid gap-3">
          <Link to={status === 'done' ? '/find?to=pharmacy&from=entrance' : '/find?to=help&from=entrance'} className="btn btn-primary no-underline">
            <Icon name={status === 'done' ? 'pharmacy' : 'help'} /> <span>{status === 'done' ? t('turn.pharmacy') : t('find.lost.way')}</span>
          </Link>
        </div>
      </Layout>
    );
  }

  // ---- waiting ----
  const close = ahead <= 3;
  const nextText = ahead <= 1 ? t('turn.next.go', { room: roomNo, floor: info.floorName, n: walkMin }) : close ? t('turn.next.go', { room: roomNo, floor: info.floorName, n: walkMin }) : ahead > 6 ? t('turn.next.far') : t('turn.next.wait', { room: roomNo, floor: info.floorName });

  return (
    <Layout>
      <Heading>{t('turn.title')}</Heading>

      {!online ? <p role="status" className="mb-3 rounded-xl border-2 border-warnink bg-warnbg p-3 font-bold text-warnink">{t('turn.offline')} {t('turn.refresh', { time: lastText })}</p> : null}

      {close ? (
        <div role="alert" className="mb-4 rounded-2xl border-4 border-brand bg-brand p-4 text-onbrand">
          <p className="flex items-center gap-2 text-2xl font-extrabold"><Icon name="bell" size={32} /> {t('turn.close')}</p>
          <p className="mt-1 text-lg">{t('turn.close.banner', { n: ahead, room: roomNo, floor: info.floorName })}</p>
        </div>
      ) : null}

      <section className="card border-4 border-brand text-center" aria-live="polite">
        <p className="text-sm text-muted">{t('turn.yourToken')}</p>
        <p className="font-extrabold [font-size:min(2.25rem,11vw)]" dir="ltr">{token}</p>
        <p className="mt-3 text-3xl font-extrabold leading-tight">{aheadText}</p>
        <p className="mt-1 text-2xl font-bold text-brand">{waitText}</p>
        {delay > 0 ? <p className="mt-1 text-base text-muted">{t('turn.late.note')}</p> : null}
      </section>

      <div className="mt-3 grid gap-3">
        <div className="card">
          <p className="text-sm text-muted">{t('turn.serving')}</p>
          <p className="text-3xl font-extrabold" dir="ltr">{serving || t('turn.noneServing')}</p>
        </div>
        <div className="card">
          <p className="text-sm text-muted">{t('turn.doctor')}: {t(`doc.${clinic.id}`)}</p>
          <p className="flex items-center gap-2 text-xl font-bold"><Icon name={docIcon} /> {docText}</p>
        </div>
        {info.p.moved ? <p className="card border-warnink bg-warnbg font-bold text-warnink">{t('turn.moved', { dept: info.dept, room: roomNo })}</p> : null}
        <div className="card">
          <p className="flex items-center gap-2 text-xl font-extrabold"><Icon name="flag" /> {t('turn.next')}</p>
          <p className="mt-1 text-lg">{nextText}</p>
        </div>
      </div>

      {mark.close ? (
        <div className="card mt-3 border-dashed" aria-label={t('turn.sms.title')}>
          <p className="flex items-center gap-2 font-bold"><Icon name="phone" /> {t('turn.sms.title')}</p>
          <p className="mt-1 rounded-xl bg-soft p-3 text-lg">{t('turn.sms.body', { room: roomNo, floor: info.floorName })}</p>
          <p className="mt-1 text-sm text-muted">{t('turn.sms.note')}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        <button type="button" className="btn btn-primary" aria-expanded={showWay} onClick={() => setShowWay(!showWay)}>
          <Icon name="pin" /> <span>{t('turn.directions')}</span>
        </button>
        {showWay ? wayBlock('entrance') : null}
        <Link to={`/slip/${token}`} className="btn no-underline"><Icon name="ticket" /> <span>{t('slip.title')}</span></Link>
        {perm === 'default' ? (
          <button type="button" className="btn" onClick={allow}><Icon name="bell" /> <span>{t('turn.alertsOff')}</span></button>
        ) : perm === 'granted' ? (
          <p className="flex items-center gap-2 font-bold"><Icon name="check" /> {t('turn.alertsOn')}</p>
        ) : null}
        <Listen text={spoken} label={t('slip.read')} className="w-full" />
        <Link to="/have" className="btn no-underline"><Icon name="swap" /> <span>{t('turn.myOther')}</span></Link>
      </div>
      <p className="mt-4 text-center text-sm text-muted" role="status">{t('turn.refresh', { time: lastText })}</p>
    </Layout>
  );
}
