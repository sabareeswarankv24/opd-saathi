import { LANGUAGES } from '../i18n/index.js';
import { useSettings } from '../lib/settings.jsx';
import Icon from './Icon.jsx';

// Each language is shown in its own script.
export default function LanguagePicker({ onPick, compact = false }) {
  const { lang, firstVisit } = useSettings();
  return (
    <div className="grid gap-3" role="group" aria-label="Language / भाषा">
      {LANGUAGES.map((l) => {
        const active = !firstVisit && lang === l.id;
        return (
          <button
            key={l.id}
            type="button"
            lang={l.id}
            aria-pressed={active}
            onClick={() => onPick(l.id)}
            className={`btn ${compact ? '' : 'min-h-[72px] text-2xl'} ${active ? 'btn-primary' : ''}`}
          >
            <Icon name={active ? 'check' : 'globe'} />
            <span>{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}
