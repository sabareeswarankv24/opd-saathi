import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import MicField from '../components/MicField.jsx';
import RouteView from '../components/RouteView.jsx';
import { Switch } from '../components/UI.jsx';
import { DEPARTMENTS } from '../data/departments.js';
import { useSettings } from '../lib/settings.jsx';
import { registerPatient } from '../lib/store.js';

const TOTAL = 5;
const SIGNS = [
  ['chest', 'heart'], ['breath', 'user'], ['bleed', 'water'], ['faint', 'warn'],
  ['stroke', 'user'], ['injury', 'bone'], ['preg', 'woman'], ['child', 'child'],
];

export function EmergencySigns({ withButton = true }) {
  const { t } = useSettings();
  return (
    <section aria-labelledby="signs-title" className="rounded-2xl border-4 border-danger bg-card p-3">
      <h2 id="signs-title" className="flex items-center gap-2 text-xl font-extrabold text-danger">
        <Icon name="siren" /> {t('em.signsTitle')}
      </h2>
      <ul className="my-2 grid gap-1">
        {SIGNS.map(([k, icon]) => (
          <li key={k} className="flex items-start gap-2 text-lg">
            <Icon name={icon} size={24} className="mt-1 text-danger" />
            <span>{t(`em.sign.${k}`)}</span>
          </li>
        ))}
      </ul>
      <p className="rounded-xl bg-danger p-3 text-lg font-extrabold text-ondanger">{t('em.signsGo')}</p>
      {withButton ? (
        <Link to="/emergency" className="btn btn-danger mt-3 no-underline">
          <Icon name="siren" /> <span>{t('em.button')}</span>
        </Link>
      ) : null}
    </section>
  );
}

export default function Register() {
  const { t, draft, set, assist, avoid } = useSettings();
  const nav = useNavigate();
  const [errors, setErrors] = useState({});
  const [help, setHelp] = useState(false);
  const step = Math.min(Math.max(draft.step || 1, 1), TOTAL);
  const setDraft = (patch) => set((s) => ({ draft: { ...s.draft, ...patch } }));
  const goStep = (n) => {
    setErrors({});
    setDraft({ step: n });
    window.scrollTo(0, 0);
  };

  const toggleAssist = (on) => (on ? set({ assist: true, read: true, avoid: true }) : set({ assist: false, read: false }));

  const check = () => {
    const e = {};
    if (step === 1 && !draft.name.trim()) e.name = t('reg.required');
    if (step === 2) {
      const a = Number(draft.age);
      if (draft.age === '' ) e.age = t('reg.required');
      else if (!(a >= 0 && a <= 120)) e.age = t('reg.ageBad');
    }
    if (step === 3 && !draft.gender) e.gender = t('reg.required');
    if (step === 4 && draft.mobile && draft.mobile.length !== 10) e.mobile = t('reg.mobileBad');
    if (step === 5 && !draft.dept) e.dept = t('reg.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!check()) return;
    if (step < TOTAL) return goStep(step + 1);
    const token = registerPatient({ name: draft.name, age: draft.age, gender: draft.gender, mobile: draft.mobile, dept: draft.dept });
    set({ myToken: token, draft: { step: 1, name: '', age: '', gender: '', mobile: '', dept: '' } });
    nav(`/slip/${token}`);
  };
  const prev = () => (step === 1 ? nav('/') : goStep(step - 1));

  const genders = [['male', 'user'], ['female', 'woman'], ['other', 'user']];

  return (
    <Layout>
      <div className="mb-4" role="group" aria-label={t('reg.progress')}>
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-xl font-extrabold">{t('reg.title')}</h1>
          <p className="font-bold">{t('reg.step', { n: step, total: TOTAL })}</p>
        </div>
        <div role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={step} aria-label={t('reg.progress')} className="h-4 w-full overflow-hidden rounded-full border-2 border-ink bg-soft">
          <div className="h-full bg-brand" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>

      {step === 1 ? (
        <div className="mb-4 space-y-4">
          <EmergencySigns />
        </div>
      ) : null}

      <div className="mb-4">
        <Switch checked={assist} onChange={toggleAssist} icon="users" label={t('reg.assist')} sub={assist ? t('reg.assist.on') : t('reg.assist.off')} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate className="space-y-4">
        {step === 1 ? <MicField id="f-name" label={t('reg.name.q')} hint={t('reg.name.hint')} value={draft.name} onChange={(v) => setDraft({ name: v })} error={errors.name} autoComplete="given-name" maxLength={40} /> : null}
        {step === 2 ? <MicField id="f-age" label={t('reg.age.q')} hint={t('reg.age.hint')} value={draft.age} onChange={(v) => setDraft({ age: v })} error={errors.age} inputMode="numeric" digitsOnly maxLength={3} /> : null}
        {step === 3 ? (
          <fieldset>
            <legend className="mb-2 text-xl font-bold">{t('reg.gender.q')}</legend>
            <div className="grid gap-3">
              {genders.map(([g, icon]) => {
                const on = draft.gender === g;
                return (
                  <button key={g} type="button" aria-pressed={on} onClick={() => setDraft({ gender: g })} className={`btn min-h-[64px] text-xl ${on ? 'btn-primary' : ''}`}>
                    <Icon name={on ? 'check' : icon} /> <span>{t(`reg.gender.${g}`)}</span>
                  </button>
                );
              })}
            </div>
            {errors.gender ? <p role="alert" className="mt-2 font-bold text-danger">{errors.gender}</p> : null}
          </fieldset>
        ) : null}
        {step === 4 ? (
          <>
            <MicField id="f-mobile" label={t('reg.mobile.q')} hint={t('reg.mobile.hint')} value={draft.mobile} onChange={(v) => setDraft({ mobile: v })} error={errors.mobile} inputMode="numeric" type="tel" digitsOnly maxLength={10} autoComplete="tel" />
            <p className="rounded-xl bg-soft p-3 text-base">{t('reg.never')}</p>
          </>
        ) : null}
        {step === 5 ? (
          <fieldset>
            <legend className="mb-1 text-xl font-bold">{t('reg.dept.q')}</legend>
            <p className="mb-3 text-muted">{t('reg.dept.hint')}</p>
            <div className="grid gap-3">
              {DEPARTMENTS.map((d) => {
                const on = draft.dept === d.id;
                return (
                  <button key={d.id} type="button" aria-pressed={on} onClick={() => setDraft({ dept: d.id })} className={`flex min-h-[72px] items-center gap-3 rounded-2xl border-[3px] p-3 text-start ${on ? 'border-brand bg-brand text-onbrand' : 'border-line bg-card text-ink'}`}>
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${on ? 'bg-onbrand text-brand' : 'bg-soft text-brand'}`}>
                      <Icon name={d.icon} size={34} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-extrabold leading-tight">{t(`dept.${d.id}`)}</span>
                      <span className="block text-base">{t(`dept.${d.id}.desc`)}</span>
                    </span>
                    {on ? <Icon name="check" size={32} /> : null}
                  </button>
                );
              })}
            </div>
            {errors.dept ? <p role="alert" className="mt-2 font-bold text-danger">{errors.dept}</p> : null}
            <button type="button" className="btn mt-3" aria-expanded={help} onClick={() => setHelp(!help)}>
              <Icon name="help" /> <span>{t('reg.notSure')}</span>
            </button>
            {help ? (
              <div className="mt-3 space-y-3">
                <p className="card font-bold">{t('reg.notSure.body')}</p>
                <RouteView from="entrance" to="help" avoid={avoid} />
              </div>
            ) : null}
          </fieldset>
        ) : null}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button type="button" className="btn" onClick={prev}>
            <Icon name="back" /> <span>{t('common.back')}</span>
          </button>
          <button type="submit" className="btn btn-primary">
            <span>{step === TOTAL ? t('reg.submit') : t('common.next')}</span> <Icon name={step === TOTAL ? 'ticket' : 'next'} />
          </button>
        </div>
      </form>

    </Layout>
  );
}
