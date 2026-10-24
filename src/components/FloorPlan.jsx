import { PLACES, EDGES, PLACE_BY_ID, PLAN } from '../data/hospital.js';
import { iconPaths, PLACE_ICON } from './Icon.jsx';
import { useSettings } from '../lib/settings.jsx';

// Draws one floor as inline SVG. `path` is a list of place ids; the part on this floor is drawn as a dashed line.
export default function FloorPlan({ floor, path = [], highlight = '' }) {
  const { t } = useSettings();
  const places = PLACES.filter((p) => p.floor === floor);
  const corridors = EDGES.filter((e) => PLACE_BY_ID[e.a].floor === floor && PLACE_BY_ID[e.b].floor === floor);
  const onPath = new Set(path);
  const segs = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = PLACE_BY_ID[path[i]];
    const b = PLACE_BY_ID[path[i + 1]];
    if (a.floor === floor && b.floor === floor) segs.push([a, b]);
  }
  const start = path.length ? path[0] : '';
  const end = path.length ? path[path.length - 1] : highlight;
  const label = (p) => {
    const short = t(`place.short.${p.id}`);
    if (short !== `place.short.${p.id}`) return short;
    if (p.type === 'stairs') return t('place.short.stairs');
    if (p.type === 'lift') return t('place.short.lift');
    return t(`place.${p.id}`);
  };
  const alt = `${t('find.floor.plan', { floor: t(`floorTitle.${floor}`) })}. ${path.length ? t(`place.${start}`) + ' → ' + t(`place.${end}`) : ''}`;

  return (
    <figure className="m-0">
      <figcaption className="mb-1 text-lg font-bold">{t('find.floor.plan', { floor: t(`floorTitle.${floor}`) })}</figcaption>
      <svg viewBox={`0 0 ${PLAN.w} ${PLAN.h}`} role="img" aria-label={alt} className="w-full rounded-xl border-2 border-line bg-soft" style={{ maxHeight: '70vh' }}>
        {corridors.map((e, i) => {
          const a = PLACE_BY_ID[e.a];
          const b = PLACE_BY_ID[e.b];
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--line)" strokeOpacity="0.45" strokeWidth="12" strokeLinecap="round" />;
        })}
        {segs.map(([a, b], i) => (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--card)" strokeWidth="9" strokeLinecap="round" />
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--brand)" strokeWidth="5" strokeLinecap="round" strokeDasharray="9 7" />
          </g>
        ))}
        {places.map((p) => {
          const isRoute = onPath.has(p.id) || p.id === highlight;
          const isStart = p.id === start && path.length > 1;
          const isEnd = p.id === end && (path.length > 0 || highlight);
          const r = isRoute ? 14 : 11;
          return (
            <g key={p.id}>
              {isEnd ? <rect x={p.x - 19} y={p.y - 19} width="38" height="38" rx="6" transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="var(--danger)" strokeWidth="4" /> : null}
              <circle cx={p.x} cy={p.y} r={r} fill={isRoute ? 'var(--brand)' : 'var(--card)'} stroke="var(--ink)" strokeWidth={isRoute ? 3 : 2} />
              <svg x={p.x - r * 0.65} y={p.y - r * 0.65} width={r * 1.3} height={r * 1.3} viewBox="0 0 24 24" fill="none" stroke={isRoute ? 'var(--onbrand)' : 'var(--ink)'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                {iconPaths(PLACE_ICON[p.type])}
              </svg>
              <text x={p.x} y={p.y + r + 12} textAnchor="middle" fontSize={isRoute ? 12.5 : 10.5} fontWeight={isRoute ? 800 : 600} fill="var(--ink)" stroke="var(--page)" strokeWidth="3" paintOrder="stroke">
                {label(p)}
              </text>
              {isStart ? (
                <text x={p.x} y={p.y - r - 6} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--ink)" stroke="var(--page)" strokeWidth="3" paintOrder="stroke">
                  ▶ {t('find.start')}
                </text>
              ) : null}
              {isEnd ? (
                <text x={p.x} y={p.y - r - 8} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--danger)" stroke="var(--page)" strokeWidth="3" paintOrder="stroke">
                  ⚑ {t('find.end')}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
