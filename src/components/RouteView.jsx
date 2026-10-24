import { useMemo } from 'react';
import FloorPlan from './FloorPlan.jsx';
import Icon from './Icon.jsx';
import { Listen } from './UI.jsx';
import { useSettings } from '../lib/settings.jsx';
import { buildSteps, findRoute, floorsOnPath, walkMinutes } from '../lib/route.js';
import { canSpeak, speakNow } from '../lib/speech.js';
import { PLACE_BY_ID } from '../data/hospital.js';

// Floor plan(s) with the route drawn, then step-by-step directions. Used by every "show me the way" screen.
export default function RouteView({ from, to, avoid }) {
  const { t, lang } = useSettings();
  const route = useMemo(() => (from && to ? findRoute(from, to, avoid) : null), [from, to, avoid]);

  if (!to) return null;
  if (from === to) return <p className="card font-bold">{t('find.same')}</p>;
  if (!route) {
    return (
      <p role="alert" className="card border-danger font-bold">
        <Icon name="warn" className="mr-2 inline" /> {t('find.noRoute')}
      </p>
    );
  }
  const steps = buildSteps(route.path, t);
  const floors = floorsOnPath(route.path);
  const all = steps.map((s, i) => `${i + 1}. ${s.text}`).join(' ');
  return (
    <section aria-label={t('find.steps')} className="space-y-4">
      <div className="card flex flex-wrap items-center gap-3">
        <Icon name="walk" />
        <p className="flex-1 font-bold">{t('find.total', { m: route.metres, n: walkMinutes(route.metres) })}</p>
        <Listen text={() => all} label={t('find.listenAll')} />
      </div>
      <div className="space-y-4">
        {floors.map((f) => (
          <FloorPlan key={f} floor={f} path={route.path} />
        ))}
        <p className="text-sm text-muted">{t('find.legend.route')}</p>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-extrabold">{t('find.steps')}</h2>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="card flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-extrabold text-onbrand" aria-hidden="true">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-start gap-2 text-lg">
                  <Icon name={s.icon} className="mt-1" />
                  <span>{s.text}</span>
                </p>
                {canSpeak ? <button type="button" className="btn btn-sm btn-inline mt-2" onClick={() => speakNow(s.text, lang)} aria-label={`${t('find.listenStep')} ${i + 1}`}>
                  <Icon name="speaker" /> <span>{t('find.listenStep')}</span>
                </button> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function placeName(t, id) {
  return PLACE_BY_ID[id] ? t(`place.${id}`) : id;
}
