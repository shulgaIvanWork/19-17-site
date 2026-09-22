'use client';

import { useEffect, type RefObject } from 'react';

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

const REST_X = 0.35;
const REST_Y = 0;
const nodes = new Set<HTMLElement>();
const visible = new Set<HTMLElement>();
let observer: IntersectionObserver | null = null;
let moveOn = false;
let frame: number | null = null;
let returnFrame: number | null = null;
let px = 0;
let py = 0;
let finePointer = false;
let persist = false;
let glanceUntil = 0;
function pointIn(node: HTMLElement, x: number, y: number) {
  const rect = node.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function lookAt(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;
  node.style.setProperty('--look-x', clamp(((px - rect.left) / rect.width) * 2 - 1).toFixed(3));
  node.style.setProperty('--look-y', clamp(((py - rect.top) / rect.height) * 2 - 1).toFixed(3));
}

function restNode(node: HTMLElement) {
  node.style.setProperty('--look-x', String(REST_X));
  node.style.setProperty('--look-y', String(REST_Y));
}

function paint() {
  frame = null;
  if (!persist) return;
  for (const node of visible) lookAt(node);
}

function lerpRest() {
  returnFrame = null;
  if (persist) return;
  const now = performance.now();
  if (now < glanceUntil) {
    returnFrame = window.requestAnimationFrame(lerpRest);
    return;
  }
  let moving = false;
  for (const node of visible) {
    const x = Number.parseFloat(node.style.getPropertyValue('--look-x') || String(REST_X));
    const y = Number.parseFloat(node.style.getPropertyValue('--look-y') || String(REST_Y));
    const nx = x + (REST_X - x) * 0.14;
    const ny = y + (REST_Y - y) * 0.14;
    node.style.setProperty('--look-x', nx.toFixed(3));
    node.style.setProperty('--look-y', ny.toFixed(3));
    if (Math.abs(nx - REST_X) > 0.012 || Math.abs(ny - REST_Y) > 0.012) moving = true;
  }
  if (moving) returnFrame = window.requestAnimationFrame(lerpRest);
  else for (const node of visible) restNode(node);
}

function onMove(event: PointerEvent) {
  px = event.clientX;
  py = event.clientY;
  persist = false;
  for (const node of visible) {
    if (pointIn(node, px, py)) persist = true;
  }
  if (persist) glanceUntil = 0;
  if (frame === null) frame = requestAnimationFrame(paint);
  if (!persist && glanceUntil === 0 && returnFrame === null) {
    returnFrame = window.requestAnimationFrame(lerpRest);
  }
}

function restVisible() {
  persist = false;
  glanceUntil = 0;
  for (const node of visible) restNode(node);
}

function watchMove() {
  if (moveOn || !finePointer || visible.size === 0) return;
  moveOn = true;
  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', restVisible);
}

function dropMove() {
  if (visible.size > 0) return;
  moveOn = false;
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  if (returnFrame !== null) cancelAnimationFrame(returnFrame);
  returnFrame = null;
  window.removeEventListener('pointermove', onMove);
  document.documentElement.removeEventListener('pointerleave', restVisible);
}

function ensureObserver() {
  if (observer) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const node = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          visible.add(node);
          if (!node.hasAttribute('data-hello')) node.setAttribute('data-hello', '');
          watchMove();
        } else {
          visible.delete(node);
          dropMove();
        }
      }
    },
    { threshold: 0.18 },
  );
}

function releaseObserver() {
  if (nodes.size > 0) return;
  observer?.disconnect();
  observer = null;
  dropMove();
}

/** Взгляд следует за курсором, пока тот над фигурой. После перехода фигура
 *  косится в сторону курсора и плавно возвращается в покой. */
export function useSceneGaze(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    restNode(node);

    nodes.add(node);
    ensureObserver();
    observer?.observe(node);

    return () => {
      visible.delete(node);
      nodes.delete(node);
      observer?.unobserve(node);
      dropMove();
      releaseObserver();
    };
  }, [ref]);
}
