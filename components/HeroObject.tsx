'use client';

import { useEffect, useRef } from 'react';

/** The Home hero's wireframe object — a port of the bundle's `hero-object.js`
 *  custom element into a React component, so nothing has to register a custom
 *  element during SSR. The maths, constants and alpha budget are unchanged:
 *  ~110 Fibonacci-sphere points, each linked to its three nearest neighbours,
 *  perspective-projected and depth-faded in Carbon Dark.
 *
 *  Three behaviours the original notes call out and this keeps:
 *   - ResizeObserver drives sizing AND calls draw (first layout is 0×0, so
 *     painting has to be tied to sizing rather than to the first frame);
 *   - IntersectionObserver pauses the loop off-screen;
 *   - prefers-reduced-motion renders a single static frame and stops. */

type Props = {
  nodes?: number;
  /** Line/node colour as an "r,g,b" triple. Carbon Dark by default. */
  ink?: string;
  /** Maximum lean toward the pointer, in radians. */
  sway?: number;
};

function fibonacciSphere(n: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = phi * i;
    points.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return points;
}

function nearestEdges(points: [number, number, number][], k: number): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    const distances: [number, number][] = [];
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const dz = points[i][2] - points[j][2];
      distances.push([dx * dx + dy * dy + dz * dz, j]);
    }
    distances.sort((a, b) => a[0] - b[0]);
    for (let m = 0; m < k && m < distances.length; m++) {
      const j = distances[m][1];
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }
  return edges;
}

export function HeroObject({ nodes = 110, ink = '23,26,32', sway = 0.38 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = Math.max(40, Math.min(220, Math.round(nodes)));
    const points = fibonacciSphere(count);
    const edges = nearestEdges(points, 3);

    let w = 0;
    let h = 0;
    let yaw = 0.6;
    let pitch = -0.12;
    let targetYaw = 0.6;
    let targetPitch = -0.12;
    let spin = 0;
    let visible = true;

    const draw = () => {
      if (!w || !h) return;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.44;
      const focal = 2.6;
      const camZ = 3.4;
      const sy = Math.sin(yaw + spin);
      const cyw = Math.cos(yaw + spin);
      const sp = Math.sin(pitch);
      const cp = Math.cos(pitch);

      const projected = points.map(([x, y, z]) => {
        const x1 = x * cyw - z * sy;
        const z1 = x * sy + z * cyw;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const k = (focal / (camZ + z2)) * scale;
        return [cx + x1 * k, cy + y2 * k, z2] as [number, number, number];
      });

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = projected[i];
        const b = projected[j];
        const alpha = 0.14 * (1 - ((a[2] + b[2]) / 2 + 1) / 2.9);
        if (alpha <= 0.005) continue;
        ctx.strokeStyle = `rgba(${ink},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      for (const p of projected) {
        const alpha = 0.34 * (1 - (p[2] + 1) / 2.9);
        if (alpha <= 0.005) continue;
        ctx.fillStyle = `rgba(${ink},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    intersectionObserver.observe(host);

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width) return;
      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      targetYaw = 0.6 + nx * sway;
      targetPitch = -0.12 + ny * sway * 0.55;
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      return () => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
      };
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let frame: number | null = requestAnimationFrame(function tick() {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      spin += 0.0016;
      yaw += (targetYaw - yaw) * 0.045;
      pitch += (targetPitch - pitch) * 0.045;
      draw();
    });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [nodes, ink, sway]);

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
