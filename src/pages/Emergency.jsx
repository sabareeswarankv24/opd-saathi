import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import RouteView from '../components/RouteView.jsx';
import PlaceSelect from '../components/PlaceSelect.jsx';
import { Explain, Listen } from '../components/UI.jsx';
import { EmergencySigns } from './Register.jsx';
import { useSettings } from '../lib/settings.jsx';

// Works with no registration, no token and no setup.
export default function Emergency() {
  const { t, avoid } = useSettings();
  const [from, setFrom] = useState('entrance');
  const spoken = () => `${t('em.title')}. ${t('em.go')} ${t('em.noToken')} 112. 108.`;
  return (
    <Layout>
      <section className="rounded-2xl border-4 border-danger bg-danger p-4 text-ondanger" role="alert">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold"><Icon name="siren" size={36} /> {t('em.title')}</h1>
        <p className="mt-2 text-2xl font-extrabold leading-snug">{t('em.go')}</p>
        <p className="mt-1 text-xl font-bold">{t('em.noToken')}</p>
      </section>

      <div className="mt-3"><Listen text={spoken} className="w-full" /></div>

      <section className="mt-4" aria-label={t('em.numbers')}>
        <h2 className="mb-2 text-xl font-extrabold">{t('em.numbers')}</h2>
        <div className="grid gap-3">
          <a href="tel:112" className="btn btn-danger text-xl no-underline"><Icon name="phone" /> <span>{t('em.call112')}</span></a>
          <a href="tel:108" className="btn border-danger text-xl text-danger no-underline"><Icon name="phone" /> <span>{t('em.call108')}</span></a>
        </div>
      </section>

      <Explain>{t('em.casualty')}</Explain>

      <section className="mt-4 space-y-3">
        <h2 className="text-xl font-extrabold">{t('em.way')}</h2>
        <PlaceSelect id="em-from" label={t('em.from')} value={from} onChange={setFrom} />
        <RouteView from={from} to="emergency" avoid={avoid} />
      </section>

      <div className="mt-5"><EmergencySigns withButton={false} /></div>
      <p className="mt-3 text-base text-muted">{t('em.staffOnly')}</p>
    </Layout>
  );
}
