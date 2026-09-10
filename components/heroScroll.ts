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

function rotateXY(x: number, y: number, cx: number, cy: number, angle: number): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

function rotateYZ(y: number, z: number, cy: number, cz: number, angle: number): [number, number] {
  const dy = y - cy;
  const dz = z - cz;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [cy + dy * c - dz * s, cz + dy * s + dz * c];
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

/** Centroids are fixed for a mesh — compute once, not every frame. */
export function scrollBasis(points: Point[], parts: number[] | undefined): ScrollBasis {
  return { centers: centroids(points, parts), mid: allCentroid(points) };
}

function ease(p: number) {
  return p * p * (3 - 2 * p);
}

function flyOff(x: number, y: number, p: number): [number, number] {
  return [x + p * EXIT_X, y + p * EXIT_Y];
}

/** Scroll 0–1 drives a per-shape motion. Globe is unchanged. */
export function applyHeroScroll(
  shape: HeroShape,
  points: Point[],
  parts: number[] | undefined,
  along: number[] | undefined,
  p: number,
  live: LiveBuffers,
  basis: ScrollBasis,
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

  for (let i = 0; i < n; i++) {
    let [x, y, z] = points[i];
    const part = parts?.[i] ?? 0;

    if (shape === 'sites') {
      const click = t < 0.38 ? Math.sin((t / 0.38) * Math.PI) : 0;
      z -= click * 0.1;
      const [ny, nz] = rotateYZ(y, z, mid[1], mid[2], click * 0.32);
      y = ny;
      z = nz;
      const squash = 1 - 0.08 * click * click;
      y = mid[1] + (y - mid[1]) * squash;
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
      const c = centers.get(0) ?? mid;
      const ang = part === 0 ? t * Math.PI * 0.7 : -t * Math.PI * 0.7;
      const [nx, ny] = rotateXY(x, y, c[0], c[1], ang);
      x = nx;
      y = ny;
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

/** 0 when the hero is entering or at rest, 1 when it has fully left. */
export function heroScrollProgress(surface: HTMLElement, shape: HeroShape = 'globe') {
  const rect = surface.getBoundingClientRect();
  const view = window.innerHeight;
  const open = 64;
  const gone = -rect.height;
  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  if (shape === 'pages') {
    const enter = view * 0.92;
    const done = -rect.height * 0.22;
    return clamp((enter - rect.top) / (enter - done || 1));
  }

  if (shape === 'store') {
    const enter = view * 0.82;
    if (rect.top > open) {
      return clamp((0.5 * (enter - rect.top)) / (enter - open || 1));
    }
    return clamp(0.5 + (0.5 * (open - rect.top)) / (open - gone || 1));
  }

  if (shape === 'crm') {
    const enter = view * 0.88;
    const done = -rect.height * 0.55;
    return clamp((enter - rect.top) / (enter - done || 1));
  }

  if (shape === 'support') {
    const enter = view * 0.58;
    if (rect.top > open) {
      return clamp((enter - rect.top) / (enter - open || 1));
    }
    return 1;
  }

  return clamp((open - rect.top) / (open - gone || 1));
}
