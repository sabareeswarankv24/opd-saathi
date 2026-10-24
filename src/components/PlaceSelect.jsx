import { PLACES } from '../data/hospital.js';
import { useSettings } from '../lib/settings.jsx';

export const GROUPS = [
  { id: 'services', types: ['entrance', 'registration', 'help', 'emergency', 'pharmacy', 'lab', 'xray', 'wheelchair'] },
  { id: 'toilets', types: ['toilets', 'water'] },
  { id: 'rooms', types: ['room', 'hall'] },
  { id: 'wards', types: ['ward', 'nurses'] },
  { id: 'other', types: ['lift', 'stairs', 'ramp'] },
];

export function placesOfGroup(g) {
  return PLACES.filter((p) => g.types.includes(p.type));
}

export default function PlaceSelect({ id, label, value, onChange }) {
  const { t } = useSettings();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-lg font-bold">{label}</label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {GROUPS.map((g) => (
          <optgroup key={g.id} label={t(`find.group.${g.id === 'rooms' ? 'rooms' : g.id}`)}>
            {placesOfGroup(g).map((p) => (
              <option key={p.id} value={p.id}>{t(`place.${p.id}`)}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
