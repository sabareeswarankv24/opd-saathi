// Departments (made-up doctors). Names/descriptions live in src/i18n (dept.<id>, dept.<id>.desc).
// A department can have more than one room. Each room is its own queue ("clinic").
export const DEPARTMENTS = [
  { id: 'med', code: 'MED', icon: 'stethoscope', clinics: ['med1', 'med2'] },
  { id: 'chd', code: 'CHD', icon: 'child', clinics: ['chd'] },
  { id: 'wom', code: 'WOM', icon: 'woman', clinics: ['wom'] },
  { id: 'ort', code: 'ORT', icon: 'bone', clinics: ['ort'] },
  { id: 'ent', code: 'ENT', icon: 'ear', clinics: ['ent'] },
  { id: 'eye', code: 'EYE', icon: 'eye', clinics: ['eye'] },
  { id: 'skn', code: 'SKN', icon: 'hand', clinics: ['skn'] },
];

// One queue per room. avgMin = sample average consultation time in minutes.
// seats = chairs in the waiting area outside the room (used for the overcrowding colour).
export const CLINICS = [
  { id: 'med1', dept: 'med', room: 'r1', doctor: 'Dr. R. K. Sharma', hours: ['09:00', '14:00'], avgMin: 5, seats: 8 },
  { id: 'med2', dept: 'med', room: 'r2', doctor: 'Dr. Anita Verma', hours: ['09:00', '14:00'], avgMin: 6, seats: 8 },
  { id: 'chd', dept: 'chd', room: 'r3', doctor: 'Dr. S. Iyer', hours: ['09:00', '14:00'], avgMin: 7, seats: 8 },
  { id: 'wom', dept: 'wom', room: 'r4', doctor: 'Dr. Meena Joshi', hours: ['09:00', '14:00'], avgMin: 8, seats: 6 },
  { id: 'ort', dept: 'ort', room: 'r5', doctor: 'Dr. Imran Khan', hours: ['09:00', '14:00'], avgMin: 7, seats: 6 },
  { id: 'ent', dept: 'ent', room: 'r6', doctor: 'Dr. P. Nair', hours: ['09:00', '14:00'], avgMin: 6, seats: 6 },
  { id: 'eye', dept: 'eye', room: 'r7', doctor: 'Dr. Kavita Singh', hours: ['09:00', '14:00'], avgMin: 5, seats: 6 },
  { id: 'skn', dept: 'skn', room: 'r8', doctor: 'Dr. A. Das', hours: ['09:00', '14:00'], avgMin: 5, seats: 6 },
];

export const CLINIC_BY_ID = Object.fromEntries(CLINICS.map((c) => [c.id, c]));
export const DEPT_BY_ID = Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d]));
