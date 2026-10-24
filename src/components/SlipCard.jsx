import { useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import Icon from './Icon.jsx';
import { Listen } from './UI.jsx';
import { useSettings } from '../lib/settings.jsx';
import { CLINIC_BY_ID } from '../data/departments.js';
import { PLACE_BY_ID } from '../data/hospital.js';
import { estimateWait, peopleAhead } from '../lib/store.js';
import { spellToken } from '../lib/speech.js';

export function slipInfo(state, token, t) {
  const p = state.patients[token];
  if (!p) return null;
  const clinic = CLINIC_BY_ID[p.clinic];
  const room = PLACE_BY_ID[clinic.room];
  const ahead = peopleAhead(state, token);
  const wait = p.status === 'waiting' ? estimateWait(state, p.clinic, ahead) : 0;
  return {
    p,
    clinic,
    roomId: clinic.room,
    roomName: t(`place.${clinic.room}`),
    floorName: t(`floor.${room.floor}`),
    dept: t(`dept.${p.dept}`),
    ahead,
    wait,
    waitText: wait === 0 ? t('common.noWait') : t('common.aboutMin', { n: wait }),
  };
}

export function qrModules(text) {
  const q = qrcode(0, 'M');
  q.addData(text);
  q.make();
  const n = q.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return { n, d };
}

export function QR({ text, size = 160, label }) {
  const { n, d } = useMemo(() => qrModules(text), [text]);
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} width={size} height={size} role="img" aria-label={label} shapeRendering="crispEdges" style={{ background: '#fff', maxWidth: '100%' }}>
      <path d={d} fill="#000" />
    </svg>
  );
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Saves the slip as a PNG picture (built from SVG, no libraries).
function saveAsImage(info, url, t) {
  const { n, d } = qrModules(url);
  const rows = [
    [t('slip.name'), info.p.name],
    [t('slip.dept'), info.dept],
    [t('slip.room'), `${info.roomName}, ${info.floorName}`],
    [t('slip.doctor'), t(`doc.${info.clinic.id}`)],
  ];
  const lines = rows
    .map(([k, v], i) => `<text x="30" y="${190 + i * 50}" font-size="20" fill="#475569">${esc(k)}</text><text x="30" y="${216 + i * 50}" font-size="28" font-weight="700" fill="#000">${esc(v)}</text>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="620" viewBox="0 0 480 620" font-family="Segoe UI, Noto Sans Devanagari, Arial, sans-serif">
<rect width="480" height="620" fill="#fff"/><rect x="6" y="6" width="468" height="608" fill="none" stroke="#0b5cad" stroke-width="6" rx="16"/>
<text x="30" y="52" font-size="26" font-weight="700" fill="#0b5cad">${esc(t('app.name'))} · ${esc(t('hospital.name'))}</text>
<text x="30" y="92" font-size="20" fill="#475569">${esc(t('slip.token'))}</text>
<text x="30" y="150" font-size="64" font-weight="800" fill="#000">${esc(info.p.token)}</text>
${lines}
<g transform="translate(300,300) scale(${150 / (n + 4)}) translate(2,2)"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#000"/></g>
<text x="30" y="500" font-size="18" fill="#475569">${esc(t('slip.ahead'))}: ${info.ahead}</text>
<text x="30" y="528" font-size="18" fill="#475569">${esc(t('slip.wait'))}: ${esc(info.waitText)}</text>
<text x="30" y="590" font-size="16" fill="#475569">${esc(t('hospital.name'))}</text>
</svg>`;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1240;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 960, 1240);
    ctx.drawImage(img, 0, 0, 960, 1240);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `opd-slip-${info.p.token}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function Row({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 border-b-2 border-line/40 py-2 last:border-0">
      <Icon name={icon} className="mt-1 text-brand" />
      <div className="min-w-0 flex-1">
        <div className="text-sm text-muted">{label}</div>
        <div className="text-lg font-bold">{children}</div>
      </div>
    </div>
  );
}

export default function SlipCard({ info, actions = true }) {
  const { t } = useSettings();
  const [large, setLarge] = useState(false);
  const url = `${window.location.origin}/turn/${info.p.token}`;
  const spoken = () =>
    t('slip.speak', {
      token: spellToken(info.p.token),
      dept: info.dept,
      room: info.roomName,
      floor: info.floorName,
      doctor: t(`doc.${info.clinic.id}`),
      ahead: info.ahead,
      wait: info.waitText,
    });

  return (
    <>
      <article className="card border-4 border-brand" aria-label={t('slip.title')}>
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-brand">{t('app.name')} · {t('hospital.name')}</p>
        </div>
        <p className="mt-2 text-sm text-muted">{t('slip.token')}</p>
        <p className="font-extrabold tracking-wide [font-size:min(3rem,13vw)]" dir="ltr">{info.p.token}</p>
        {info.p.pending ? <p className="chip mt-2 text-warnink bg-warnbg">{t('slip.pending')}</p> : null}
        <div className="mt-3">
          <Row icon="user" label={t('slip.name')}>{info.p.name}</Row>
          <Row icon="stethoscope" label={t('slip.dept')}>{info.dept}</Row>
          <Row icon="door" label={t('slip.room')}>{t('slip.room.floor', { room: info.roomName, floor: info.floorName })}</Row>
          <Row icon="user" label={t('slip.doctor')}>{t(`doc.${info.clinic.id}`)}</Row>
          <Row icon="users" label={t('slip.ahead')}>{info.ahead}</Row>
          <Row icon="clock" label={t('slip.wait')}>{info.waitText}</Row>
        </div>
        <div className="mt-3 flex flex-col items-center gap-1">
          <QR text={url} label={t('slip.qr')} />
          <p className="text-center text-sm text-muted">{t('slip.qr')}</p>
        </div>
        <p className="mt-3 text-sm">{t('slip.keep')}</p>
      </article>

      {actions ? (
        <div className="no-print mt-4 grid gap-3">
          <Listen text={spoken} label={t('slip.read')} className="btn-inline w-full" />
          <button type="button" className="btn" onClick={() => saveAsImage(info, url, t)}>
            <Icon name="save" /> <span>{t('slip.save')}</span>
          </button>
          <button type="button" className="btn" onClick={() => window.print()}>
            <Icon name="print" /> <span>{t('slip.print')}</span>
          </button>
          <button type="button" className="btn" onClick={() => setLarge(true)}>
            <Icon name="text" /> <span>{t('slip.large')}</span>
          </button>
        </div>
      ) : null}

      {large ? (
        <div role="dialog" aria-modal="true" aria-label={t('slip.forStaff')} className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-auto bg-card p-4 text-center">
          <p className="text-xl text-muted">{t('slip.token')}</p>
          <p className="font-extrabold [font-size:min(4.5rem,15vw)]" dir="ltr">{info.p.token}</p>
          <p className="text-4xl font-extrabold">{info.p.name}</p>
          <p className="text-3xl font-bold">{info.dept}</p>
          <p className="text-3xl font-bold">{t('slip.room.floor', { room: info.roomName, floor: info.floorName })}</p>
          <button type="button" className="btn btn-primary max-w-sm" onClick={() => setLarge(false)}>
            <Icon name="check" /> <span>{t('common.close')}</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
