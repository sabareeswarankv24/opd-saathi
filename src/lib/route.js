import { EDGES, PLACE_BY_ID, SLOW_WALK_M_PER_MIN } from '../data/hospital.js';

function adjacency(avoidStairs) {
  const adj = {};
  for (const e of EDGES) {
    if (avoidStairs && e.stairs) continue; // stair paths are removed BEFORE the route is worked out
    (adj[e.a] ||= []).push({ to: e.b, m: e.m, e });
    (adj[e.b] ||= []).push({ to: e.a, m: e.m, e });
  }
  return adj;
}

export function edgeBetween(a, b) {
  return EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
}

// Dijkstra's shortest path over the hospital graph. Returns { path, metres } or null.
export function findRoute(from, to, avoidStairs = false) {
  if (!PLACE_BY_ID[from] || !PLACE_BY_ID[to]) return null;
  if (from === to) return { path: [from], metres: 0 };
  const adj = adjacency(avoidStairs);
  const dist = { [from]: 0 };
  const prev = {};
  const done = new Set();
  const nodes = new Set([from]);
  while (nodes.size) {
    let u = null;
    for (const n of nodes) if (u === null || dist[n] < dist[u]) u = n;
    nodes.delete(u);
    if (done.has(u)) continue;
    done.add(u);
    if (u === to) break;
    for (const { to: v, m } of adj[u] || []) {
      const nd = dist[u] + m;
      if (dist[v] === undefined || nd < dist[v]) {
        dist[v] = nd;
        prev[v] = u;
        nodes.add(v);
      }
    }
  }
  if (dist[to] === undefined) return null;
  const path = [to];
  while (path[0] !== from) path.unshift(prev[path[0]]);
  return { path, metres: dist[to] };
}

export function walkMinutes(metres) {
  return Math.max(1, Math.ceil(metres / SLOW_WALK_M_PER_MIN));
}

export function floorsOnPath(path) {
  const out = [];
  for (const id of path) {
    const f = PLACE_BY_ID[id].floor;
    if (!out.includes(f)) out.push(f);
  }
  return out;
}

// Turn a path into plain steps. t = translate function. Every phrase comes from the translation files.
export function buildSteps(path, t) {
  const steps = [];
  const P = (id) => PLACE_BY_ID[id];
  const name = (id) => t(`place.${id}`);
  const lm = (id) => t(`lm.${id}`);
  if (!path || path.length === 0) return steps;
  steps.push({ icon: 'pin', floor: P(path[0]).floor, text: t('dir.start', { place: name(path[0]), landmark: lm(path[0]) }) });
  let heading = null;
  let i = 0;
  while (i < path.length - 1) {
    const e = edgeBetween(path[i], path[i + 1]);
    if (e.kind === 'lift' || e.kind === 'stairs') {
      let j = i + 1;
      while (j < path.length - 1 && edgeBetween(path[j], path[j + 1]).kind === e.kind) j++;
      const f = P(path[j]).floor;
      steps.push({
        icon: e.kind,
        floor: f,
        text: t(e.kind === 'lift' ? 'dir.lift' : 'dir.stairs', { floor: t(`floor.${f}`), place: name(path[j]), landmark: lm(path[j]) }),
      });
      heading = null;
      i = j;
      continue;
    }
    const a = P(path[i]);
    const b = P(path[i + 1]);
    const v = { x: b.x - a.x, y: b.y - a.y };
    let turn = '';
    if (heading) {
      const cross = heading.x * v.y - heading.y * v.x;
      const dot = heading.x * v.x + heading.y * v.y;
      const ang = (Math.atan2(cross, dot) * 180) / Math.PI;
      if (Math.abs(ang) > 150) turn = t('dir.turnaround') + ' ';
      else if (ang > 35) turn = t('dir.right') + ' ';
      else if (ang < -35) turn = t('dir.left') + ' ';
    }
    heading = v;
    const key = e.kind === 'ramp' ? 'dir.ramp' : e.kind === 'steps' ? 'dir.steps' : 'dir.walk';
    steps.push({
      icon: e.kind === 'ramp' ? 'ramp' : 'walk',
      floor: a.floor,
      text: turn + t(key, { m: e.m, place: name(path[i + 1]), landmark: lm(path[i + 1]) }),
    });
    i++;
  }
  const last = path[path.length - 1];
  steps.push({ icon: 'flag', floor: P(last).floor, text: t('dir.arrive', { place: name(last), landmark: lm(last) }) });
  return steps;
}
