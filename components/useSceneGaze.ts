'use client';

import { useEffect, type RefObject } from 'react';

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

const nodes = new Set<HTMLElement>();
const visible = new Set<HTMLElement>();
let observer: IntersectionObserver | null = null;
let moveOn = false;
let frame: number | null = null;
let px = 0;
let py = 0;
let finePointer = false;

function lookAt(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;
  node.style.setProperty('--look-x', clamp(((px - rect.left) / rect.width) * 2 - 1).toFixed(3));
  node.style.setProperty('--look-y', clamp(((py - rect.top) / rect.height) * 2 - 1).toFixed(3));
}

function paint() {
  frame = null;
  for (const node of visible) lookAt(node);
}

function onMove(event: PointerEvent) {
  px = event.clientX;
  py = event.clientY;
  if (frame === null) frame = requestAnimationFrame(paint);
}

function restVisible() {
  for (const node of visible) {
    node.style.setProperty('--look-x', '0.35');
    node.style.setProperty('--look-y', '0');
  }
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

/** Gaze follows the pointer across the page while the figure is on screen.
 *  First time it enters view, `data-hello` starts the free-hand wave. */
export function useSceneGaze(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    node.style.setProperty('--look-x', '0.35');
    node.style.setProperty('--look-y', '0');

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
