/** Point clouds for the hero wireframe.
 *
 *  Home is the original Fibonacci sphere - do not change it.
 *  Product heroes are rounded 3D letters and icons sampled in regular tube
 *  rings. The Home globe remains independent from this pipeline. */

import { globeMesh } from './heroGlobe';
import type { HeroShape, Mesh, Point } from './heroTypes';

export type { HeroShape, Mesh, Point } from './heroTypes';

const RING = 4;
const ALONG_STEP = 0.18;
const TUBE_R = 0.075;
const TRACKING = 0.28;
const CAP_LAYERS = 1;
/** Shared em: cap-height = 1, baseline = 0. Never rescale a word by its bbox. */
export const EM = 0.78;

type Poly = [number, number][];
type Glyph = {
  width: number;
  paths: Poly[];
  fillet: number;
  branches?: number[];
  hairpin?: boolean;
  crossbarY?: number;
  cleanBends?: boolean;
  fillTee?: boolean;
};

type Stroke = {
  points: Poly;
  closed?: boolean;
  fillet?: number;
  radius?: number;
  part?: number;
  alongFrom?: number;
  alongTo?: number;
};

type StrokeShape = {
  width: number;
  tubeRadius?: number;
  ringSides?: number;
  alongStep?: number;
  strokes: Stroke[];
};

function cubicPoint(
  a: [number, number],
  c1: [number, number],
  c2: [number, number],
  b: [number, number],
  t: number,
): [number, number] {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
    u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
  ];
}

function cubicSection(
  path: Poly,
  a: [number, number],
  c1: [number, number],
  c2: [number, number],
  b: [number, number],
  includeStart: boolean,
) {
  const steps = 6;
  const first = includeStart ? 0 : 1;
  for (let i = first; i <= steps; i++) path.push(cubicPoint(a, c1, c2, b, i / steps));
}

/** One constant-radius N tube. Each dense bend passes through the stem's extreme
 *  point, while the side stems and the middle diagonal remain exactly straight. */
function nCenterline(): Poly {
  const x0 = 0.14;
  const x1 = 0.66;
  const dx = x1 - x0;
  const len = Math.hypot(dx, 1);
  const diagonal: [number, number] = [dx / len, -1 / len];
  const bend = 0.16;
  const legHandle = 0.075;
  const apexHandle = 0.025;

  const topA: [number, number] = [x0, 1 - bend];
  const topTip: [number, number] = [x0, 1];
  const topB: [number, number] = [x0 + diagonal[0] * bend, 1 + diagonal[1] * bend];
  const bottomA: [number, number] = [x1 - diagonal[0] * bend, -diagonal[1] * bend];
  const bottomTip: [number, number] = [x1, 0];
  const bottomB: [number, number] = [x1, bend];

  const path: Poly = [[x0, 0]];
  cubicSection(
    path,
    topA,
    [topA[0], topA[1] + legHandle],
    [topTip[0] - apexHandle, topTip[1]],
    topTip,
    true,
  );
  cubicSection(
    path,
    topTip,
    [topTip[0] + apexHandle, topTip[1]],
    [topB[0] - diagonal[0] * legHandle, topB[1] - diagonal[1] * legHandle],
    topB,
    false,
  );
  path.push(bottomA);
  cubicSection(
    path,
    bottomA,
    [bottomA[0] + diagonal[0] * legHandle, bottomA[1] + diagonal[1] * legHandle],
    [bottomTip[0] - apexHandle, bottomTip[1]],
    bottomTip,
    false,
  );
  cubicSection(
    path,
    bottomTip,
    [bottomTip[0] + apexHandle, bottomTip[1]],
    [bottomB[0], bottomB[1] - legHandle],
    bottomB,
    false,
  );
  path.push([x1, 1]);
  return path;
}

function pCenterline(): Poly {
  const x = 0.12;
  const elbow = 0.14;
  const pts: Poly = [[x, 0], [x, 1 - elbow]];
  const ex = x + elbow;
  const ey = 1 - elbow;
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI - (i * Math.PI) / 16;
    pts.push([ex + Math.cos(a) * elbow, ey + Math.sin(a) * elbow]);
  }
  const cx = 0.41;
  const cy = 0.71;
  const br = 0.29;
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI / 2 - (i * Math.PI) / 12;
    pts.push([cx + Math.cos(a) * br, cy + Math.sin(a) * br]);
  }
  pts.push([x + TUBE_R, 0.42]);
  return pts;
}

function circularPath(cx: number, cy: number, radius: number, start: number, end: number, steps: number): Poly {
  const points: Poly = [];
  for (let i = 0; i <= steps; i++) {
    const angle = start + ((end - start) * i) / steps;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return points;
}

/** y = 0 baseline, y = 1 cap. Paths are centerlines; corners get filleted. */
const GLYPHS: Record<string, Glyph> = {
  A: {
    width: 0.84,
    fillet: 0.18,
    hairpin: true,
    branches: [1],
    crossbarY: 0.36,
    paths: [
      [
        [0.04, 0],
        [0.42, 1],
        [0.80, 0],
      ],
      [
        [0.22, 0.36],
        [0.62, 0.36],
      ],
    ],
  },
  E: {
    width: 0.72,
    fillet: 0.13,
    branches: [1],
    paths: [
      [
        [0.64, 1],
        [0.12, 1],
        [0.12, 0],
        [0.64, 0],
      ],
      [
        [0.22, 0.5],
        [0.52, 0.5],
      ],
    ],
  },
  I: {
    width: 0.52,
    fillet: 0,
    branches: [1],
    paths: [
      [
        [0.04, 1],
        [0.48, 1],
      ],
      [
        [0.26, 0.9],
        [0.26, 0.1],
      ],
      [
        [0.04, 0],
        [0.48, 0],
      ],
    ],
  },
  N: {
    width: 0.8,
    fillet: 0,
    cleanBends: true,
    paths: [nCenterline()],
  },
  P: {
    width: 0.76,
    fillet: 0,
    fillTee: true,
    paths: [pCenterline()],
  },
  S: {
    width: 0.78,
    fillet: 0.14,
    paths: [
      [
        [0.68, 1],
        [0.18, 1],
        [0.18, 0.5],
        [0.6, 0.5],
        [0.6, 0],
        [0.1, 0],
      ],
    ],
  },
  T: {
    width: 0.8,
    fillet: 0,
    branches: [1],
    paths: [
      [
        [0.06, 1],
        [0.74, 1],
      ],
      [
        [0.4, 0.9],
        [0.4, 0],
      ],
    ],
  },
  V: {
    width: 0.84,
    fillet: 0.18,
    hairpin: true,
    paths: [
      [
        [0.04, 1],
        [0.42, 0],
        [0.80, 1],
      ],
    ],
  },
};

function rotatePoly(poly: Poly, cx: number, cy: number, degrees: number): Poly {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return poly.map(([x, y]) => [
    cx + (x - cx) * cos - (y - cy) * sin,
    cy + (x - cx) * sin + (y - cy) * cos,
  ]);
}

const STORE_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.05,
  strokes: [
    {
      part: 0,
      closed: true,
      fillet: 0.04,
      points: [
        [0.24, 0.66],
        [0.76, 0.66],
        [0.68, 0.34],
        [0.32, 0.34],
      ],
    },
    {
      part: 0,
      fillet: 0.04,
      points: [
        [0.12, 0.8],
        [0.22, 0.8],
        [0.32, 0.34],
      ],
    },
    { part: 0, points: [[0.34, 0.22], [0.66, 0.22]] },
    {
      part: 2,
      closed: true,
      radius: 0.035,
      points: closedCirclePath(0.38, 0.12, 0.07, 12),
    },
    { part: 2, radius: 0.03, points: [[0.38, 0.05], [0.38, 0.19]] },
    { part: 2, radius: 0.03, points: [[0.31, 0.12], [0.45, 0.12]] },
    {
      part: 3,
      closed: true,
      radius: 0.035,
      points: closedCirclePath(0.62, 0.12, 0.07, 12),
    },
    { part: 3, radius: 0.03, points: [[0.62, 0.05], [0.62, 0.19]] },
    { part: 3, radius: 0.03, points: [[0.55, 0.12], [0.69, 0.12]] },
  ],
};

function closedCirclePath(cx: number, cy: number, radius: number, steps: number): Poly {
  const points: Poly = [];
  for (let i = 0; i < steps; i++) {
    const angle = (Math.PI * 2 * i) / steps;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return points;
}

function gearPath(): Poly {
  const points: Poly = [];
  const teeth = 8;
  const samples = teeth * 2;
  for (let i = 0; i < samples; i++) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / samples;
    const radius = i % 2 === 0 ? 0.2 : 0.155;
    points.push([0.5 + Math.cos(angle) * radius, 0.5 + Math.sin(angle) * radius]);
  }
  return points;
}

const UPDATE_TUBE_R = 0.045;

function circularArrow(
  cx: number,
  cy: number,
  radius: number,
  start: number,
  end: number,
  tubeRadius: number,
): Stroke[] {
  const arc = circularPath(cx, cy, radius, start, end, 18);
  const direction = Math.sign(end - start) || 1;
  const tx = -Math.sin(end) * direction;
  const ty = Math.cos(end) * direction;
  const nx = Math.cos(end);
  const ny = Math.sin(end);
  const endpoint = arc[arc.length - 1];
  const tip: [number, number] = [endpoint[0] + tx * tubeRadius, endpoint[1] + ty * tubeRadius];
  const wingBacks: [number, number][] = [
    [tip[0] - tx * 0.13 + nx * 0.075, tip[1] - ty * 0.13 + ny * 0.075],
    [tip[0] - tx * 0.13 - nx * 0.075, tip[1] - ty * 0.13 - ny * 0.075],
  ];
  const wings = wingBacks.map((back): Stroke => {
    const dx = tip[0] - back[0];
    const dy = tip[1] - back[1];
    const length = Math.hypot(dx, dy) || 1;
    return {
      points: [
        back,
        [tip[0] - (dx / length) * tubeRadius, tip[1] - (dy / length) * tubeRadius],
      ],
    };
  });
  return [
    { points: arc },
    ...wings,
  ];
}

const UPDATE_ARROW_END = 2.36;
const UPDATE_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: UPDATE_TUBE_R,
  strokes: [
    { part: 0, points: gearPath(), closed: true },
    { part: 0, points: closedCirclePath(0.5, 0.5, 0.07, 14), closed: true },
    ...circularArrow(0.5, 0.5, 0.43, -0.22, UPDATE_ARROW_END, UPDATE_TUBE_R).map((stroke) => ({
      ...stroke,
      part: 1,
    })),
    ...circularArrow(0.5, 0.5, 0.43, Math.PI - 0.22, Math.PI + UPDATE_ARROW_END, UPDATE_TUBE_R).map(
      (stroke) => ({ ...stroke, part: 1 }),
    ),
  ],
};

const SUPPORT_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.055,
  strokes: [
    {
      part: 0,
      closed: true,
      fillet: 0.06,
      points: [
        [0.5, 0.9],
        [0.82, 0.76],
        [0.76, 0.34],
        [0.5, 0.1],
        [0.24, 0.34],
        [0.18, 0.76],
      ],
    },
    {
      part: 1,
      radius: 0.045,
      fillet: 0.055,
      points: [
        [0.34, 0.48],
        [0.46, 0.34],
        [0.68, 0.62],
      ],
    },
  ],
};

const CRM_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.035,
  strokes: [
    {
      part: 0,
      closed: true,
      radius: 0.045,
      points: closedCirclePath(0.5, 0.64, 0.1, 16),
    },
    {
      part: 0,
      radius: 0.045,
      points: circularPath(0.5, 0.2, 0.28, 0.08, Math.PI - 0.08, 20),
    },
    ...(() => {
      const [arc, ...wings] = circularArrow(0.5, 0.5, 0.44, 1.283, Math.PI * 2, 0.035);
      return [
        { ...arc, part: 1, alongFrom: 0, alongTo: 0.78 },
        ...wings.map((stroke) => ({ ...stroke, part: 1, alongFrom: 0.82, alongTo: 1 })),
      ];
    })(),
  ],
};

function starPath(cx: number, cy: number, outer: number, inner: number): Poly {
  const points: Poly = [];
  for (let i = 0; i < 8; i++) {
    const angle = -Math.PI / 2 + (Math.PI / 4) * i;
    const radius = i % 2 === 0 ? outer : inner;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return points;
}

const SITES_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.038,
  ringSides: 6,
  alongStep: 0.06,
  strokes: [
    {
      closed: true,
      points: rotatePoly(
        [
          [0.34, 0.9],
          [0.34, 0.16],
          [0.48, 0.34],
          [0.58, 0.1],
          [0.7, 0.16],
          [0.52, 0.42],
          [0.8, 0.5],
        ],
        0.54,
        0.5,
        26,
      ),
    },
  ],
};

/** Three page cards with content stripes. Scroll gathers them into one stack. */
function pageCard(part: number, x0: number, y0: number, x1: number, y1: number): Stroke[] {
  const inset = (x1 - x0) * 0.16;
  const step = (y1 - y0) * 0.13;
  const top = y1 - (y1 - y0) * 0.2;
  return [
    {
      part,
      closed: true,
      fillet: 0.03,
      points: [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
    },
    { part, points: [[x0 + inset, top], [x1 - inset, top]] },
    { part, points: [[x0 + inset, top - step], [x1 - inset * 1.55, top - step]] },
    { part, points: [[x0 + inset, top - step * 2], [x1 - inset * 1.2, top - step * 2]] },
    { part, points: [[x0 + inset, top - step * 3], [x1 - inset * 1.85, top - step * 3]] },
  ];
}

const PAGES_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.04,
  strokes: [
    ...pageCard(0, -0.28, 0.18, 0.1, 0.8),
    ...pageCard(1, 0.31, 0.1, 0.69, 0.9),
    ...pageCard(2, 0.9, 0.18, 1.28, 0.8),
  ],
};

const VPN_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.05,
  strokes: [
    {
      part: 0,
      closed: true,
      fillet: 0.06,
      points: [
        [0.28, 0.1],
        [0.72, 0.1],
        [0.72, 0.46],
        [0.28, 0.46],
      ],
    },
    { part: 0, points: circularPath(0.5, 0.46, 0.18, Math.PI, 0, 16) },
    {
      part: 1,
      closed: true,
      radius: 0.03,
      points: closedCirclePath(0.5, 0.28, 0.045, 12),
    },
    { part: 1, points: [[0.455, 0.28], [0.545, 0.28]] },
  ],
};

const AI_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.045,
  strokes: [
    { part: 0, closed: true, points: starPath(0.5, 0.46, 0.36, 0.12) },
    { part: 1, closed: true, points: starPath(0.76, 0.72, 0.12, 0.04) },
  ],
};

/** Official 1C wordmark: inner+outer contours from the company SVG. */
const ONEC_ONE_A: Poly = [
  [0.4741, 0.0005],
  [0.3409, 0.0005],
  [0.3409, 0.8668],
  [0.1462, 0.8668],
  [0.1462, 1],
  [0.4741, 1],
];

const ONEC_ONE_B: Poly = [
  [0, 0.8002],
  [0, 0.6721],
  [0.1462, 0.6721],
  [0.1462, 0.0005],
  [0.2742, 0.0005],
  [0.2742, 0.8002],
];

const ONEC_C_OUTER: Poly = [
  [1.064, 0.133],
  [0.8556, 0.1935],
  [0.712, 0.3702],
  [0.7044, 0.6095],
  [0.8213, 0.7833],
  [1.0168, 0.8652],
  [1.1955, 0.8387],
  [1.356, 0.7078],
  [1.4203, 0.5058],
  [1.5527, 0.5058],
  [1.437, 0.8197],
  [1.2903, 0.9397],
  [1.1048, 0.9967],
  [0.8168, 0.939],
  [0.6159, 0.7382],
  [0.5605, 0.4309],
  [0.6882, 0.163],
  [1.011, 0.0057],
  [2.0504, 0],
  [2.0504, 0.1318],
];

const ONEC_C_INNER: Poly = [
  [1.1408, 0.34],
  [0.9791, 0.3623],
  [0.9036, 0.5476],
  [1.038, 0.6577],
  [1.1528, 0.6238],
  [1.2116, 0.5058],
  [1.3388, 0.5058],
  [1.2722, 0.684],
  [1.083, 0.7842],
  [0.8949, 0.7369],
  [0.7693, 0.5007],
  [0.8353, 0.3187],
  [0.9742, 0.2279],
  [2.0504, 0.2127],
  [2.0504, 0.34],
];

const ONEC_SHAPE: StrokeShape = {
  width: 2.05,
  tubeRadius: 0.032,
  ringSides: 4,
  alongStep: 0.13,
  strokes: [
    { part: 0, closed: true, points: ONEC_ONE_A },
    { part: 0, closed: true, points: ONEC_ONE_B },
    { part: 1, closed: true, points: ONEC_C_OUTER },
    { part: 1, closed: true, points: ONEC_C_INNER },
  ],
};

function planarFrame(tx: number, ty: number): { n: Point; b: Point } {
  const len = Math.hypot(tx, ty) || 1;
  return { n: [-ty / len, tx / len, 0], b: [0, 0, 1] };
}

function tangentsFromPoint(px: number, py: number, cx: number, cy: number, r: number): Poly | null {
  const dx = px - cx;
  const dy = py - cy;
  const d2 = dx * dx + dy * dy;
  if (d2 <= r * r * 1.002) return null;
  const l = (r * r) / d2;
  const h = (r * Math.sqrt(d2 - r * r)) / d2;
  const mx = cx + l * dx;
  const my = cy + l * dy;
  const hx = -dy * h;
  const hy = dx * h;
  return [
    [mx + hx, my + hy],
    [mx - hx, my - hy],
  ];
}

function arcVia(
  cx: number,
  cy: number,
  r: number,
  t0: [number, number],
  t2: [number, number],
  via: [number, number],
): { pts: Poly; sweep: number } | null {
  const a0 = Math.atan2(t0[1] - cy, t0[0] - cx);
  const a1 = Math.atan2(t2[1] - cy, t2[0] - cx);
  const av = Math.atan2(via[1] - cy, via[0] - cx);
  const tau = Math.PI * 2;
  const ccw = (a1 - a0 + tau) % tau;
  const viaCcw = (av - a0 + tau) % tau;
  const viaOnCcw = viaCcw <= ccw + 1e-4;
  const sweep = viaOnCcw ? ccw : ccw - tau;
  if (Math.abs(sweep) < 0.4) return null;
  const steps = Math.max(8, Math.round((Math.abs(sweep) * r) / 0.04));
  const pts: Poly = [];
  for (let s = 1; s < steps; s++) {
    const a = a0 + (sweep * s) / steps;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return { pts, sweep };
}

/** Acute corners (A, V, N): one tube around the vertex, not two bars jammed together. */
function vertexArc(p0: [number, number], corner: [number, number], p2: [number, number], r: number): Poly {
  const to0 = [p0[0] - corner[0], p0[1] - corner[1]];
  const to2 = [p2[0] - corner[0], p2[1] - corner[1]];
  const l0 = Math.hypot(to0[0], to0[1]) || 1;
  const l2 = Math.hypot(to2[0], to2[1]) || 1;
  const ax = to0[0] / l0;
  const ay = to0[1] / l0;
  const bx = to2[0] / l2;
  const by = to2[1] / l2;
  let ix = ax + bx;
  let iy = ay + by;
  const il = Math.hypot(ix, iy);
  if (il < 0.08) return [corner];
  ix /= il;
  iy /= il;
  const cx = corner[0] + ix * r;
  const cy = corner[1] + iy * r;
  const ts0 = tangentsFromPoint(p0[0], p0[1], cx, cy, r);
  const ts2 = tangentsFromPoint(p2[0], p2[1], cx, cy, r);
  if (!ts0 || !ts2) return [corner];
  const interior = Math.acos(Math.max(-1, Math.min(1, ax * bx + ay * by)));
  const target = Math.PI - interior;
  let best: { pts: Poly; score: number } | null = null;
  for (const t0 of ts0) {
    for (const t2 of ts2) {
      const built = arcVia(cx, cy, r, t0, t2, corner);
      if (!built) continue;
      const sweep = Math.abs(built.sweep);
      if (sweep < 0.5 || sweep > 3.35) continue;
      const score = Math.abs(sweep - target);
      if (!best || score < best.score) best = { pts: [t0, ...built.pts, t2], score };
    }
  }
  return best ? best.pts : [corner];
}

function fillet(pts: Poly, radius: number, hairpin = false): Poly {
  if (pts.length < 3 || radius <= 0) return pts;
  const out: Poly = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const ux = x1 - x0;
    const uy = y1 - y0;
    const vx = x2 - x1;
    const vy = y2 - y1;
    const l1 = Math.hypot(ux, uy) || 1;
    const l2 = Math.hypot(vx, vy) || 1;
    const uxn = ux / l1;
    const uyn = uy / l1;
    const vxn = vx / l2;
    const vyn = vy / l2;
    const turn = Math.atan2(uxn * vyn - uyn * vxn, uxn * vxn + uyn * vyn);
    const absTurn = Math.abs(turn);
    if (absTurn < 0.35) {
      out.push([x1, y1]);
      continue;
    }
    const interior = Math.PI - absTurn;
    if (hairpin && interior < 1.2) {
      out.push(...vertexArc([x0, y0], [x1, y1], [x2, y2], radius));
      continue;
    }
    const half = interior / 2;
    const tanHalf = Math.tan(half);
    if (tanHalf < 0.08) {
      out.push([x1, y1]);
      continue;
    }
    let r = radius;
    let dist = r / tanHalf;
    const maxDist = Math.min(l1, l2) * (interior < 1.2 ? 0.22 : 0.42);
    if (dist > maxDist) {
      dist = maxDist;
      r = dist * tanHalf;
    }
    if (r < 0.03) {
      out.push([x1, y1]);
      continue;
    }
    const ax = x1 - uxn * dist;
    const ay = y1 - uyn * dist;
    const bx = x1 + vxn * dist;
    const by = y1 + vyn * dist;
    const sign = turn >= 0 ? 1 : -1;
    const cx = ax - uyn * sign * r;
    const cy = ay + uxn * sign * r;
    const a0 = Math.atan2(ay - cy, ax - cx);
    const a1 = Math.atan2(by - cy, bx - cx);
    let sweep = a1 - a0;
    if (sign > 0 && sweep < 0) sweep += Math.PI * 2;
    if (sign < 0 && sweep > 0) sweep -= Math.PI * 2;
    if (Math.abs(sweep) > Math.PI) sweep -= Math.sign(sweep) * Math.PI * 2;
    const steps = Math.max(6, Math.round((Math.abs(sweep) * r) / 0.05));
    for (let s = 0; s <= steps; s++) {
      const a = a0 + sweep * (s / steps);
      out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

type Ring = { center: [number, number]; ids: number[] };

function distToSeg2(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const vx = bx - ax;
  const vy = by - ay;
  const len2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / len2));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}

function distToPoly(px: number, py: number, poly: Poly, skip: 'start' | 'end' | 'none' = 'none') {
  let min = Infinity;
  for (let i = 1; i < poly.length; i++) {
    if (skip === 'start' && i === 1) continue;
    if (skip === 'end' && i === poly.length - 1) continue;
    min = Math.min(min, distToSeg2(px, py, poly[i - 1][0], poly[i - 1][1], poly[i][0], poly[i][1]));
  }
  return min;
}

function densify(poly: Poly, preferredStep?: number): { x: number; y: number; tx: number; ty: number }[] {
  if (poly.length < 2) return [];
  const cleaned: Poly = [poly[0]];
  for (let i = 1; i < poly.length; i++) {
    if (Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]) < 1e-6) continue;
    cleaned.push(poly[i]);
  }
  if (cleaned.length < 2) return [];
  let total = 0;
  const lens: number[] = [];
  for (let i = 1; i < cleaned.length; i++) {
    const len = Math.hypot(cleaned[i][0] - cleaned[i - 1][0], cleaned[i][1] - cleaned[i - 1][1]);
    lens.push(len);
    total += len;
  }
  if (total < 1e-6) return [];
  const step = preferredStep ?? ALONG_STEP;
  const samples: { x: number; y: number; tx: number; ty: number }[] = [];
  for (let i = 0; i < cleaned.length - 1; i++) {
    const ax = cleaned[i][0];
    const ay = cleaned[i][1];
    const bx = cleaned[i + 1][0];
    const by = cleaned[i + 1][1];
    const tx = bx - ax;
    const ty = by - ay;
    const len = lens[i] || 1;
    const n = Math.max(1, Math.round(len / step));
    for (let s = 0; s <= n; s++) {
      if (i > 0 && s === 0) continue;
      const t = s / n;
      samples.push({ x: ax + tx * t, y: ay + ty * t, tx, ty });
    }
  }
  return samples;
}

function addRing(
  points: Point[],
  x: number,
  y: number,
  tx: number,
  ty: number,
  radius = TUBE_R,
  sides = RING,
): number[] {
  const { n, b } = planarFrame(tx, ty);
  const ids: number[] = [];
  for (let k = 0; k < sides; k++) {
    const ang = (k / sides) * Math.PI * 2;
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    points.push([x + (n[0] * ca + b[0] * sa) * radius, y + (n[1] * ca + b[1] * sa) * radius, (n[2] * ca + b[2] * sa) * radius]);
    ids.push(points.length - 1);
  }
  return ids;
}

function linkRing(edges: [number, number][], ids: number[]) {
  for (let k = 0; k < ids.length; k++) edges.push([ids[k], ids[(k + 1) % ids.length]]);
}

function addCap(
  points: Point[],
  edges: [number, number][],
  ring: Ring,
  tx: number,
  ty: number,
  radius = TUBE_R,
  sides = RING,
) {
  if (ring.ids.length !== sides) return;
  const { n, b } = planarFrame(tx, ty);
  let prev = ring.ids;
  for (let i = 1; i <= CAP_LAYERS; i++) {
    const y = i / CAP_LAYERS;
    if (i === CAP_LAYERS) {
      points.push([ring.center[0] + tx * radius, ring.center[1] + ty * radius, 0]);
      const pole = points.length - 1;
      for (const id of prev) edges.push([id, pole]);
      return;
    }
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const ids: number[] = [];
    for (let k = 0; k < sides; k++) {
      const ang = (k / sides) * Math.PI * 2;
      const ca = Math.cos(ang) * rr;
      const sa = Math.sin(ang) * rr;
      points.push([
        ring.center[0] + tx * y * radius + (n[0] * ca + b[0] * sa) * radius,
        ring.center[1] + ty * y * radius + (n[1] * ca + b[1] * sa) * radius,
        (n[2] * ca + b[2] * sa) * radius,
      ]);
      ids.push(points.length - 1);
    }
    linkRing(edges, ids);
    for (let k = 0; k < sides; k++) edges.push([prev[k], ids[k]]);
    prev = ids;
  }
}

type Tube = {
  rings: Ring[];
  first?: Ring;
  last?: Ring;
  startDir: [number, number];
  endDir: [number, number];
  teeEnd: boolean;
  isBranch: boolean;
};

function addTube(
  points: Point[],
  edges: [number, number][],
  ox: number,
  path: Poly,
  isBranch: boolean,
  others: Poly[],
): Tube {
  let samples = densify(path);
  if (isBranch) {
    samples = samples.filter((sample) =>
      others.every((other) => other.length > 1 && distToPoly(sample.x, sample.y, other) >= TUBE_R * 0.92),
    );
  }
  const rings: Ring[] = [];
  let prev: number[] | null = null;
  for (const sample of samples) {
    const ids = addRing(points, ox + sample.x, sample.y, sample.tx, sample.ty);
    linkRing(edges, ids);
    if (prev) {
      for (let k = 0; k < RING; k++) edges.push([prev[k], ids[k]]);
    }
    prev = ids;
    rings.push({ center: [ox + sample.x, sample.y], ids });
  }
  const firstS = samples[0];
  const lastS = samples[samples.length - 1];
  if (!firstS || !lastS) return { rings, startDir: [0, 1], endDir: [0, 1], teeEnd: false, isBranch };
  const startLen = Math.hypot(firstS.tx, firstS.ty) || 1;
  const endLen = Math.hypot(lastS.tx, lastS.ty) || 1;
  const last = rings[rings.length - 1];
  const early = Math.max(1, Math.floor(rings.length * 0.45));
  let teeEnd = false;
  if (last) {
    for (let i = 0; i < early; i++) {
      const a = rings[i];
      if (Math.hypot(a.center[0] - last.center[0], a.center[1] - last.center[1]) > TUBE_R * 1.55) continue;
      teeEnd = true;
    }
  }
  return {
    rings,
    first: rings[0],
    last: rings[rings.length - 1],
    startDir: [firstS.tx / startLen, firstS.ty / startLen],
    endDir: [lastS.tx / endLen, lastS.ty / endLen],
    teeEnd,
    isBranch,
  };
}

/** Predictable tube builder for the newer pictograms.
 *  Strokes never delete ring vertices or infer junctions from proximity:
 *  every open end gets a complete rounded cap and every loop closes ring to
 *  ring. This keeps the point rhythm of the approved letters without the
 *  fragile cleanup heuristics their bespoke junctions require. */
function addSafeStroke(
  points: Point[],
  edges: [number, number][],
  ox: number,
  stroke: Stroke,
  radius: number,
  sides: number,
  alongStep?: number,
  alongOut?: number[],
  a0 = 0,
  a1 = 0,
) {
  const mark = (count: number, t: number) => {
    if (!alongOut || count <= 0) return;
    const v = a0 + (a1 - a0) * t;
    for (let i = 0; i < count; i++) alongOut.push(v);
  };
  if (stroke.points.length < 2) return;
  const source = stroke.closed ? [...stroke.points, stroke.points[0]] : stroke.points;
  const shaped = stroke.fillet ? fillet(source, stroke.fillet) : source;
  const samples = densify(shaped, alongStep);
  if (
    stroke.closed &&
    samples.length > 1 &&
    Math.hypot(samples[0].x - samples[samples.length - 1].x, samples[0].y - samples[samples.length - 1].y) < 1e-6
  ) {
    samples.pop();
  }
  if (!samples.length) return;

  const rings: Ring[] = [];
  for (let s = 0; s < samples.length; s++) {
    const sample = samples[s];
    const ids = addRing(points, ox + sample.x, sample.y, sample.tx, sample.ty, radius, sides);
    linkRing(edges, ids);
    const previous = rings[rings.length - 1];
    if (previous) {
      for (let k = 0; k < sides; k++) edges.push([previous.ids[k], ids[k]]);
    }
    rings.push({ center: [ox + sample.x, sample.y], ids });
    const t = samples.length <= 1 ? 1 : s / (samples.length - 1);
    mark(ids.length, t);
  }

  if (stroke.closed && rings.length > 2) {
    const first = rings[0];
    const last = rings[rings.length - 1];
    for (let k = 0; k < sides; k++) edges.push([last.ids[k], first.ids[k]]);
    return;
  }

  const firstSample = samples[0];
  const lastSample = samples[samples.length - 1];
  const firstLength = Math.hypot(firstSample.tx, firstSample.ty) || 1;
  const lastLength = Math.hypot(lastSample.tx, lastSample.ty) || 1;
  const beforeStartCap = points.length;
  addCap(
    points,
    edges,
    rings[0],
    -firstSample.tx / firstLength,
    -firstSample.ty / firstLength,
    radius,
    sides,
  );
  mark(points.length - beforeStartCap, 0);
  const beforeEndCap = points.length;
  addCap(
    points,
    edges,
    rings[rings.length - 1],
    lastSample.tx / lastLength,
    lastSample.ty / lastLength,
    radius,
    sides,
  );
  mark(points.length - beforeEndCap, 1);
}

function strokeShapeMesh(ox: number, shape: StrokeShape): Mesh {
  const points: Point[] = [];
  const edges: [number, number][] = [];
  const parts: number[] = [];
  const along: number[] = [];
  const radius = shape.tubeRadius ?? TUBE_R;
  const sides = shape.ringSides ?? RING;
  shape.strokes.forEach((stroke, index) => {
    const start = points.length;
    const a0 = stroke.alongFrom ?? 0;
    const a1 = stroke.alongTo ?? a0;
    addSafeStroke(points, edges, ox, stroke, stroke.radius ?? radius, sides, shape.alongStep, along, a0, a1);
    const part = stroke.part ?? index;
    for (let i = start; i < points.length; i++) parts.push(part);
    while (along.length < points.length) along.push(a1);
  });
  return mergeClosePoints(points, edges, 1e-6, parts, along);
}

function dist3(a: Point, b: Point) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function distToSeg3(
  px: number,
  py: number,
  pz: number,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
) {
  const vx = bx - ax;
  const vy = by - ay;
  const vz = bz - az;
  const len2 = vx * vx + vy * vy + vz * vz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy + (pz - az) * vz) / len2));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t), pz - (az + vz * t));
}

function distPointToPoly3D(p: Point, poly: Poly, ox: number) {
  let min = Infinity;
  for (let i = 1; i < poly.length; i++) {
    min = Math.min(
      min,
      distToSeg3(p[0], p[1], p[2], ox + poly[i - 1][0], poly[i - 1][1], 0, ox + poly[i][0], poly[i][1], 0),
    );
  }
  return min;
}

function distToPolyAway(px: number, py: number, poly: Poly, nearX: number, nearY: number, window: number) {
  let min = Infinity;
  for (let i = 1; i < poly.length; i++) {
    const mx = (poly[i - 1][0] + poly[i][0]) / 2;
    const my = (poly[i - 1][1] + poly[i][1]) / 2;
    if (Math.hypot(mx - nearX, my - nearY) < window) continue;
    min = Math.min(min, distToSeg2(px, py, poly[i - 1][0], poly[i - 1][1], poly[i][0], poly[i][1]));
  }
  return min;
}

function punchInteriors(points: Point[], tubes: Tube[], filleted: Poly[], ox: number, kill: Set<number>) {
  for (let i = 0; i < tubes.length; i++) {
    for (const ring of tubes[i].rings) {
      for (const id of ring.ids) {
        const p = points[id];
        for (let j = 0; j < filleted.length; j++) {
          if (j === i) continue;
          const d = distPointToPoly3D(p, filleted[j], ox);
          if (tubes[i].isBranch) {
            if (d < TUBE_R * 0.5) kill.add(id);
          } else if (tubes[j].isBranch) {
            if (d < TUBE_R * 0.72) kill.add(id);
          } else if (d < TUBE_R * 0.8) {
            kill.add(id);
          }
        }
        if (tubes[i].isBranch) continue;
        const away = distToPolyAway(p[0] - ox, p[1], filleted[i], ring.center[0] - ox, ring.center[1], TUBE_R * 2.5);
        if (Math.hypot(away, p[2]) < TUBE_R * 0.8) kill.add(id);
      }
    }
  }
  for (const tube of tubes) {
    if (!tube.teeEnd || !tube.last) continue;
    const last = tube.last;
    const early = Math.max(1, Math.floor(tube.rings.length * 0.45));
    for (let i = 0; i < early; i++) {
      const a = tube.rings[i];
      if (Math.hypot(a.center[0] - last.center[0], a.center[1] - last.center[1]) > TUBE_R * 1.7) continue;
      for (const id of a.ids) {
        if (Math.hypot(points[id][0] - last.center[0], points[id][1] - last.center[1]) < TUBE_R * 0.85) kill.add(id);
      }
      for (const id of last.ids) {
        if (Math.hypot(points[id][0] - a.center[0], points[id][1] - a.center[1]) < TUBE_R * 0.85) kill.add(id);
      }
    }
  }
}

function addInnerBendFan(
  points: Point[],
  edges: [number, number][],
  rings: Ring[],
  anchor: Point,
  kill: Set<number>,
) {
  if (!rings.length) return;
  points.push(anchor);
  const pole = points.length - 1;
  const picks = [0, rings.length - 1];
  const seen = new Set<number>();
  for (const index of picks) {
    if (seen.has(index)) continue;
    seen.add(index);
    for (const k of [2, 6]) {
      const id = rings[index].ids[k];
      if (!kill.has(id)) edges.push([pole, id]);
    }
  }
}

function thinBendContours(edges: [number, number][], rings: Ring[]) {
  const remove = new Set<string>();
  for (let i = 1; i < rings.length - 1; i += 2) {
    const ids = rings[i].ids;
    for (let k = 0; k < ids.length; k++) {
      const a = ids[k];
      const b = ids[(k + 1) % ids.length];
      remove.add(a < b ? `${a}:${b}` : `${b}:${a}`);
    }
  }
  let write = 0;
  for (const edge of edges) {
    const key = edge[0] < edge[1] ? `${edge[0]}:${edge[1]}` : `${edge[1]}:${edge[0]}`;
    if (remove.has(key)) continue;
    edges[write++] = edge;
  }
  edges.length = write;
}

/** Clean N's tight turns and keep each outer side flush with its straight stem. */
function cleanNInnerBends(
  points: Point[],
  edges: [number, number][],
  tube: Tube | undefined,
  ox: number,
  kill: Set<number>,
) {
  if (!tube) return;
  const leftEdge = ox + 0.14 - TUBE_R;
  const rightEdge = ox + 0.66 + TUBE_R;
  const diagonalLength = Math.hypot(0.66 - 0.14, 1);
  const diagonalX = (0.66 - 0.14) / diagonalLength;
  const diagonalY = -1 / diagonalLength;
  const normalX = -diagonalY;
  const normalY = diagonalX;
  const topDiagonal: [number, number] = [0.14 + diagonalX * 0.16, 1 + diagonalY * 0.16];
  const topRings: Ring[] = [];
  const bottomRings: Ring[] = [];
  for (const ring of tube.rings) {
    const x = ring.center[0] - ox;
    const y = ring.center[1];
    if (y > 0.77 && x < 0.27) {
      topRings.push(ring);
      for (const id of ring.ids) {
        const point = points[id];
        point[0] = Math.max(point[0], leftEdge);
        if (x > 0.145) {
          const side = (point[0] - ox - topDiagonal[0]) * normalX + (point[1] - topDiagonal[1]) * normalY;
          if (side > TUBE_R) {
            point[0] -= normalX * (side - TUBE_R);
            point[1] -= normalY * (side - TUBE_R);
          }
        }
      }
      for (const k of [3, 4, 5]) kill.add(ring.ids[k]);
    } else if (y < 0.23 && x > 0.53) {
      bottomRings.push(ring);
      for (const id of ring.ids) {
        const point = points[id];
        point[0] = Math.min(point[0], rightEdge);
        if (x < 0.655) {
          const side = (point[0] - ox - topDiagonal[0]) * normalX + (point[1] - topDiagonal[1]) * normalY;
          if (side < -TUBE_R) {
            point[0] += normalX * (-TUBE_R - side);
            point[1] += normalY * (-TUBE_R - side);
          }
        }
      }
      for (const k of [7, 0, 1]) kill.add(ring.ids[k]);
    }
  }
  thinBendContours(edges, topRings);
  thinBendContours(edges, bottomRings);
  const topStemRing = topRings
    .filter((ring) => Math.abs(ring.center[0] - (ox + 0.14)) < 0.01)
    .reduce<Ring | undefined>(
      (best, ring) => (!best || Math.abs(ring.center[1] - 0.84) < Math.abs(best.center[1] - 0.84) ? ring : best),
      undefined,
    );
  const bottomStemRing = bottomRings
    .filter((ring) => Math.abs(ring.center[0] - (ox + 0.66)) < 0.01)
    .reduce<Ring | undefined>(
      (best, ring) => (!best || Math.abs(ring.center[1] - 0.16) < Math.abs(best.center[1] - 0.16) ? ring : best),
      undefined,
    );
  addInnerBendFan(points, edges, topRings, [ox + 0.205, topStemRing?.center[1] ?? 0.84, 0], kill);
  addInnerBendFan(points, edges, bottomRings, [ox + 0.595, bottomStemRing?.center[1] ?? 0.16, 0], kill);
}

function fillPTee(points: Point[], edges: [number, number][], tube: Tube | undefined, ox: number, kill: Set<number>) {
  if (!tube?.last) return;
  const requestedY = 0.35;
  let host: Ring | undefined;
  let best = Infinity;
  for (const ring of tube.rings) {
    const distance = Math.hypot(ring.center[0] - (ox + 0.12), ring.center[1] - requestedY);
    if (distance < best) {
      best = distance;
      host = ring;
    }
  }
  if (!host) return;
  points.push([ox + 0.17, host.center[1], 0]);
  const pole = points.length - 1;
  for (const k of [2, 6]) {
    const id = host.ids[k];
    if (!kill.has(id)) edges.push([pole, id]);
  }
  const lowerRight = tube.last.ids[0];
  if (!kill.has(lowerRight)) edges.push([pole, lowerRight]);
  for (const k of [2, 6]) {
    const upperRight = tube.last.ids[k];
    if (!kill.has(upperRight)) edges.push([pole, upperRight]);
  }
}

function nearestKept(id: number, candidates: number[], points: Point[], kill: Set<number>, maxD: number, k: number) {
  const hits: [number, number][] = [];
  for (const other of candidates) {
    if (kill.has(other) || other === id) continue;
    const d = dist3(points[id], points[other]);
    if (d < maxD) hits.push([d, other]);
  }
  hits.sort((a, b) => a[0] - b[0]);
  return hits.slice(0, k).map((h) => h[1]);
}

function weldJunctions(edges: [number, number][], points: Point[], tubes: Tube[], filleted: Poly[], kill: Set<number>) {
  for (let i = 0; i < tubes.length; i++) {
    const ends: Ring[] = [];
    const first = tubes[i].first;
    const last = tubes[i].last;
    if (first && tubes[i].isBranch) {
      const p = filleted[i][0];
      if (filleted.some((other, j) => j !== i && distToPoly(p[0], p[1], other) < TUBE_R * 1.4)) ends.push(first);
    }
    if (last) {
      const p = filleted[i][filleted[i].length - 1];
      const onOther = filleted.some((other, j) => j !== i && distToPoly(p[0], p[1], other) < TUBE_R * 1.4);
      if ((onOther && tubes[i].isBranch) || tubes[i].teeEnd) ends.push(last);
    }
    for (const end of ends) {
      for (let j = 0; j < tubes.length; j++) {
        if (j === i && !tubes[i].teeEnd) continue;
        const hostRings =
          j === i ? tubes[i].rings.slice(0, Math.max(1, Math.floor(tubes[i].rings.length * 0.45))) : tubes[j].rings;
        for (const id of end.ids) {
          if (kill.has(id)) continue;
          const cands: number[] = [];
          for (const ring of hostRings) {
            if (Math.hypot(ring.center[0] - end.center[0], ring.center[1] - end.center[1]) > TUBE_R * 1.7) continue;
            cands.push(...ring.ids);
          }
          for (const other of nearestKept(id, cands, points, kill, TUBE_R * 1.65, 2)) edges.push([id, other]);
        }
      }
    }
  }
}

function compactMesh(points: Point[], edges: [number, number][], kill: Set<number>) {
  const map = new Map<number, number>();
  const pts: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    if (kill.has(i)) continue;
    map.set(i, pts.length);
    pts.push(points[i]);
  }
  const eds: [number, number][] = [];
  const seen = new Set<string>();
  for (const [a, b] of edges) {
    const na = map.get(a);
    const nb = map.get(b);
    if (na === undefined || nb === undefined || na === nb) continue;
    const key = na < nb ? `${na}:${nb}` : `${nb}:${na}`;
    if (seen.has(key)) continue;
    seen.add(key);
    eds.push([na, nb]);
  }
  return { points: pts, edges: eds, map };
}

function remapRing(ring: Ring | undefined, map: Map<number, number>): Ring | undefined {
  if (!ring) return undefined;
  const ids = ring.ids.map((id) => map.get(id)).filter((id): id is number => id !== undefined);
  if (!ids.length) return undefined;
  return { center: ring.center, ids };
}

function xAtYOnPoly(poly: Poly, y: number): number[] {
  const xs: number[] = [];
  for (let i = 1; i < poly.length; i++) {
    const y0 = poly[i - 1][1];
    const y1 = poly[i][1];
    if (Math.abs(y1 - y0) < 1e-9) continue;
    const t = (y - y0) / (y1 - y0);
    if (t < -1e-6 || t > 1 + 1e-6) continue;
    xs.push(poly[i - 1][0] + t * (poly[i][0] - poly[i - 1][0]));
  }
  xs.sort((a, b) => a - b);
  return xs;
}

function letterMesh(ox: number, glyph: Glyph): Mesh {
  const points: Point[] = [];
  const edges: [number, number][] = [];
  const branchSet = new Set(glyph.branches ?? []);
  const filleted = glyph.paths.map((path) => fillet(path, glyph.fillet, glyph.hairpin));
  if (glyph.crossbarY != null && filleted[0]) {
    const xs = xAtYOnPoly(filleted[0], glyph.crossbarY);
    if (xs.length >= 2) {
      const y = glyph.crossbarY;
      filleted[1] = [
        [xs[0] + TUBE_R * 1.05, y],
        [xs[xs.length - 1] - TUBE_R * 1.05, y],
      ];
    }
  }
  const tubes = filleted.map((path, i) => addTube(points, edges, ox, path, branchSet.has(i), filleted.filter((_, j) => j !== i)));
  const kill = new Set<number>();
  punchInteriors(points, tubes, filleted, ox, kill);
  if (glyph.cleanBends) cleanNInnerBends(points, edges, tubes[0], ox, kill);
  if (glyph.fillTee) fillPTee(points, edges, tubes[0], ox, kill);
  weldJunctions(edges, points, tubes, filleted, kill);
  const packed = compactMesh(points, edges, kill);

  filleted.forEach((poly, i) => {
    const tube = tubes[i];
    const first = remapRing(tube.first, packed.map);
    const last = remapRing(tube.last, packed.map);
    const ends: { end: 'start' | 'end'; x: number; y: number }[] = [
      { end: 'start', x: poly[0][0], y: poly[0][1] },
      { end: 'end', x: poly[poly.length - 1][0], y: poly[poly.length - 1][1] },
    ];
    for (const end of ends) {
      let onAnother = false;
      filleted.forEach((other, j) => {
        if (j === i) return;
        if (distToPoly(end.x, end.y, other) < TUBE_R * 1.3) onAnother = true;
      });
      if (onAnother) continue;
      if (end.end === 'end' && tube.teeEnd) continue;
      if (end.end === 'start' && first) addCap(packed.points, packed.edges, first, -tube.startDir[0], -tube.startDir[1]);
      if (end.end === 'end' && last) addCap(packed.points, packed.edges, last, tube.endDir[0], tube.endDir[1]);
    }
  });

  return mergeClosePoints(packed.points, packed.edges, TUBE_R * 0.16);
}

function mergeClosePoints(
  points: Point[],
  edges: [number, number][],
  eps: number,
  parts?: number[],
  along?: number[],
): Mesh {
  const n = points.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (dist3(points[i], points[j]) < eps) parent[find(j)] = find(i);
    }
  }
  const rootToNew = new Map<number, number>();
  const pts: Point[] = [];
  const nextParts: number[] = [];
  const nextAlong: number[] = [];
  const map: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const r = find(i);
    let ni = rootToNew.get(r);
    if (ni === undefined) {
      ni = pts.length;
      rootToNew.set(r, ni);
      pts.push(points[r]);
      if (parts) nextParts.push(parts[r] ?? 0);
      if (along) nextAlong.push(along[r] ?? 0);
    }
    map[i] = ni;
  }
  const eds: [number, number][] = [];
  const seen = new Set<string>();
  for (const [a, b] of edges) {
    const na = map[a];
    const nb = map[b];
    if (na === nb) continue;
    const key = na < nb ? `${na}:${nb}` : `${nb}:${na}`;
    if (seen.has(key)) continue;
    seen.add(key);
    eds.push([na, nb]);
  }
  return {
    points: pts,
    edges: eds,
    parts: parts ? nextParts : undefined,
    along: along ? nextAlong : undefined,
  };
}

function applyEmTransform(mesh: Mesh): Mesh {
  return {
    points: mesh.points.map(([x, y, z]) => [x * EM, -(y - 0.5) * EM, z * EM]),
    edges: mesh.edges,
    parts: mesh.parts,
    along: mesh.along,
  };
}

function sampleWord(word: string): Mesh {
  const glyphs: Glyph[] = [];
  let total = 0;
  for (const ch of word) {
    const glyph = GLYPHS[ch];
    if (!glyph) continue;
    if (total) total += TRACKING;
    total += glyph.width;
    glyphs.push(glyph);
  }

  const points: Point[] = [];
  const edges: [number, number][] = [];
  let origin = -total / 2;
  for (const glyph of glyphs) {
    const mesh = letterMesh(origin, glyph);
    const offset = points.length;
    points.push(...mesh.points);
    for (const [a, b] of mesh.edges) edges.push([a + offset, b + offset]);
    origin += glyph.width + TRACKING;
  }

  return applyEmTransform({ points, edges });
}

function sampleStrokeShape(shape: StrokeShape): Mesh {
  return applyEmTransform(strokeShapeMesh(-shape.width / 2, shape));
}

export { isLetterShape } from './heroTypes';

export function meshForShape(shape: HeroShape, nodes: number): Mesh {
  if (shape === 'globe') return globeMesh(nodes);

  const icons: Partial<Record<HeroShape, StrokeShape>> = {
    onec: ONEC_SHAPE,
    sites: SITES_SHAPE,
    pages: PAGES_SHAPE,
    vpn: VPN_SHAPE,
    ai: AI_SHAPE,
    store: STORE_SHAPE,
    update: UPDATE_SHAPE,
    support: SUPPORT_SHAPE,
    crm: CRM_SHAPE,
  };
  return sampleStrokeShape(icons[shape] ?? SUPPORT_SHAPE);
}
