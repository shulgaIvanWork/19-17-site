import type { HeroShape, Point } from './heroTypes';

export type LiveBuffers = {
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  hide: Uint8Array;
};

/** Same travel the cursor uses to leave the canvas. */
const EXIT_X = 1.08;
const EXIT_Y = 0.9;

const TAU = Math.PI * 2;
/** Постоянное вращение стрелок модели update: радиан на тик героя (16.67 мс),
 *  полный оборот за 18 с. Угол берется от часов по модулю 2pi, поэтому скачка
 *  между оборотами нет. */
const UPDATE_SPIN = TAU / 1080;

function rotateXY(x: number, y: number, cx: number, cy: number, angle: number): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

function rotateXZ(x: number, z: number, cx: number, cz: number, angle: number): [number, number] {
  const dx = x - cx;
  const dz = z - cz;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [cx + dx * c - dz * s, cz + dx * s + dz * c];
}

function centroids(points: Point[], parts: number[] | undefined) {
  const acc = new Map<number, { x: number; y: number; z: number; n: number }>();
  for (let i = 0; i < points.length; i++) {
    const part = parts?.[i] ?? 0;
    const cur = acc.get(part) ?? { x: 0, y: 0, z: 0, n: 0 };
    cur.x += points[i][0];
    cur.y += points[i][1];
    cur.z += points[i][2];
    cur.n += 1;
    acc.set(part, cur);
  }
  const out = new Map<number, Point>();
  for (const [part, cur] of acc) {
    out.set(part, [cur.x / cur.n, cur.y / cur.n, cur.z / cur.n]);
  }
  return out;
}

function allCentroid(points: Point[]): Point {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const p of points) {
    x += p[0];
    y += p[1];
    z += p[2];
  }
  const n = points.length || 1;
  return [x / n, y / n, z / n];
}

export type ScrollBasis = {
  centers: Map<number, Point>;
  mid: Point;
};

/** Centroids are fixed for a mesh - compute once, not every frame. */
export function scrollBasis(points: Point[], parts: number[] | undefined): ScrollBasis {
  return { centers: centroids(points, parts), mid: allCentroid(points) };
}

function ease(p: number) {
  return p * p * (3 - 2 * p);
}

function flyOff(x: number, y: number, p: number): [number, number] {
  return [x + p * EXIT_X, y + p * EXIT_Y];
}

/** Scroll 0-1 drives a per-shape motion. Globe is unchanged.
 *  clock - время анимации героя в тиках (16.67 мс), для движения, не зависящего от прокрутки. */
export function applyHeroScroll(
  shape: HeroShape,
  points: Point[],
  parts: number[] | undefined,
  along: number[] | undefined,
  p: number,
  live: LiveBuffers,
  basis: ScrollBasis,
  clock = 0,
) {
  const n = points.length;
  live.hide.fill(0);
  if (shape === 'globe' || n === 0) {
    for (let i = 0; i < n; i++) {
      live.x[i] = points[i][0];
      live.y[i] = points[i][1];
      live.z[i] = points[i][2];
    }
    return;
  }

  const t = ease(Math.min(1, Math.max(0, p)));
  const { centers, mid } = basis;
  const spin = shape === 'update' ? (clock * UPDATE_SPIN) % TAU : 0;

  for (let i = 0; i < n; i++) {
    let [x, y, z] = points[i];
    const part = parts?.[i] ?? 0;

    if (shape === 'sites') {
      // Только плавный уход по диагонали. Нажатие (наклон, вдавливание и
      // сжатие в первой трети прокрутки) убрано по просьбе заказчика 2026-09-11.
      [x, y] = flyOff(x, y, t);
    } else if (shape === 'store') {
      const shift = (t - 0.5) * (EXIT_X * 2);
      x += shift;
      if (part === 2 || part === 3) {
        const c = centers.get(part) ?? mid;
        const [nx, ny] = rotateXY(x, y, c[0] + shift, c[1], t * Math.PI * 2.2);
        x = nx;
        y = ny;
      }
    } else if (shape === 'update') {
      // Шестеренка (part 0) стоит на месте. Стрелки поворачиваются от прокрутки
      // и постоянно, оба раза по ходу своих наконечников: построенная в экранных
      // координатах дуга после переворота y (heroShapes, EM) идет против часовой.
      if (part === 1) {
        const c = centers.get(0) ?? mid;
        const [nx, ny] = rotateXY(x, y, c[0], c[1], -(t * Math.PI * 0.7 + spin));
        x = nx;
        y = ny;
      }
    } else if (shape === 'support') {
      if (part === 1) {
        const c = centers.get(1) ?? mid;
        const grow = t * t * (3 - 2 * t);
        if (grow < 0.02) live.hide[i] = 1;
        x = c[0] + (x - c[0]) * grow;
        y = c[1] + (y - c[1]) * grow;
        z = c[2] + (z - c[2]) * grow;
      }
    } else if (shape === 'onec') {
      x += part === 0 ? -t * 0.42 : t * 0.42;
      [x, y] = flyOff(x, y, t);
    } else if (shape === 'crm') {
      const grow = t * t * (3 - 2 * t);
      if (part === 1) {
        const a = along?.[i] ?? 0;
        if (a >= 0.8) {
          if (grow < 0.8) live.hide[i] = 1;
        } else if (a > grow) {
          live.hide[i] = 1;
        }
      }
    } else if (shape === 'vpn') {
      if (part === 1) {
        const c = centers.get(1) ?? mid;
        const [nx, ny] = rotateXY(x, y, c[0], c[1], -t * Math.PI * 1.8);
        x = nx;
        y = ny;
      }
    } else if (shape === 'ai') {
      if (part === 0) {
        x -= t * EXIT_X;
        y += t * EXIT_Y;
      } else {
        x += t * EXIT_X;
        y -= t * EXIT_Y;
      }
    } else if (shape === 'pages') {
      const home = centers.get(1) ?? mid;
      const c = centers.get(part) ?? mid;
      const spread = 1 - t;
      const yaw = (part - 1) * 0.82 * spread;
      const [rx, rz] = rotateXZ(x, z, c[0], c[2], yaw);
      x = rx + (part - 1) * 0.14 * spread;
      z = rz + (part - 1) * 0.28 * spread;
      x += (home[0] - c[0]) * t;
      y += (home[1] - c[1]) * t;
      z += (home[2] - c[2]) * t + (part - 1) * 0.12 * t;
    }

    live.x[i] = x;
    live.y[i] = y;
    live.z[i] = z;
  }
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** 0 за обоими краями, 1 на пике (блок на экране). Дальше — зеркало, обратный ход. */
function pingPong(top: number, enter: number, peak: number, gone: number) {
  if (top >= enter || top <= gone) return 0;
  if (top >= peak) return clamp01((enter - top) / (enter - peak || 1));
  return clamp01((top - gone) / (peak - gone || 1));
}

/** Поза, когда герой посажен под шапку. */
export function heroDockProgress(shape: HeroShape) {
  if (shape === 'pages' || shape === 'crm' || shape === 'support') return 1;
  if (shape === 'store') return 0.5;
  return 0;
}

/** Поза за краем экрана: 1 — снизу, -1 — сверху. */
export function heroApproachProgress(shape: HeroShape, fromDir: -1 | 1) {
  if (shape === 'pages' || shape === 'crm' || shape === 'support') return 0;
  // Update кивает при прыжке с обеих сторон. По общему правилу снизу поза
  // совпадала с позой посадки (0 и 0), и при прыжке рельсом сверху вниз
  // модель стояла на месте, а снизу вверх кивала (1 -> 0).
  if (shape === 'update') return 1;
  return fromDir > 0 ? 0 : 1;
}

/** 0 when the hero is entering or at rest, 1 when it has fully left.
 *  У pages/crm/support цикл кончается до ухода блока: после пика тот же ход назад. */
export function heroScrollProgress(surface: HTMLElement, shape: HeroShape = 'globe') {
  const rect = surface.getBoundingClientRect();
  const view = window.innerHeight;
  const open = 64;
  const gone = -rect.height;

  if (shape === 'pages') {
    const span = view * 0.92 + rect.height * 0.22;
    const peak = open;
    const enter = peak + span;
    return pingPong(rect.top, enter, peak, gone);
  }

  if (shape === 'store') {
    const enter = view * 1.2;
    if (rect.top > open) {
      return clamp01((0.5 * (enter - rect.top)) / (enter - open || 1));
    }
    return clamp01(0.5 + (0.5 * (open - rect.top)) / (open - gone || 1));
  }

  if (shape === 'crm') {
    const enter = view * 0.88;
    const peak = view * 0.12;
    return pingPong(rect.top, enter, peak, gone);
  }

  if (shape === 'support') {
    const enter = view * 0.58;
    return pingPong(rect.top, enter, open, gone);
  }

  return clamp01((open - rect.top) / (open - gone || 1));
}
