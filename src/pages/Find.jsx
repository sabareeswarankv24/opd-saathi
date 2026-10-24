import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon, { PLACE_ICON } from '../components/Icon.jsx';
import RouteView from '../components/RouteView.jsx';
import PlaceSelect, { GROUPS, placesOfGroup } from '../components/PlaceSelect.jsx';
import FloorPlan from '../components/FloorPlan.jsx';
import { Heading, Switch } from '../components/UI.jsx';
import { PLACE_BY_ID } from '../data/hospital.js';
import { CLINICS } from '../data/departments.js';
import { useSettings } from '../lib/settings.jsx';

const GROUP_TITLE = { services: 'find.group.services', toilets: 'find.group.toilets', rooms: 'find.group.rooms', wards: 'find.group.wards', other: 'find.group.other' };

export default function Find() {
  const { t, lang, avoid, set } = useSettings();
  const [sp, setSp] = useSearchParams();
  const to = PLACE_BY_ID[sp.get('to')] ? sp.get('to') : '';
  const from = PLACE_BY_ID[sp.get('from')] ? sp.get('from') : 'entrance';
  const [q, setQ] = useState('');
  const [lost, setLost] = useState(null); // { dest } when "I'm lost" was pressed
  const [floor, setFloor] = useState(0);

  const go = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setSp(next, { replace: true });
  };

  const roomDept = (id) => {
    const c = CLINICS.find((x) => x.room === id);
    return c ? t(`dept.${c.dept}`) : '';
  };
  const label = (p) => (p.type === 'room' ? `${t(`place.${p.id}`)} · ${roomDept(p.id)}` : t(`place.${p.id}`));

  const norm = (s) => s.toLowerCase();
  const matches = useMemo(() => {
    const needle = norm(q.trim());
    if (!needle) return null;
    return GROUPS.flatMap((g) => placesOfGroup(g)).filter((p) => norm(label(p)).includes(needle) || norm(t(`place.${p.id}`)).includes(needle));
  }, [q, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (id) => {
    setLost(null);
    go({ to: id });
    window.scrollTo({ top: 0 });
  };

  const imLost = () => {
    setLost({ dest: to });
    window.scrollTo({ top: 0 });
  };

  const PlaceButton = ({ p }) => (
    <button type="button" aria-pressed={to === p.id} onClick={() => pick(p.id)} className={`btn justify-start text-start ${to === p.id ? 'btn-primary' : ''}`}>
      <Icon name={PLACE_ICON[p.type]} /> <span className="min-w-0 flex-1">{label(p)}</span>
    </button>
  );

  return (
    <Layout wide>
      <div className="mx-auto max-w-xl">
        <Heading>{t('find.title')}</Heading>

        <div className="space-y-3">
          <PlaceSelect id="from" label={t('find.from')} value={from} onChange={(v) => go({ from: v })} />
          <Switch checked={avoid} onChange={(v) => set({ avoid: v })} icon="lift" label={t('find.avoid')} sub={t('find.avoid.sub')} />
          <button type="button" className="btn btn-danger" onClick={imLost}>
            <Icon name="help" /> <span>{t('find.lost')}</span>
          </button>
        </div>

        {lost ? (
          <section className="mt-4 space-y-3" aria-label={t('find.lost')}>
            <div className="rounded-2xl border-4 border-ink bg-card p-4 text-center" role="region" aria-label={t('find.lost.title')}>
              <p className="text-lg font-bold text-muted">{t('find.lost.title')}</p>
              <p className="mt-2 text-3xl font-extrabold" lang={lang}>{t('find.lost.body')}</p>
              <p className="mt-1 text-4xl font-extrabold text-brand" lang={lang}>{lost.dest ? t(`place.${lost.dest}`) : t('place.help')}</p>
              <hr className="my-3 border-line" />
              <p className="text-3xl font-extrabold" lang="en">{enTable['find.lost.body']}</p>
              <p className="mt-1 text-4xl font-extrabold text-brand" lang="en">{lost.dest ? en(lost.dest) : en('help')}</p>
            </div>
            <h2 className="text-xl font-extrabold">{t('find.lost.way')}</h2>
            <RouteView from={from} to="help" avoid={avoid} />
            <button type="button" className="btn" onClick={() => setLost(null)}><Icon name="close" /> <span>{t('common.close')}</span></button>
          </section>
        ) : null}

        {!lost ? (
          <>
            <div className="mt-4">
              <label htmlFor="search" className="mb-1 block text-lg font-bold">{t('find.search')}</label>
              <div className="relative">
                <input id="search" type="search" className="field" placeholder={t('find.search.ph')} value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>

            {to ? (
              <div className="mt-4 rounded-2xl border-2 border-brand bg-soft p-3">
                <p className="text-sm text-muted">{t('find.to')}</p>
                <p className="flex items-center gap-2 text-xl font-extrabold"><Icon name={PLACE_ICON[PLACE_BY_ID[to].type]} /> {label(PLACE_BY_ID[to])}</p>
                <button type="button" className="btn btn-sm mt-2" onClick={() => go({ to: '' })}><Icon name="swap" /> <span>{t('find.change')}</span></button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {!lost ? (
        <div className="mx-auto mt-4 max-w-xl">
          {to ? (
            <RouteView from={from} to={to} avoid={avoid} />
          ) : (
            <>
              {matches ? (
                matches.length ? (
                  <div className="grid gap-2">{matches.map((p) => <PlaceButton key={p.id} p={p} />)}</div>
                ) : (
                  <p className="card font-bold">{t('find.none')}</p>
                )
              ) : (
                <div className="space-y-5">
                  <h2 className="text-xl font-extrabold">{t('find.choose')}</h2>
                  {GROUPS.map((g) => (
                    <div key={g.id}>
                      <h3 className="mb-2 text-lg font-bold text-muted">{t(GROUP_TITLE[g.id])}</h3>
                      <div className="grid gap-2">{placesOfGroup(g).map((p) => <PlaceButton key={p.id} p={p} />)}</div>
                    </div>
                  ))}
                  <div>
                    <div className="mb-2 grid grid-cols-3 gap-2" role="group" aria-label={t('find.map')}>
                      {[0, 1, 2].map((f) => (
                        <button key={f} type="button" aria-pressed={floor === f} onClick={() => setFloor(f)} className={`btn btn-sm px-1 ${floor === f ? 'btn-primary' : ''}`}>{t(`floorTitle.${f}`)}</button>
                      ))}
                    </div>
                    <FloorPlan floor={floor} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : null}
    </Layout>
  );
}

import enTable from '../i18n/en.js';
function en(id) {
  return enTable[`place.${id}`] || id;
}
