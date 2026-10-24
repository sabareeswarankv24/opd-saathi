import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import { Heading } from '../components/UI.jsx';
import { CLINICS, CLINIC_BY_ID } from '../data/departments.js';
import { useSettings } from '../lib/settings.jsx';
import { useTick, clockText } from '../lib/hooks.js';
import { audioCtx, beep } from '../lib/speech.js';
import {
  addSamples, callNext, crowdLevel, doctorStatus, estimateWait, formatClock, markNoShow, moveToClinic,
  raiseFlag, resetAll, seeFlag, sendToEnd, setDoctor, setTimeScale, simNow, useHospital,
} from '../lib/store.js';

const CROWD = {
  calm: { icon: 'check', cls: 'border-ok text-ok', key: 'staff.crowd.calm' },
  busy: { icon: 'warn', cls: 'border-warnink bg-warnbg text-warnink', key: 'staff.crowd.busy' },
  full: { icon: 'siren', cls: 'border-danger bg-danger text-ondanger', key: 'staff.crowd.full' },
};

function UrgentPanel({ state }) {
  const { t } = useSettings();
  const open = state.flags.filter((f) => !f.seen);
  const [armed, setArmed] = useState(false);

  // Sound repeats until every flag is marked as seen.
  useEffect(() => {
    if (!armed || open.length === 0) return undefined;
    beep('alarm');
    const id = setInterval(() => beep('alarm'), 3000);
    return () => clearInterval(id);
  }, [armed, open.length]);

  const arm = () => {
    audioCtx();
    beep('soft');
    setArmed(true);
  };

  return (
    <section aria-labelledby="urgent-h" className={`sticky top-0 z-30 mb-4 rounded-2xl border-4 p-3 ${open.length ? 'border-danger bg-danger text-ondanger' : 'border-line bg-card'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="urgent-h" className="flex flex-1 items-center gap-2 text-xl font-extrabold">
          <Icon name="siren" size={30} /> {t('staff.urgent.title')} {open.length ? `(${open.length})` : ''}
        </h2>
        {!armed ? (
          <button type="button" onClick={arm} className={`btn btn-inline btn-sm ${open.length ? 'pulse' : ''}`} style={open.length ? { background: 'var(--ondanger)', color: 'var(--danger)', borderColor: 'var(--ondanger)' } : undefined}>
            <Icon name="speaker" /> <span>{t('staff.urgent.soundOff')}</span>
          </button>
        ) : (
          <span className="chip"><Icon name="speaker" size={20} /> {t('staff.urgent.sound')}</span>
        )}
      </div>
      {open.length === 0 ? <p className="mt-1">{t('staff.urgent.none')}</p> : (
        <ul className="mt-2 grid gap-2" role="alert">
          {open.slice().reverse().map((f) => (
            <li key={f.id} className="rounded-xl border-2 border-ondanger bg-card p-3 text-ink">
              <p className="text-lg font-extrabold">{f.token ? t('staff.urgent.token', { token: f.token }) : t('staff.urgent.who')}{f.name ? ` · ${f.name}` : ''}</p>
              <p className="text-base">{t('staff.urgent.at', { time: formatClock(f.at) })} {f.where ? `· ${t('staff.urgent.where', { where: f.where })}` : ''}</p>
              <p className="font-bold text-danger">{t('staff.urgent.assess')}</p>
              <button type="button" className="btn btn-primary mt-2" onClick={() => seeFlag(f.id)}><Icon name="check" /> <span>{t('staff.urgent.seen')}</span></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ClinicCard({ state, clinicId }) {
  const { t } = useSettings();
  const c = CLINIC_BY_ID[clinicId];
  const cs = state.clinics[clinicId];
  const doc = doctorStatus(state, clinicId);
  const crowd = crowdLevel(state, clinicId);
  const cr = CROWD[crowd.level];
  const serving = cs.serving ? state.patients[cs.serving] : null;
  const avgWait = estimateWait(state, clinicId, cs.queue.length);
  const roomNo = t(`place.${c.room}`);
  const others = CLINICS.filter((x) => x.id !== clinicId);

  return (
    <article className="card space-y-3" aria-label={`${roomNo} ${t(`dept.${c.dept}`)}`}>
      <header>
        <h3 className="text-xl font-extrabold">{roomNo} · {t(`dept.${c.dept}`)}</h3>
        <p className="text-base text-muted">{t(`doc.${c.id}`)} · {t('staff.hours', { from: c.hours[0], to: c.hours[1] })}</p>
      </header>

      <div className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 font-bold ${cr.cls}`}>
        <Icon name={cr.icon} size={24} />
        <span>{t('staff.crowd')}: {t(cr.key)} · {t('staff.seats', { n: crowd.n, s: crowd.seats })}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-soft p-2">
          <p className="text-sm">{t('staff.serving')}</p>
          <p className="text-xl font-extrabold" dir="ltr">{cs.serving || t('staff.none')}</p>
          {serving ? <p className="text-sm">{serving.name}</p> : null}
        </div>
        <div className="rounded-xl bg-soft p-2">
          <p className="text-sm">{t('staff.waiting')}</p>
          <p className="text-xl font-extrabold">{cs.queue.length}</p>
        </div>
        <div className="rounded-xl bg-soft p-2">
          <p className="text-sm">{t('staff.avg')}</p>
          <p className="text-xl font-extrabold">{avgWait === 0 ? '0' : `~${avgWait}`} <span className="text-sm">{t('common.min')}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn btn-primary" onClick={() => callNext(clinicId)}><Icon name="play" /> <span>{t('staff.callNext')}</span></button>
        <button type="button" className="btn" disabled={!cs.serving} onClick={() => markNoShow(clinicId)}><Icon name="ban" /> <span>{t('staff.noShow')}</span></button>
      </div>

      <fieldset>
        <legend className="mb-1 font-bold">{t('staff.doctor')}: {doc.kind === 'break' ? t('turn.doc.break', { time: formatClock(doc.until) }) : doc.kind === 'late' ? t('turn.doc.late', { n: doc.lateMin }) : t('turn.doc.in')}</legend>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" aria-pressed={doc.kind === 'in'} className={`btn btn-sm px-1 ${doc.kind === 'in' ? 'btn-primary' : ''}`} onClick={() => setDoctor(clinicId, 'in')}><Icon name="check" /> <span>{t('staff.doc.in')}</span></button>
          <button type="button" className="btn btn-sm px-1" onClick={() => setDoctor(clinicId, 'break', 15)}><Icon name="clock" /> <span>{t('staff.doc.break15')}</span></button>
          <button type="button" className="btn btn-sm px-1" onClick={() => setDoctor(clinicId, 'break', 30)}><Icon name="clock" /> <span>{t('staff.doc.break30')}</span></button>
          <button type="button" className="btn btn-sm px-1" onClick={() => setDoctor(clinicId, 'late', 10)}><Icon name="warn" /> <span>{t('staff.doc.late10')}</span></button>
          <button type="button" className="btn btn-sm px-1" onClick={() => setDoctor(clinicId, 'late', 20)}><Icon name="warn" /> <span>{t('staff.doc.late20')}</span></button>
        </div>
      </fieldset>

      <div>
        <h4 className="mb-1 font-bold">{t('staff.queue')}</h4>
        {cs.queue.length === 0 ? <p className="text-muted">{t('staff.queue.empty')}</p> : (
          <ol className="grid gap-2">
            {cs.queue.map((tok, i) => {
              const p = state.patients[tok];
              if (!p) return null;
              return (
                <li key={tok} className="rounded-xl border-2 border-line p-2">
                  <p className="font-bold"><span dir="ltr">{i + 1}. {tok}</span> · {p.name}, {p.age}</p>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button type="button" className="btn btn-sm px-1" onClick={() => sendToEnd(tok)}><Icon name="skip" /> <span>{t('staff.toEnd')}</span></button>
                    <label className="sr-only" htmlFor={`mv-${tok}`}>{t('staff.move')}: {tok}</label>
                    <select id={`mv-${tok}`} className="field min-h-[56px] px-2 text-base" value="" onChange={(e) => e.target.value && moveToClinic(tok, e.target.value)}>
                      <option value="">{t('staff.moveTo')}</option>
                      {others.map((o) => <option key={o.id} value={o.id}>{t(`place.${o.room}`)} · {t(`dept.${o.dept}`)}</option>)}
                    </select>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </article>
  );
}

export default function Staff() {
  const { t } = useSettings();
  const state = useHospital();
  useTick(1000);
  const totalWaiting = CLINICS.reduce((n, c) => n + state.clinics[c.id].queue.length, 0);
  const fast = state.clock.scale > 1;
  const lastRaisedTest = useRef(0);

  return (
    <Layout wide>
      <div className="mx-auto max-w-6xl">
        <Heading sub={t('staff.notice')}>{t('staff.title')}</Heading>

        <UrgentPanel state={state} />

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Link to="/staff/counter" className="btn no-underline"><Icon name="register" /> <span>{t('staff.counter')}</span></Link>
          <Link to="/board" target="_blank" rel="noreferrer" className="btn no-underline"><Icon name="tv" /> <span>{t('staff.board')}</span></Link>
        </div>

        <section className="card mb-4" aria-labelledby="demo-h">
          <h2 id="demo-h" className="mb-2 text-xl font-extrabold">{t('staff.demo.title')}</h2>
          <p className="mb-2 flex items-center gap-2 font-bold"><Icon name="clock" /> {t('staff.demo.clock', { time: formatClock(simNow(state)) })} · {t('staff.totals', { n: totalWaiting })}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" className="btn" onClick={() => addSamples(20)}><Icon name="users" /> <span>{t('staff.demo.add')}</span></button>
            <button type="button" aria-pressed={fast} className={`btn ${fast ? 'btn-primary' : ''}`} onClick={() => setTimeScale(fast ? 1 : 10)}><Icon name="clock" /> <span>{fast ? t('staff.demo.speed.on') : t('staff.demo.speed')}</span></button>
            <button type="button" className="btn" onClick={() => { if (window.confirm(t('staff.demo.resetAsk'))) resetAll(); }}><Icon name="refresh" /> <span>{t('staff.demo.reset')}</span></button>
            <button type="button" className="btn" onClick={() => { lastRaisedTest.current = Date.now(); raiseFlag({ name: 'Test', where: '/staff' }); }}><Icon name="bell" /> <span>{t('staff.demo.test')}</span></button>
          </div>
          <p className="mt-2 text-sm text-muted">{t('staff.updated', { time: clockText(state.updatedAt) })}</p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CLINICS.map((c) => <ClinicCard key={c.id} state={state} clinicId={c.id} />)}
        </div>
      </div>
    </Layout>
  );
}
