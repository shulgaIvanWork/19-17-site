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
const CAP_LAYERS = 1;
/** Shared em: cap-height = 1, baseline = 0. Never rescale a word by its bbox. */
const EM = 0.78;

type Poly = [number, number][];
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

function circularPath(cx: number, cy: number, radius: number, start: number, end: number, steps: number): Poly {
  const points: Poly = [];
  for (let i = 0; i <= steps; i++) {
    const angle = start + ((end - start) * i) / steps;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return points;
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

/** Курсор лендинга - классическая стрелка без поворота: левое ребро вертикально,
 *  острие и крыло под 45 градусов, хвост вниз вправо. Контур снят с сетки
 *  12 x 20 (шаг 0.04, ось y вверх): острие (0,0), низ (0,17), выемка (4,13),
 *  хвост (7,20)-(9.94,18.74), выемка (7.05,12), крыло (12,12). Раньше контур
 *  был повернут на 26 градусов и читался как искаженная фигура.
 *  Хвост шириной 0.128 между осями ребер при трубке 0.032: при ширине меньше
 *  диаметра трубки трубки хвоста налезают друг на друга. */
const SITES_SHAPE: StrokeShape = {
  width: 1,
  tubeRadius: 0.032,
  strokes: [
    {
      closed: true,
      points: [
        [0.26, 0.9],
        [0.26, 0.22],
        [0.42, 0.38],
        [0.54, 0.1],
        [0.658, 0.15],
        [0.542, 0.42],
        [0.74, 0.42],
      ],
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
    // Малая звезда: внутренний радиус 0.04 был меньше радиуса трубки, лучи
    // слипались в клубок. Свой, более тонкий радиус трубки.
    { part: 1, closed: true, radius: 0.028, points: starPath(0.76, 0.72, 0.12, 0.05) },
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

/** Предел растяжения кольца в остром углу: без него стык на ус дает шип. */
const MITER_LIMIT = 1.8;

/** Точки вдоль ломаной с касательной. В вершине касательная - биссектриса угла,
 *  а m - во сколько раз растянуть кольцо в плоскости, чтобы трубка не сужалась
 *  (стык на ус). Раньше вершина брала касательную входящего ребра, и на острых
 *  углах без скругления (курсор лендинга, звезда AI) стык выходил косым. */
/** Поворот, начиная с которого вершина считается углом, а не шагом дуги. */
const GUARD_TURN = 0.35;

/** guard - радиус трубки. У каждого угла ставятся два обычных кольца на
 *  расстоянии около радиуса до и после вершины: ребро между ними идет
 *  параллельными линиями, а растянутое кольцо стоит только в самом углу.
 *  Без них при редком шаге продольные линии расходились веером по всему ребру. */
function densify(
  poly: Poly,
  preferredStep?: number,
  guard = 0,
): { x: number; y: number; tx: number; ty: number; m: number }[] {
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
  const samples: { x: number; y: number; tx: number; ty: number; m: number }[] = [];
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
      if (s === n && i < cleaned.length - 2) {
        // Вершина между ребром i и i + 1: биссектриса и растяжение на ус.
        const ux = tx / len;
        const uy = ty / len;
        const vx = (cleaned[i + 2][0] - bx) / (lens[i + 1] || 1);
        const vy = (cleaned[i + 2][1] - by) / (lens[i + 1] || 1);
        const sx = ux + vx;
        const sy = uy + vy;
        const sl = Math.hypot(sx, sy);
        if (sl > 1e-6) {
          const cosHalf = (sx * ux + sy * uy) / sl;
          const turn = Math.acos(Math.max(-1, Math.min(1, ux * vx + uy * vy)));
          const g = guard > 0 && turn > GUARD_TURN ? guard * Math.min(Math.tan(turn / 2) + 0.35, 1.8) : 0;
          const nextLen = lens[i + 1] || 1;
          const nextStep = nextLen / Math.max(1, Math.round(nextLen / step));
          if (g > 0 && g < (len / n) * 0.8) samples.push({ x: bx - ux * g, y: by - uy * g, tx: ux, ty: uy, m: 1 });
          samples.push({ x: bx, y: by, tx: sx / sl, ty: sy / sl, m: Math.min(MITER_LIMIT, 1 / Math.max(cosHalf, 1e-3)) });
          if (g > 0 && g < nextStep * 0.8) samples.push({ x: bx + vx * g, y: by + vy * g, tx: vx, ty: vy, m: 1 });
          continue;
        }
      }
      samples.push({ x: ax + tx * t, y: ay + ty * t, tx, ty, m: 1 });
    }
  }
  return samples;
}

/** Поворот сечения трубки. При четном числе сторон вершины и так стоят
 *  симметрично относительно оси в плоскости рисунка. При нечетном (3 стороны на
 *  телефоне, quality < 0.72) без поворота одна вершина смотрела вдоль нормали, а
 *  две другие - на -0.5r: на виде спереди трубка сдвигалась на четверть радиуса
 *  вбок. У замка VPN перекладина скважины уходила с центра круга на 0.0125
 *  (2026-09-13). Поворот на четверть оборота ставит одну вершину к зрителю, а две
 *  другие - симметрично по сторонам оси. */
function ringPhase(sides: number) {
  return sides % 2 ? Math.PI / 2 : 0;
}

function addRing(
  points: Point[],
  x: number,
  y: number,
  tx: number,
  ty: number,
  radius = TUBE_R,
  sides = RING,
  miter = 1,
): number[] {
  const { n, b } = planarFrame(tx, ty);
  const ids: number[] = [];
  const phase = ringPhase(sides);
  for (let k = 0; k < sides; k++) {
    const ang = (k / sides) * Math.PI * 2 + phase;
    const ca = Math.cos(ang) * miter;
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
      const ang = (k / sides) * Math.PI * 2 + ringPhase(sides);
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

/** Predictable tube builder for the newer pictograms.
 *  Strokes never delete ring vertices or infer junctions from proximity:
 *  every open end gets a complete rounded cap and every loop closes ring to
 *  ring. This keeps the point rhythm of the approved letters without the
 *  fragile cleanup heuristics their bespoke junctions require. */
/** Замкнутый контур начинается с середины первого ребра, а не с вершины.
 *  fillet() скругляет только внутренние вершины, и контур, начатый в углу,
 *  оставлял этот угол острым, а кольца трубки на стыке шли с разными
 *  касательными: у замка VPN был кривой нижний левый угол. */
function closedFromEdgeMidpoint(pts: Poly): Poly {
  const ring = pts.length > 2 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]
    ? pts.slice(0, -1)
    : pts;
  if (ring.length < 2) return [...ring, ring[0]];
  const mid: [number, number] = [(ring[0][0] + ring[1][0]) / 2, (ring[0][1] + ring[1][1]) / 2];
  return [mid, ...ring.slice(1), ring[0], mid];
}

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
  const source = stroke.closed ? closedFromEdgeMidpoint(stroke.points) : stroke.points;
  const shaped = stroke.fillet ? fillet(source, stroke.fillet) : source;
  const samples = densify(shaped, alongStep, radius);
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
    const ids = addRing(points, ox + sample.x, sample.y, sample.tx, sample.ty, radius, sides, sample.m);
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

function strokeShapeMesh(ox: number, shape: StrokeShape, quality = 1): Mesh {
  const points: Point[] = [];
  const edges: [number, number][] = [];
  const parts: number[] = [];
  const along: number[] = [];
  const radius = shape.tubeRadius ?? TUBE_R;
  const sides = quality < 0.72 ? 3 : (shape.ringSides ?? RING);
  const step = (shape.alongStep ?? ALONG_STEP) / Math.max(0.38, quality);
  shape.strokes.forEach((stroke, index) => {
    const start = points.length;
    const a0 = stroke.alongFrom ?? 0;
    const a1 = stroke.alongTo ?? a0;
    addSafeStroke(points, edges, ox, stroke, stroke.radius ?? radius, sides, step, along, a0, a1);
    const part = stroke.part ?? index;
    for (let i = start; i < points.length; i++) parts.push(part);
    while (along.length < points.length) along.push(a1);
  });
  return mergeClosePoints(points, edges, 1e-6, parts, along);
}

function dist3(a: Point, b: Point) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
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

function sampleStrokeShape(shape: StrokeShape, quality = 1): Mesh {
  return applyEmTransform(strokeShapeMesh(-shape.width / 2, shape, quality));
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
  const quality = Math.max(0.38, Math.min(1, nodes / 110));
  return sampleStrokeShape(icons[shape] ?? SUPPORT_SHAPE, quality);
}
