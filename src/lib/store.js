// Shared hospital state: queues, tokens, flags, doctor status.
// Saved in localStorage and shared between open tabs with BroadcastChannel.
// Every change reads the newest saved state first, changes only its part, then saves and tells other tabs.
import { useSyncExternalStore } from 'react';
import { CLINICS, CLINIC_BY_ID, DEPARTMENTS, DEPT_BY_ID } from '../data/departments.js';
import { SAMPLE_PEOPLE, SEED_QUEUES, START_COUNTERS } from '../data/patients.js';

import { io } from 'socket.io-client';

const KEY = 'opd.state.v1';
const CHANNEL = 'opd-saathi-sync';
const VERSION = 1;

let socket = null;
try {
  if (typeof window !== 'undefined') {
    // Connect to local sync server if running on port 3001
    const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;
    socket = io(serverUrl, { timeout: 3000, reconnectionAttempts: 5 });
  }
} catch {
  socket = null;
}

let channel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') channel = new BroadcastChannel(CHANNEL);
} catch {
  channel = null;
}

const listeners = new Set();
let cache = null;

// ---------- clock (demo clock, can run 10x) ----------
function startOfDemoDay() {
  const d = new Date();
  d.setHours(9, 30, 0, 0);
  return d.getTime();
}
export function simNow(state) {
  const c = state.clock;
  return c.simBase + (Date.now() - c.realBase) * c.scale;
}
export function formatClock(ms) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ---------- initial state ----------
function makeToken(state, code) {
  state.counters[code] = (state.counters[code] || 0) + 1;
  return `${code}-${String(state.counters[code]).padStart(3, '0')}`;
}

function addPatient(state, p) {
  const clinic = CLINIC_BY_ID[p.clinic];
  const code = DEPT_BY_ID[clinic.dept].code;
  const token = makeToken(state, code);
  const now = simNow(state);
  state.patients[token] = {
    token,
    name: p.name,
    age: p.age,
    gender: p.gender,
    mobile: p.mobile || '',
    dept: clinic.dept,
    clinic: p.clinic,
    status: 'waiting', // waiting | called | done | noshow
    createdAt: p.createdAt || now,
    calledAt: null,
    by: p.by || 'self',
    moved: null,
  };
  state.clinics[p.clinic].queue.push(token);
  return token;
}

function initialState() {
  const base = startOfDemoDay();
  const state = {
    v: VERSION,
    rev: 1,
    updatedAt: Date.now(),
    clock: { realBase: Date.now(), simBase: base, scale: 1 },
    counters: { ...START_COUNTERS },
    clinics: {},
    patients: {},
    flags: [],
    calls: [],
    seq: 1,
  };
  for (const c of CLINICS) {
    state.clinics[c.id] = { queue: [], serving: null, durations: [], doctor: { kind: 'in', until: 0, lateMin: 0 } };
  }
  let i = 0;
  for (const c of CLINICS) {
    const n = SEED_QUEUES[c.id] || 0;
    for (let k = 0; k < n; k++) {
      const person = SAMPLE_PEOPLE[i % SAMPLE_PEOPLE.length];
      i++;
      addPatient(state, { ...person, clinic: c.id, by: 'sample', createdAt: base - (n - k) * 4 * 60000 });
    }
  }
  return state;
}

function valid(s) {
  return s && s.v === VERSION && s.clinics && s.patients && Array.isArray(s.flags) && Array.isArray(s.calls) && s.clock && s.counters;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (valid(s) && CLINICS.every((c) => s.clinics[c.id])) return s;
    }
  } catch {
    /* fall through and rebuild */
  }
  const s = initialState();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage may be full or blocked; keep working in memory */
  }
  return s;
}

function notify() {
  listeners.forEach((l) => l());
}

function reload() {
  cache = read();
  notify();
}

if (typeof window !== 'undefined') {
  if (channel) channel.onmessage = () => reload();
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) reload();
  });
  if (socket) {
    socket.on('state:sync', (remoteState) => {
      if (remoteState && remoteState.rev > (cache?.rev || 0)) {
        cache = remoteState;
        try {
          localStorage.setItem(KEY, JSON.stringify(remoteState));
        } catch {}
        notify();
      }
    });
  }
}

export function getState() {
  if (!cache) cache = read();
  return cache;
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useHospital() {
  return useSyncExternalStore(subscribe, getState, getState);
}

function update(mutator) {
  const s = read(); // always start from the newest saved state
  mutator(s);
  s.rev = (s.rev || 0) + 1;
  s.updatedAt = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  cache = s;
  if (channel) channel.postMessage({ rev: s.rev });
  if (socket && socket.connected) {
    socket.emit('state:update', { state: s, isStaffAction: false });
  }
  notify();
  return s;
}

// ---------- reading helpers ----------
export function doctorStatus(state, clinicId) {
  const d = state.clinics[clinicId].doctor;
  const now = simNow(state);
  if (d.kind === 'break' && d.until > now) return { kind: 'break', until: d.until, lateMin: 0 };
  if (d.kind === 'late' && d.lateMin > 0) return { kind: 'late', until: 0, lateMin: d.lateMin };
  return { kind: 'in', until: 0, lateMin: 0 };
}

export function averageMinutes(state, clinicId) {
  const d = state.clinics[clinicId].durations.slice(-10);
  if (!d.length) return CLINIC_BY_ID[clinicId].avgMin;
  return d.reduce((a, b) => a + b, 0) / d.length;
}

export function delayMinutes(state, clinicId) {
  const s = doctorStatus(state, clinicId);
  if (s.kind === 'late') return s.lateMin;
  if (s.kind === 'break') return Math.ceil((s.until - simNow(state)) / 60000);
  return 0;
}

// Estimated wait = people ahead x average of the last 10 consultations + the doctor's delay, rounded to 5 minutes.
export function estimateWait(state, clinicId, ahead) {
  const raw = ahead * averageMinutes(state, clinicId) + delayMinutes(state, clinicId);
  let r = Math.round(raw / 5) * 5;
  if (r === 0 && raw > 0) r = 5;
  return r;
}

export function peopleAhead(state, token) {
  const p = state.patients[token];
  if (!p || p.status !== 'waiting') return 0;
  return Math.max(0, state.clinics[p.clinic].queue.indexOf(token));
}

export function crowdLevel(state, clinicId) {
  const n = state.clinics[clinicId].queue.length;
  const seats = CLINIC_BY_ID[clinicId].seats;
  const ratio = n / seats;
  return { n, seats, level: ratio >= 1 ? 'full' : ratio >= 0.6 ? 'busy' : 'calm' };
}

export function normalizeToken(text) {
  const m = String(text || '').toUpperCase().replace(/\s+/g, '').match(/([A-Z]{3})-?(\d{1,4})/);
  if (!m) return '';
  return `${m[1]}-${m[2].padStart(3, '0')}`;
}

// ---------- actions ----------
function bestClinic(state, dept) {
  const ids = DEPT_BY_ID[dept].clinics;
  let best = ids[0];
  let bestScore = Infinity;
  for (const id of ids) {
    const score = estimateWait(state, id, state.clinics[id].queue.length);
    if (score < bestScore) {
      bestScore = score;
      best = id;
    }
  }
  return best;
}

export function registerPatient({ name, age, gender, mobile, dept, by = 'self' }) {
  let token = '';
  update((s) => {
    token = addPatient(s, { name: name.trim(), age: Number(age), gender, mobile, clinic: bestClinic(s, dept), by });
  });
  return token;
}

export function callNext(clinicId) {
  let called = '';
  update((s) => {
    const c = s.clinics[clinicId];
    const now = simNow(s);
    if (c.serving && s.patients[c.serving]) {
      const p = s.patients[c.serving];
      p.status = 'done';
      const mins = Math.min(45, Math.max(3, (now - (p.calledAt || now)) / 60000));
      c.durations.push(Math.round(mins * 10) / 10);
      c.durations = c.durations.slice(-10);
    }
    c.serving = null;
    const next = c.queue.shift();
    if (next && s.patients[next]) {
      s.patients[next].status = 'called';
      s.patients[next].calledAt = now;
      c.serving = next;
      called = next;
      s.calls.push({ id: s.seq++, token: next, clinic: clinicId, at: Date.now() });
      s.calls = s.calls.slice(-40);
    }
  });
  return called;
}

export function markNoShow(clinicId) {
  update((s) => {
    const c = s.clinics[clinicId];
    if (c.serving && s.patients[c.serving]) s.patients[c.serving].status = 'noshow';
    c.serving = null;
  });
}

function detach(s, token) {
  const p = s.patients[token];
  const c = s.clinics[p.clinic];
  c.queue = c.queue.filter((t) => t !== token);
  if (c.serving === token) c.serving = null;
}

export function sendToEnd(token) {
  update((s) => {
    const p = s.patients[token];
    if (!p || (p.status !== 'waiting' && p.status !== 'called')) return;
    detach(s, token);
    p.status = 'waiting';
    s.clinics[p.clinic].queue.push(token);
  });
}

export function moveToClinic(token, clinicId) {
  update((s) => {
    const p = s.patients[token];
    if (!p || (p.status !== 'waiting' && p.status !== 'called') || !s.clinics[clinicId]) return;
    detach(s, token);
    p.moved = { from: p.clinic, at: Date.now() };
    p.clinic = clinicId;
    p.dept = CLINIC_BY_ID[clinicId].dept;
    p.status = 'waiting';
    s.clinics[clinicId].queue.push(token);
  });
}

export function setDoctor(clinicId, kind, minutes = 0) {
  update((s) => {
    const c = s.clinics[clinicId];
    if (kind === 'break') c.doctor = { kind: 'break', until: simNow(s) + minutes * 60000, lateMin: 0 };
    else if (kind === 'late') c.doctor = { kind: 'late', until: 0, lateMin: minutes };
    else c.doctor = { kind: 'in', until: 0, lateMin: 0 };
  });
}

export function raiseFlag({ token = '', name = '', where = '' } = {}) {
  update((s) => {
    s.flags.push({ id: s.seq++, at: simNow(s), token, name, where, seen: false });
    s.flags = s.flags.slice(-50);
  });
}

export function seeFlag(id) {
  update((s) => {
    const f = s.flags.find((x) => x.id === id);
    if (f) f.seen = true;
  });
}

export function addSamples(n = 20) {
  update((s) => {
    for (let i = 0; i < n; i++) {
      const person = SAMPLE_PEOPLE[Math.floor(Math.random() * SAMPLE_PEOPLE.length)];
      // children go to Children, others spread over departments (General Medicine is busiest)
      const pool = person.age < 12 ? ['chd', 'med', 'ent'] : ['med', 'med', 'med', 'wom', 'ort', 'ent', 'eye', 'skn'];
      let dept = pool[Math.floor(Math.random() * pool.length)];
      if (dept === 'wom' && person.gender !== 'female') dept = 'med';
      addPatient(s, { ...person, clinic: bestClinic(s, dept), by: 'sample' });
    }
  });
}

export function setTimeScale(scale) {
  update((s) => {
    const now = simNow(s);
    s.clock = { realBase: Date.now(), simBase: now, scale };
  });
}

export function resetAll() {
  const s = initialState();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  cache = s;
  if (channel) channel.postMessage({ rev: s.rev });
  if (socket && socket.connected) {
    socket.emit('state:update', { state: s, isStaffAction: false });
  }
  notify();
}

export { CLINICS, DEPARTMENTS };
