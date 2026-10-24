// Inline SVG icons (no image downloads). All are decorative: the word next to them carries the meaning.
const P = {
  register: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z" /><path d="M14 6v12" strokeDasharray="2 2" /></>,
  pin: <><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></>,
  siren: <><path d="M5 19v-6a7 7 0 0 1 14 0v6z" /><path d="M3 21h18M12 3v2M4 6l1.5 1.5M20 6l-1.5 1.5" /></>,
  cross: <><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
  speaker: <><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></>,
  home: <><path d="M3 11l9-8 9 8M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></>,
  back: <><path d="M15 5l-7 7 7 7" /></>,
  next: <><path d="M9 5l7 7-7 7" /></>,
  stairs: <><path d="M3 20h5v-4h5v-4h5V8h3" /></>,
  lift: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 10l3-3 3 3M9 14l3 3 3-3" /></>,
  ramp: <><path d="M3 19h18L3 19zM3 19l14-9v9" /></>,
  walk: <><circle cx="12" cy="5" r="2" /><path d="M12 8v6l-3 6M12 14l3 6M8 11l4-2 4 3" /></>,
  flag: <><path d="M6 21V4M6 5h11l-2 4 2 4H6" /></>,
  water: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></>,
  toilets: <><circle cx="8" cy="5" r="2" /><circle cx="16" cy="5" r="2" /><path d="M8 8v6M5 9l3-1 3 1v5M16 8v6M13 21l3-7 3 7z" /></>,
  pharmacy: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 7v10M7 12h10" /></>,
  lab: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M8 15h8" /></>,
  xray: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M12 8v8M9 9h6M9.5 12h5M10 15h4" /></>,
  wheelchair: <><circle cx="10" cy="4" r="2" /><path d="M10 7v7h6l3 6M10 10h5M7 12a5 5 0 1 0 7 7" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01" /></>,
  door: <><path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16" /><circle cx="15" cy="12" r=".8" /></>,
  bed: <><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.6" /></>,
  nurse: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0M12 14v4M10 16h4" /></>,
  entrance: <><path d="M4 21V5l8-2v18M12 21h8V9l-8 2M15 14v.01" /></>,
  hall: <><path d="M4 18v-5h16v5M6 13V8h12v5M4 21v-3M20 21v-3" /></>,
  registration: <><rect x="4" y="9" width="16" height="9" rx="1" /><path d="M7 9V6h10v3M8 13h8" /></>,
  stethoscope: <><path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v2a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></>,
  child: <><circle cx="12" cy="6" r="3" /><path d="M7 21v-5a5 5 0 0 1 10 0v5M9 12l-3 2M15 12l3 2" /></>,
  woman: <><circle cx="12" cy="5" r="2.5" /><path d="M8 21l2-8-3-1 2-4h6l2 4-3 1 2 8" /><circle cx="12" cy="15" r="1.5" /></>,
  bone: <><path d="M7 7a2.5 2.5 0 1 1 3.5-3L20 13.5a2.5 2.5 0 1 1-3 3.5L7.5 7.5" /></>,
  ear: <><path d="M7 10a5 5 0 0 1 10 0c0 3-3 3-3 6a3 3 0 0 1-6 0" /><path d="M10 10a2 2 0 0 1 4 0" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  hand: <><path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.5 1.5 0 0 1 2.2-2L8 14" /></>,
  phone: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>,
  print: <><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" /></>,
  save: <><path d="M12 3v12M7 11l5 5 5-5M4 20h16" /></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>,
  bell: <><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <><path d="M5 12l5 5 9-10" /></>,
  warn: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
  text: <><path d="M4 7V5h16v2M12 5v14M9 19h6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  contrast: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" /></>,
  install: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M12 7v7M9 11l3 3 3-3" /></>,
  tv: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  list: <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a6 6 0 0 1 3 6" /></>,
  skip: <><path d="M5 5l9 7-9 7zM17 5v14" /></>,
  swap: <><path d="M7 4l-4 4 4 4M3 8h14M17 20l4-4-4-4M21 16H7" /></>,
  ban: <><circle cx="12" cy="12" r="9" /><path d="M5.5 5.5l13 13" /></>,
  play: <><path d="M7 4l13 8-13 8z" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" /></>,
  heart: <><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" /></>,
};

export default function Icon({ name, size = 28, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      {P[name] || P.help}
    </svg>
  );
}

// Which icon to use for a place type.
export const PLACE_ICON = {
  entrance: 'entrance', ramp: 'ramp', registration: 'registration', help: 'help', wheelchair: 'wheelchair',
  water: 'water', toilets: 'toilets', stairs: 'stairs', lift: 'lift', pharmacy: 'pharmacy', lab: 'lab',
  xray: 'xray', emergency: 'cross', room: 'door', hall: 'hall', ward: 'bed', nurses: 'nurse',
};

export const iconPaths = (n) => P[n] || P.help;
