'use client';

import { useEffect, useRef } from 'react';
import { applyHeroScroll, heroApproachProgress, heroDockProgress, heroScrollProgress, scrollBasis, type LiveBuffers } from './heroScroll';
import { isLetterShape, type HeroShape, type Mesh } from './heroTypes';
import { HUB_POSE_MS, hubJumpDir, hubRailBlocksLook, isHubJumping, onHubJumpEnd, onHubJumpStart, pinnedHubSection } from '@/components/nav/hubNav';

const meshCache = new Map<string, Promise<Mesh>>();
let pointerX = Number.NaN;
let pointerY = Number.NaN;
let pointerBound = false;

function rememberPointer(clientX: number, clientY: number) {
  pointerX = clientX;
  pointerY = clientY;
}

function bindPointer() {
  if (pointerBound) return;
  pointerBound = true;
  window.addEventListener(
    'pointermove',
    (event) => rememberPointer(event.clientX, event.clientY),
    { passive: true },
  );
}

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
const SHAPE_FIT: Partial<Record<HeroShape, { scale?: number; dy?: number }>> = {
  // Магазин ближе к кнопкам (по просьбе заказчика, 2026-09-11).
  store: { dy: 0.05 },
  // Курсор лендинга тоже ближе к кнопкам (по просьбе заказчика, 2026-09-11).
  sites: { dy: 0.05 },
};

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
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: false });
    if (!ctx) return;

    const letters = isLetterShape(shape);
    const coarse = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    // Глобус главной не режем: у букв `nodes` раньше вообще не влиял на сетку.
    const count =
      shape === 'globe'
        ? Math.max(40, Math.min(240, Math.round(nodes)))
        : Math.max(36, Math.min(240, Math.round(nodes * (coarse ? 0.4 : 1))));
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
  const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

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
  let jumpTween = false;
  let jumpFrom = 0;
  let jumpTo = 0;
  let jumpT0 = 0;
  let jumpId = '';
  const JUMP_MS = HUB_POSE_MS;
  const beginJumpPose = (id: string, dir: -1 | 1) => {
    if (shape === 'globe') return;
    const isDest = Boolean(id) && surface.id === id;
    const destChanged = jumpId !== id;
    jumpId = id;
    if (isDest) {
      jumpTo = heroDockProgress(shape);
      jumpFrom = destChanged ? heroApproachProgress(shape, dir) : scrollShown;
    } else {
      jumpTo = heroApproachProgress(shape, dir > 0 ? -1 : 1);
      jumpFrom = scrollShown;
    }
    if (Math.abs(jumpTo - jumpFrom) < 0.012) {
      jumpTween = false;
      scrollShown = jumpTo;
      return;
    }
    jumpT0 = performance.now();
    jumpTween = true;
    scrollShown = jumpFrom;
  };
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
    const lite = letters && mobile;
    ctx.lineWidth = lite ? 1.15 : 1.4;
    const buckets = lite ? 4 : 12;
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

    if (!lite) {
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
    }
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const restBudget = !letters ? (mobile ? 33 : 16) : mobile ? 22 : 16;
  const dragGain = 0.0016;
  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let persistLook = false;
  let glanceUntil = 0;
  let lastScrollY = window.scrollY;
  let calmUntil = 0;
  let paintBudget = restBudget;
  let baseYaw = restYaw;
  let basePitch = restPitch;
  const lookAmpYaw = letters ? 0.34 : 0.4;
  const lookAmpPitch = letters ? 0.15 : 0.18;

  const pointIn = (rect: DOMRect, clientX: number, clientY: number) =>
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

  const lookFromPoint = (clientX: number, clientY: number) => {
    const rect = host.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const nx = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));
    lookYaw = nx * lookAmpYaw;
    lookPitch = ny * lookAmpPitch;
  };

  const applyLook = (clientX: number, clientY: number) => {
    rememberPointer(clientX, clientY);
    if (hubRailBlocksLook(clientX, clientY)) {
      hovering = false;
      persistLook = false;
      return;
    }
    const over = pointIn(host.getBoundingClientRect(), clientX, clientY);
    hovering = over;
    persistLook = over;
    if (!over) return;
    glanceUntil = 0;
    lookFromPoint(clientX, clientY);
  };

  const applyDrag = (dx: number, dy: number) => {
    orbitYaw += dx * dragGain;
    orbitPitch += dy * dragGain;
  };

  const pose = () => {
    if (letters) {
      const idle = dragging || hovering || reduced || mobile ? 0 : 1;
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
    const coarseNow = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const cap = coarseNow ? 1 : (letters || rect.width < 768 ? 1.25 : 1.5);
    const dpr = Math.min(cap, window.devicePixelRatio || 1);
    const nextW = Math.round(rect.width * dpr);
    const nextH = Math.round(rect.height * dpr);
    w = rect.width;
    h = rect.height;
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
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
      return;
    }
    if (shape !== 'globe' && !reduced && isHubJumping() && !jumpTween) {
      const dest = pinnedHubSection();
      const dir = hubJumpDir();
      if (dest && dir) beginJumpPose(dest, dir);
    }
    resize();
    if (reduced) return;
    if (frame === null) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }
  };

  const viewFromRect = () => {
    const rect = host.getBoundingClientRect();
    const slop = window.innerHeight * (mobile ? 0.18 : 0.45);
    return rect.width > 1 && rect.height > 1 && rect.bottom > -slop && rect.top < window.innerHeight + slop;
  };

  const resizeObserver = new ResizeObserver(() => {
    if (inView) resize();
  });
  resizeObserver.observe(host);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      setVisible(entries[0].isIntersecting);
    },
    { root: null, rootMargin: mobile ? '18% 0px' : '45% 0px', threshold: 0 },
  );
  intersectionObserver.observe(host);
  setVisible(viewFromRect());
  bindPointer();
  const startGlance = () => {
    if (reduced || !inView || jumpTween || !Number.isFinite(pointerX)) return;
    persistLook = false;
    hovering = false;
    lookFromPoint(pointerX, pointerY);
    glanceUntil = performance.now() + 720;
  };
  const onJump = () => {
    setVisible(viewFromRect());
  };
  const stopJump = onHubJumpEnd(onJump);
  const stopJumpStart = onHubJumpStart((id, dir) => {
    glanceUntil = 0;
    persistLook = false;
    hovering = false;
    beginJumpPose(id, dir);
    if (surface.id === id && !jumpTween) startGlance();
  });
  if (isHubJumping()) {
    const dest = pinnedHubSection();
    const dir = hubJumpDir();
    if (dest && dir) {
      beginJumpPose(dest, dir);
      if (surface.id === dest && !jumpTween) startGlance();
    }
  }

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
    rememberPointer(event.clientX, event.clientY);
    if (dragging || reduced || !inView) return;
    applyLook(event.clientX, event.clientY);
  };

  function loop(now: number) {
    if (!visible) {
      frame = null;
      return;
    }
    frame = requestAnimationFrame(loop);
    const dt = now - last;
    const scrollY = window.scrollY;
    const speed = Math.abs(scrollY - lastScrollY) / Math.max(dt, 1);
    lastScrollY = scrollY;
    if (jumpTween) {
      paintBudget = restBudget;
    } else if (speed > 18) {
      paintBudget = 45;
      calmUntil = now + 120;
    } else if (now < calmUntil || speed > 10) {
      paintBudget = 32;
    } else {
      paintBudget = restBudget;
    }
    if (dt < paintBudget - 1) return;
    last = now;
    const step = Math.min(48, dt);
    if (!jumpTween && !dragging && !persistLook && now >= glanceUntil) {
      lookYaw = follow(lookYaw, 0, step, 260);
      lookPitch = follow(lookPitch, 0, step, 260);
    }
    const destYaw = dragging ? baseYaw + orbitYaw : baseYaw + lookYaw;
    const destPitch = dragging ? basePitch + orbitPitch : basePitch + lookPitch;
    yaw = follow(yaw, destYaw, step, 130);
    pitch = follow(pitch, destPitch, step, 130);
    tick += step / 16.67;
    if (!letters && !reduced) spin += 0.0016 * (step / 16.67);
    if (jumpTween) {
      const t = Math.min(1, (now - jumpT0) / JUMP_MS);
      const eased = t * t * (3 - 2 * t);
      scrollShown = jumpFrom + (jumpTo - jumpFrom) * eased;
      if (t >= 1) {
        jumpTween = false;
        if (jumpId && surface.id === jumpId) startGlance();
      }
    } else if (shape !== 'globe' && !reduced) {
      scrollP = heroScrollProgress(surface, shape);
      scrollShown = follow(scrollShown, scrollP, step, 240);
    }
    if (
      letters &&
      mobile &&
      !jumpTween &&
      !dragging &&
      Math.abs(yaw - destYaw) < 0.004 &&
      Math.abs(pitch - destPitch) < 0.004 &&
      Math.abs(scrollShown - scrollP) < 0.006
    ) {
      return;
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
    stopJump();
    stopJumpStart();
    releaseBuffer();
  };
}
