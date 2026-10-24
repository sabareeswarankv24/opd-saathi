// Checks the hospital graph: every place can reach every other place, with and without stairs
// (except stairs places from another floor when stairs are avoided), and "avoid stairs" routes never use stairs.
import { PLACES, EDGES } from '../src/data/hospital.js';
import { findRoute, edgeBetween } from '../src/lib/route.js';

let bad = 0;
const stairPlaces = new Set(PLACES.filter((p) => p.type === 'stairs').map((p) => p.id));
let count = 0;
for (const a of PLACES) {
  for (const b of PLACES) {
    if (a.id === b.id) continue;
    const r = findRoute(a.id, b.id, false);
    if (!r) { console.log('NO ROUTE', a.id, b.id); bad++; continue; }
    for (let i = 0; i < r.path.length - 1; i++) if (!edgeBetween(r.path[i], r.path[i + 1])) { console.log('MISSING EDGE', r.path[i], r.path[i + 1]); bad++; }
    const s = findRoute(a.id, b.id, true);
    const stairTarget = stairPlaces.has(a.id) || stairPlaces.has(b.id);
    if (!s) {
      if (!(stairTarget && a.floor !== b.floor)) { console.log('NO STEP-FREE ROUTE', a.id, b.id); bad++; }
      continue;
    }
    count++;
    for (let i = 0; i < s.path.length - 1; i++) {
      if (edgeBetween(s.path[i], s.path[i + 1]).stairs) { console.log('STAIRS USED', a.id, b.id); bad++; }
    }
  }
}
// every floor pair connected by a lift
const lifts = PLACES.filter((p) => p.type === 'lift').map((p) => p.floor).sort();
if (lifts.join() !== '0,1,2') { console.log('Lift does not serve all floors'); bad++; }
console.log(`${PLACES.length} places, ${EDGES.length} paths, ${count} step-free pairs checked. Problems: ${bad}`);
const show = (x, y, av) => { const r = findRoute(x, y, av); console.log(`${x} -> ${y} (avoid stairs: ${av}):`, r ? r.path.join(' > ') + ` ${r.metres}m` : 'none'); };
show('entrance', 'r3', false); show('entrance', 'r3', true); show('entrance', 'ward4', true); show('r8', 'pharmacy', true);
show('help', 'ward6', false); show('toilets_g', 'r1', false); show('nurses', 'emergency', true);
process.exit(bad ? 1 : 0);
