import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import MicField from '../components/MicField.jsx';
import SlipCard, { slipInfo } from '../components/SlipCard.jsx';
import { Heading } from '../components/UI.jsx';
import { DEPARTMENTS } from '../data/departments.js';
import { useSettings } from '../lib/settings.jsx';
import { registerPatient, useHospital } from '../lib/store.js';

const EMPTY = { name: '', age: '', gender: '', mobile: '', dept: '' };

export default function Counter() {
  const { t } = useSettings();
  const state = useHospital();
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = t('reg.required');
    if (f.age === '' || Number(f.age) > 120) er.age = f.age === '' ? t('reg.required') : t('reg.ageBad');
    if (!f.gender) er.gender = t('reg.required');
    if (f.mobile && f.mobile.length !== 10) er.mobile = t('reg.mobileBad');
    if (!f.dept) er.dept = t('reg.required');
    setErrors(er);
    if (Object.keys(er).length) return;
    setToken(registerPatient({ ...f, by: 'counter' }));
    setF(EMPTY);
  };

  if (token) {
    const info = slipInfo(state, token, t);
    return (
      <Layout back="/staff">
        <Heading>{t('slip.title')}</Heading>
        {info ? <SlipCard info={info} /> : null}
        <div className="no-print mt-4 grid gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setToken('')}><Icon name="register" /> <span>{t('counter.another')}</span></button>
          <Link to="/staff" className="btn no-underline"><Icon name="users" /> <span>{t('counter.back')}</span></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout back="/staff">
      <Heading sub={t('counter.sub')}>{t('counter.title')}</Heading>
      <form onSubmit={submit} noValidate className="space-y-4">
        <MicField id="c-name" label={t('counter.name')} value={f.name} onChange={(v) => set({ name: v })} error={errors.name} maxLength={40} />
        <MicField id="c-age" label={t('counter.age')} value={f.age} onChange={(v) => set({ age: v })} error={errors.age} inputMode="numeric" digitsOnly maxLength={3} />
        <fieldset>
          <legend className="mb-1 text-xl font-bold">{t('counter.gender')}</legend>
          <div className="grid gap-2 min-[480px]:grid-cols-3">
            {['male', 'female', 'other'].map((g) => (
              <button key={g} type="button" aria-pressed={f.gender === g} onClick={() => set({ gender: g })} className={`btn px-1 ${f.gender === g ? 'btn-primary' : ''}`}>
                {f.gender === g ? <Icon name="check" size={22} /> : null}<span>{t(`reg.gender.${g}`)}</span>
              </button>
            ))}
          </div>
          {errors.gender ? <p role="alert" className="mt-1 font-bold text-danger">{errors.gender}</p> : null}
        </fieldset>
        <MicField id="c-mobile" label={t('counter.mobile')} value={f.mobile} onChange={(v) => set({ mobile: v })} error={errors.mobile} inputMode="numeric" type="tel" digitsOnly maxLength={10} />
        <fieldset>
          <legend className="mb-1 text-xl font-bold">{t('counter.dept')}</legend>
          <div className="grid gap-2">
            {DEPARTMENTS.map((d) => (
              <button key={d.id} type="button" aria-pressed={f.dept === d.id} onClick={() => set({ dept: d.id })} className={`btn justify-start text-start ${f.dept === d.id ? 'btn-primary' : ''}`}>
                <Icon name={f.dept === d.id ? 'check' : d.icon} /> <span>{t(`dept.${d.id}`)}</span>
              </button>
            ))}
          </div>
          {errors.dept ? <p role="alert" className="mt-1 font-bold text-danger">{errors.dept}</p> : null}
        </fieldset>
        <button type="submit" className="btn btn-primary"><Icon name="ticket" /> <span>{t('counter.register')}</span></button>
      </form>
    </Layout>
  );
}
