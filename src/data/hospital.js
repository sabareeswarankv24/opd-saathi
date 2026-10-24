// Sample hospital: City District Hospital (made up). Names and landmarks live in src/i18n (keys place.<id> and lm.<id>).
// Plans are drawn on a 400 x 260 grid. x/y are positions on that grid.

export const FLOORS = [0, 1, 2]; // 0 = ground floor

export const PLAN = { w: 400, h: 260 };

// type: used for icon and grouping.
export const PLACES = [
  // ---- Ground floor ----
  { id: 'entrance', floor: 0, x: 40, y: 225, type: 'entrance' },
  { id: 'ramp', floor: 0, x: 40, y: 180, type: 'ramp' },
  { id: 'reg', floor: 0, x: 115, y: 200, type: 'registration' },
  { id: 'help', floor: 0, x: 185, y: 225, type: 'help' },
  { id: 'wheelchair', floor: 0, x: 75, y: 130, type: 'wheelchair' },
  { id: 'water_g', floor: 0, x: 120, y: 130, type: 'water' },
  { id: 'toilets_g', floor: 0, x: 60, y: 60, type: 'toilets' },
  { id: 'stairs_g', floor: 0, x: 150, y: 150, type: 'stairs' },
  { id: 'lift_g', floor: 0, x: 225, y: 150, type: 'lift' },
  { id: 'pharmacy', floor: 0, x: 280, y: 110, type: 'pharmacy' },
  { id: 'lab', floor: 0, x: 220, y: 55, type: 'lab' },
  { id: 'xray', floor: 0, x: 330, y: 55, type: 'xray' },
  { id: 'emergency', floor: 0, x: 345, y: 205, type: 'emergency' },

  // ---- First floor ----
  { id: 'r1', floor: 1, x: 50, y: 50, type: 'room', dept: 'med' },
  { id: 'r2', floor: 1, x: 110, y: 50, type: 'room', dept: 'med' },
  { id: 'r3', floor: 1, x: 170, y: 50, type: 'room', dept: 'chd' },
  { id: 'r4', floor: 1, x: 230, y: 50, type: 'room', dept: 'wom' },
  { id: 'r5', floor: 1, x: 110, y: 230, type: 'room', dept: 'ort' },
  { id: 'r6', floor: 1, x: 170, y: 230, type: 'room', dept: 'ent' },
  { id: 'r7', floor: 1, x: 230, y: 230, type: 'room', dept: 'eye' },
  { id: 'r8', floor: 1, x: 290, y: 230, type: 'room', dept: 'skn' },
  { id: 'hall_a', floor: 1, x: 190, y: 140, type: 'hall' },
  { id: 'stairs_1', floor: 1, x: 150, y: 150, type: 'stairs' },
  { id: 'lift_1', floor: 1, x: 225, y: 150, type: 'lift' },
  { id: 'toilets_1', floor: 1, x: 340, y: 140, type: 'toilets' },

  // ---- Second floor ----
  { id: 'ward4', floor: 2, x: 60, y: 60, type: 'ward' },
  { id: 'ward5', floor: 2, x: 180, y: 60, type: 'ward' },
  { id: 'ward6', floor: 2, x: 300, y: 60, type: 'ward' },
  { id: 'nurses', floor: 2, x: 190, y: 140, type: 'nurses' },
  { id: 'stairs_2', floor: 2, x: 150, y: 150, type: 'stairs' },
  { id: 'lift_2', floor: 2, x: 225, y: 150, type: 'lift' },
];

// Paths are walkable both ways. m = metres. stairs = true if the path uses stairs or steps.
// kind: walk | lift | stairs | ramp | steps
export const EDGES = [
  // Ground floor
  { a: 'entrance', b: 'reg', m: 8, stairs: true, kind: 'steps' }, // 5 steps at the front door
  { a: 'entrance', b: 'ramp', m: 10, stairs: false, kind: 'ramp' },
  { a: 'ramp', b: 'reg', m: 15, stairs: false, kind: 'walk' },
  { a: 'entrance', b: 'emergency', m: 45, stairs: false, kind: 'walk' },
  { a: 'reg', b: 'help', m: 15, stairs: false, kind: 'walk' },
  { a: 'reg', b: 'wheelchair', m: 12, stairs: false, kind: 'walk' },
  { a: 'reg', b: 'water_g', m: 12, stairs: false, kind: 'walk' },
  { a: 'wheelchair', b: 'water_g', m: 8, stairs: false, kind: 'walk' },
  { a: 'wheelchair', b: 'toilets_g', m: 15, stairs: false, kind: 'walk' },
  { a: 'water_g', b: 'stairs_g', m: 10, stairs: false, kind: 'walk' },
  { a: 'stairs_g', b: 'lift_g', m: 8, stairs: false, kind: 'walk' },
  { a: 'help', b: 'lift_g', m: 14, stairs: false, kind: 'walk' },
  { a: 'help', b: 'emergency', m: 20, stairs: false, kind: 'walk' },
  { a: 'lift_g', b: 'pharmacy', m: 10, stairs: false, kind: 'walk' },
  { a: 'pharmacy', b: 'lab', m: 12, stairs: false, kind: 'walk' },
  { a: 'pharmacy', b: 'xray', m: 12, stairs: false, kind: 'walk' },
  { a: 'lift_g', b: 'emergency', m: 30, stairs: false, kind: 'walk' },

  // First floor
  { a: 'hall_a', b: 'lift_1', m: 6, stairs: false, kind: 'walk' },
  { a: 'hall_a', b: 'stairs_1', m: 6, stairs: false, kind: 'walk' },
  { a: 'lift_1', b: 'stairs_1', m: 10, stairs: false, kind: 'walk' },
  { a: 'hall_a', b: 'r3', m: 14, stairs: false, kind: 'walk' },
  { a: 'r3', b: 'r2', m: 8, stairs: false, kind: 'walk' },
  { a: 'r2', b: 'r1', m: 8, stairs: false, kind: 'walk' },
  { a: 'r3', b: 'r4', m: 8, stairs: false, kind: 'walk' },
  { a: 'hall_a', b: 'r6', m: 14, stairs: false, kind: 'walk' },
  { a: 'r6', b: 'r5', m: 8, stairs: false, kind: 'walk' },
  { a: 'r6', b: 'r7', m: 8, stairs: false, kind: 'walk' },
  { a: 'r7', b: 'r8', m: 8, stairs: false, kind: 'walk' },
  { a: 'hall_a', b: 'toilets_1', m: 20, stairs: false, kind: 'walk' },

  // Second floor
  { a: 'nurses', b: 'lift_2', m: 6, stairs: false, kind: 'walk' },
  { a: 'nurses', b: 'stairs_2', m: 6, stairs: false, kind: 'walk' },
  { a: 'lift_2', b: 'stairs_2', m: 10, stairs: false, kind: 'walk' },
  { a: 'nurses', b: 'ward5', m: 15, stairs: false, kind: 'walk' },
  { a: 'ward5', b: 'ward4', m: 12, stairs: false, kind: 'walk' },
  { a: 'ward5', b: 'ward6', m: 12, stairs: false, kind: 'walk' },

  // Between floors
  { a: 'lift_g', b: 'lift_1', m: 8, stairs: false, kind: 'lift' },
  { a: 'lift_1', b: 'lift_2', m: 8, stairs: false, kind: 'lift' },
  { a: 'stairs_g', b: 'stairs_1', m: 12, stairs: true, kind: 'stairs' },
  { a: 'stairs_1', b: 'stairs_2', m: 12, stairs: true, kind: 'stairs' },
];

export const PLACE_BY_ID = Object.fromEntries(PLACES.map((p) => [p.id, p]));

// Places a patient can pick in "Find a place" (stairs/ramp nodes are connectors, still searchable).
export const SEARCHABLE = PLACES.map((p) => p.id);

// Walking speed used for "about N minutes": 0.6 m/s for a slow walker.
export const SLOW_WALK_M_PER_MIN = 36;
