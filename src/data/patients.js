// Made-up sample patients. First names only. No real IDs, ever.
export const SAMPLE_PEOPLE = [
  { name: 'Ramesh', age: 54, gender: 'male' },
  { name: 'Sunita', age: 38, gender: 'female' },
  { name: 'Mohan', age: 67, gender: 'male' },
  { name: 'Geeta', age: 45, gender: 'female' },
  { name: 'Arjun', age: 8, gender: 'male' },
  { name: 'Pooja', age: 27, gender: 'female' },
  { name: 'Salim', age: 59, gender: 'male' },
  { name: 'Lakshmi', age: 72, gender: 'female' },
  { name: 'Deepak', age: 33, gender: 'male' },
  { name: 'Rekha', age: 41, gender: 'female' },
  { name: 'Vijay', age: 50, gender: 'male' },
  { name: 'Anjali', age: 6, gender: 'female' },
  { name: 'Harish', age: 62, gender: 'male' },
  { name: 'Savita', age: 35, gender: 'female' },
  { name: 'Kiran', age: 29, gender: 'other' },
  { name: 'Bhavna', age: 31, gender: 'female' },
  { name: 'Naresh', age: 47, gender: 'male' },
  { name: 'Fatima', age: 56, gender: 'female' },
  { name: 'Gopal', age: 70, gender: 'male' },
  { name: 'Meera', age: 24, gender: 'female' },
];

// Patients already waiting when the demo starts (clinic id -> how many).
export const SEED_QUEUES = { med1: 5, med2: 3, chd: 3, wom: 2, ort: 2, ent: 1, eye: 2, skn: 1 };

// First token number per department code, so slips look like MED-042.
export const START_COUNTERS = { MED: 36, CHD: 11, WOM: 7, ORT: 20, ENT: 4, EYE: 14, SKN: 9 };
