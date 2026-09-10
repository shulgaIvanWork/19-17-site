'use client';

import { useEffect, useRef } from 'react';
import { applyHeroScroll, heroScrollProgress, scrollBasis, type LiveBuffers } from './heroScroll';
import { isLetterShape, type HeroShape, type Mesh } from './heroTypes';

const meshCache = new Map<string, Promise<Mesh>>();

function loadMesh(shape: HeroShape, count: number) {
  const key = `${shape}:${count}`;
  const hit = meshCache.get(key);
  if (hit) return hit;
  const pending = isLetterShape(shape)
    ? import('./heroShapes').then((mod) => mod.meshForShape(shape, count))
    : import('./heroGlobe').then((mod) => mod.globeMesh(count));
  meshCache.set(key, pending);
  return pending;
}

/** Wireframe object in the hero. Home is the original Fibonacci globe and is
 *  left as-is. Service pages reuse the same projection and size. Drag orbits
 *  any mesh without an angle cap. The globe still idle-spins when the pointer
 *  is up.
 *
 *  Three behaviours the original notes call out and this keeps:
 *   - ResizeObserver drives sizing AND calls draw (first layout is 0×0, so
 *     painting has to be tied to sizing rather than to the first frame);
 *   - IntersectionObserver pauses the loop off-screen;
 *   - prefers-reduced-motion skips idle motion but still allows drag. */

/** Общий размер моделей в героях: рамка модели вписывается в прямоугольник
 *  FIT_HEIGHT x FIT_WIDTH от холста, центр рамки - на FIT_CENTER_Y высоты.
 *  Поправки отдельных моделей - в SHAPE_FIT (scale - множитель размера,
 *  dy - сдвиг центра в долях высоты). Глобус главной сюда не входит. */
const FIT_HEIGHT = 0.58;
const FIT_WIDTH = 0.62;
// Уже 768 px модель упирается в ширину: даем ей почти всю, как было до общего правила.
const FIT_WIDTH_NARROW = 0.88;
const FIT_CENTER_Y = 0.47;
// Пример: pages: { scale: 1.1, dy: -0.02 }. Сейчас общего правила хватает всем.
const SHAPE_FIT: Partial<Record<HeroShape, { scale?: number; dy?: number }>> = {};

type Props = {
  nodes?: number;
  /** Line/node colour as an "r,g,b" triple. Electric Blue by default. */
  ink?: string;
  shape?: HeroShape;
};

export function HeroObject({ nodes = 110, ink = '46,88,236', shape = 'globe' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const letters = isLetterShape(shape);
    const count = Math.max(40, Math.min(240, Math.round(nodes)));
    let cancelled = false;
    let cleanup = () => {};

    loadMesh(shape, count).then((mesh) => {
      if (cancelled) return;
      cleanup = startHero(host, canvas, ctx, mesh, {
        letters,
        ink,
        shape,
        restYaw: letters ? 0 : 0.6,
        restPitch: letters ? 0 : -0.12,
      });
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [nodes, ink, shape]);

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        draggable={false}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}

function startHero(
  host: HTMLDivElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  mesh: Mesh,
  opts: { letters: boolean; ink: string; shape: HeroShape; restYaw: number; restPitch: number },
) {
  const { points, edges, parts, along } = mesh;
  const { letters, ink, shape, restYaw, restPitch } = opts;
  const basis = scrollBasis(points, parts);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const meshWidth = Math.max(0.001, maxX - minX);
  const meshHeight = Math.max(0.001, maxY - minY);
  // Модель вращается и вписывается вокруг центра своей рамки, а не начала координат.
  const midX = letters ? (minX + maxX) / 2 : 0;
  const midY = letters ? (minY + maxY) / 2 : 0;
  const fit = SHAPE_FIT[shape];

  const projectedX = new Float32Array(points.length);
  const projectedY = new Float32Array(points.length);
  const projectedZ = new Float32Array(points.length);
  const live: LiveBuffers = {
    x: new Float32Array(points.length),
    y: new Float32Array(points.length),
    z: new Float32Array(points.length),
    hide: new Uint8Array(points.length),
  };
  const surface = host.closest<HTMLElement>('[data-hero]') ?? host;
  let scrollP = 0;
  let scrollShown = 0;
  let lookYaw = 0;
  let lookPitch = 0;
  let orbitYaw = 0;
  let orbitPitch = 0;
  let hovering = false;

  let w = 0;
  let h = 0;
  let yaw = restYaw;
  let pitch = restPitch;
  let spin = 0;
  let tick = 0;
  let visible = false;
  let last = performance.now();
  let frame: number | null = null;

  const follow = (current: number, target: number, dt: number, tau: number) =>
    current + (target - current) * (1 - Math.exp(-dt / tau));

  const draw = (drawYaw: number, drawPitch: number) => {
    if (!w || !h) return;
    applyHeroScroll(shape, points, parts, along, scrollShown, live, basis);
    const focal = 2.6;
    const camZ = 3.4;
    const cx = w / 2;
    const cy = letters ? h * (FIT_CENTER_Y + (fit?.dy ?? 0)) : h / 2;
    // focal / camZ - перспектива в плоскости z = 0: на нее делится, чтобы рамка
    // модели на экране совпала с прямоугольником FIT.
    const scale = letters
      ? (Math.min((h * FIT_HEIGHT) / meshHeight, (w * (w < 768 ? FIT_WIDTH_NARROW : FIT_WIDTH)) / meshWidth) /
          (focal / camZ)) *
        (fit?.scale ?? 1)
      : Math.min(w, h) * 0.44;
    const sy = Math.sin(drawYaw);
    const cyw = Math.cos(drawYaw);
    const sp = Math.sin(drawPitch);
    const cp = Math.cos(drawPitch);

    for (let i = 0; i < points.length; i++) {
      if (live.hide[i]) continue;
      const x = live.x[i] - midX;
      const y = live.y[i] - midY;
      const z = live.z[i];
      const x1 = x * cyw - z * sy;
      const z1 = x * sy + z * cyw;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const k = (focal / (camZ + z2)) * scale;
      projectedX[i] = cx + x1 * k;
      projectedY[i] = cy + y2 * k;
      projectedZ[i] = z2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.4;
    const buckets = 12;
    const edgeAlphaMax = 0.3;
    const pointAlphaMax = 0.58;
    const edgePaths = Array.from({ length: buckets }, () => new Path2D());
    const pointPaths = Array.from({ length: buckets }, () => new Path2D());
    const edgeUsed = new Uint8Array(buckets);
    const pointUsed = new Uint8Array(buckets);
    for (const [i, j] of edges) {
      if (live.hide[i] || live.hide[j]) continue;
      const az = projectedZ[i];
      const bz = projectedZ[j];
      const alpha = 0.14 * (1 - ((az + bz) / 2 + 1) / 2.9);
      if (alpha <= 0.005) continue;
      const bucket = Math.min(buckets - 1, Math.floor((alpha / edgeAlphaMax) * buckets));
      edgePaths[bucket].moveTo(projectedX[i], projectedY[i]);
      edgePaths[bucket].lineTo(projectedX[j], projectedY[j]);
      edgeUsed[bucket] = 1;
    }
    edgePaths.forEach((path, bucket) => {
      if (!edgeUsed[bucket]) return;
      const alpha = edgeAlphaMax * ((bucket + 0.5) / buckets);
      ctx.strokeStyle = `rgba(${ink},${alpha.toFixed(3)})`;
      ctx.stroke(path);
    });

    for (let i = 0; i < points.length; i++) {
      if (live.hide[i]) continue;
      const alpha = 0.34 * (1 - (projectedZ[i] + 1) / 2.9);
      if (alpha <= 0.005) continue;
      const bucket = Math.min(buckets - 1, Math.floor((alpha / pointAlphaMax) * buckets));
      pointPaths[bucket].moveTo(projectedX[i] + 1.7, projectedY[i]);
      pointPaths[bucket].arc(projectedX[i], projectedY[i], 1.7, 0, Math.PI * 2);
      pointUsed[bucket] = 1;
    }
    pointPaths.forEach((path, bucket) => {
      if (!pointUsed[bucket]) return;
      const alpha = pointAlphaMax * ((bucket + 0.5) / buckets);
      ctx.fillStyle = `rgba(${ink},${alpha.toFixed(3)})`;
      ctx.fill(path);
    });
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const frameBudget = mobile ? 33 : 16;
  const dragGain = 0.0016;
  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let baseYaw = restYaw;
  let basePitch = restPitch;
  const lookAmpYaw = letters ? 0.34 : 0.4;
  const lookAmpPitch = letters ? 0.15 : 0.18;

  const applyLook = (clientX: number, clientY: number) => {
    const rect = surface.getBoundingClientRect();
    const inside =
      clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    hovering = inside;
    if (!inside) {
      lookYaw = 0;
      lookPitch = 0;
      return;
    }
    const nx = ((clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    const ny = ((clientY - rect.top) / (rect.height || 1)) * 2 - 1;
    lookYaw = nx * lookAmpYaw;
    lookPitch = ny * lookAmpPitch;
  };

  const applyDrag = (dx: number, dy: number) => {
    orbitYaw += dx * dragGain;
    orbitPitch += dy * dragGain;
  };

  const pose = () => {
    if (letters) {
      const idle = dragging || hovering || reduced ? 0 : 1;
      const idleYaw = Math.sin(tick * 0.0032) * 0.08 * idle;
      const idlePitch = Math.cos(tick * 0.0026) * 0.035 * idle;
      return { yaw: yaw + idleYaw, pitch: pitch + idlePitch };
    }
    return { yaw: yaw + spin, pitch };
  };

  const paint = () => {
    if (!w || !h) return;
    const next = pose();
    draw(next.yaw, next.pitch);
  };

  const releaseBuffer = () => {
    if (canvas.width <= 1 && canvas.height <= 1) {
      w = 0;
      h = 0;
      return;
    }
    canvas.width = 1;
    canvas.height = 1;
    w = 0;
    h = 0;
  };

  const resize = () => {
    if (!inView) return;
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const narrow = rect.width < 768;
    const cap = letters || narrow ? 1.25 : 1.5;
    const dpr = Math.min(cap, window.devicePixelRatio || 1);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  };

  let inView = false;
  const setVisible = (nextInView?: boolean) => {
    if (typeof nextInView === 'boolean') inView = nextInView;
    visible = inView && document.visibilityState !== 'hidden';
    if (!visible) {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      releaseBuffer();
      return;
    }
    resize();
    if (reduced) return;
    if (frame === null) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }
  };

  const resizeObserver = new ResizeObserver(() => {
    if (inView) resize();
  });
  resizeObserver.observe(host);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      setVisible(entries[0].isIntersecting);
    },
    { root: null, rootMargin: '0px', threshold: 0 },
  );
  intersectionObserver.observe(host);

  const onVisibility = () => setVisible();
  document.addEventListener('visibilitychange', onVisibility);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    host.dataset.dragging = 'true';
    try {
      host.setPointerCapture(event.pointerId);
    } catch {
      /* capture is optional */
    }
    event.preventDefault();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (dragging) {
      applyDrag(event.clientX - lastPointerX, event.clientY - lastPointerY);
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      return;
    }
    if (!reduced) applyLook(event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    baseYaw += orbitYaw;
    basePitch += orbitPitch;
    orbitYaw = 0;
    orbitPitch = 0;
    delete host.dataset.dragging;
    if (host.hasPointerCapture(event.pointerId)) {
      host.releasePointerCapture(event.pointerId);
    }
  };

  const onWindowMove = (event: PointerEvent) => {
    if (dragging || reduced || !inView) return;
    applyLook(event.clientX, event.clientY);
  };

  function loop(now: number) {
    if (!visible) {
      frame = null;
      return;
    }
    frame = requestAnimationFrame(loop);
    const dt = Math.min(32, now - last);
    if (dt < frameBudget - 1) return;
    last = now;
    const destYaw = dragging ? baseYaw + orbitYaw : baseYaw + lookYaw;
    const destPitch = dragging ? basePitch + orbitPitch : basePitch + lookPitch;
    yaw = follow(yaw, destYaw, dt, 130);
    pitch = follow(pitch, destPitch, dt, 130);
    tick += dt / 16.67;
    if (!letters && !reduced) spin += 0.0016 * (dt / 16.67);
    if (shape !== 'globe' && !reduced) {
      scrollP = heroScrollProgress(surface, shape);
      scrollShown = follow(scrollShown, scrollP, dt, 240);
    }
    paint();
  }

  const canDrag = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canDrag) {
    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerup', onPointerUp);
    host.addEventListener('pointercancel', onPointerUp);
    host.addEventListener('lostpointercapture', onPointerUp);
    window.addEventListener('pointermove', onWindowMove, { passive: true });
  }

  if (!reduced && visible) {
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (canDrag) {
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      host.removeEventListener('lostpointercapture', onPointerUp);
      window.removeEventListener('pointermove', onWindowMove);
    }
    document.removeEventListener('visibilitychange', onVisibility);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    releaseBuffer();
  };
}
