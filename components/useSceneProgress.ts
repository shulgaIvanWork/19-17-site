'use client';

import { useEffect, type RefObject } from 'react';

/** Scene is in view before the sort starts, and the pose lands while the
 *  picture is still fully on screen. Ease-out so the last frames arrive a
 *  little early and then hold — visible process, no leftover scrub. */
const START = 0.98;
const END = 0.18;

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}
const nodes = new Set<HTMLElement>();
let frame: number | null = null;
let attached = false;

function write() {
  frame = null;
  const view = window.innerHeight;
  const start = view * START;
  const end = view * END;
  const span = start - end || 1;
  for (const node of nodes) {
    const top = node.getBoundingClientRect().top;
    const raw = Math.min(1, Math.max(0, (start - top) / span));
    const next = easeOut(raw);
    node.style.setProperty('--scene-p', next.toFixed(4));
  }
}

function onScroll() {
  if (frame === null) frame = requestAnimationFrame(write);
}

function ensure() {
  if (attached) return;
  attached = true;
  write();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

function release() {
  if (nodes.size > 0) return;
  attached = false;
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
}

export function useSceneProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.style.setProperty('--scene-p', '1');
      return;
    }

    nodes.add(node);
    ensure();
    write();
    return () => {
      nodes.delete(node);
      release();
    };
  }, [ref]);
}
