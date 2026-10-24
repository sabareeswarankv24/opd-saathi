// Checks that en.js and hi.js have the same keys, and that every t('key') used in src exists.
import fs from 'node:fs';
import path from 'node:path';
import en from '../src/i18n/en.js';
import hi from '../src/i18n/hi.js';

let bad = 0;
const ek = Object.keys(en), hk = Object.keys(hi);
for (const k of ek) if (!(k in hi)) { console.log('missing in hi:', k); bad++; }
for (const k of hk) if (!(k in en)) { console.log('missing in en:', k); bad++; }
for (const k of ek) if (hi[k] === en[k] && !/^(lang|app|place\.short\.xray)/.test(k) && /[A-Za-z]{4,}/.test(en[k]) && !['common.min'].includes(k)) console.log('same text in hi (check):', k);
// placeholders must match
for (const k of ek) {
  const a = (en[k].match(/\{\w+\}/g) || []).sort().join(), b = ((hi[k] || '').match(/\{\w+\}/g) || []).sort().join();
  if (a !== b) { console.log('placeholder mismatch:', k, a, '|', b); bad++; }
}
function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]); }
const used = new Set();
for (const f of walk('src').filter((f) => /\.(jsx?|js)$/.test(f))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\bt\(\s*'([\w.]+)'/g)) used.add(m[1]);
  for (const m of s.matchAll(/t\(\s*`([\w.$\{\}\-]+)`/g)) used.add('TPL:' + m[1]);
}
for (const k of used) if (!k.startsWith('TPL:') && !(k in en)) { console.log('used but not defined:', k); bad++; }
console.log([...used].filter((k) => k.startsWith('TPL:')).join(' '));
console.log(`en ${ek.length} keys, hi ${hk.length} keys. Problems: ${bad}`);
process.exit(bad ? 1 : 0);
