'use client';

import { useEffect, useState } from 'react';
import { infraHubPaths, siteHubPaths } from '@/content/nav';

type Listener = (hash: string) => void;

const listeners = new Set<Listener>();
let enginePath = '';
let refs = 0;
let current = '';
let stopEngine: (() => void) | null = null;

function readLocation() {
  return window.location.hash.replace(/^#/, '');
}

function emit(next: string) {
  if (next === current) return;
  current = next;
  for (const listener of listeners) listener(next);
}

function commitHub(id: string, pathname: string) {
  emit(id);
  const next = id ? `#${id}` : '';
  if (id && window.location.hash !== next) {
    history.replaceState(null, '', `${pathname}${next}`);
  }
}

function pickHeroId() {
  const sections = document.querySelectorAll<HTMLElement>('[data-hero][id]');
  let id = sections[0]?.id ?? readLocation();
  const line = window.innerHeight * 0.36;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) id = section.id;
  }
  return id;
}

function startHub(pathname: string) {
  let frame: number | null = null;
  const sync = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(() => {
      frame = null;
      commitHub(pickHeroId(), pathname);
    });
  };
  const observer = new IntersectionObserver(sync, {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
  });

  const watch = () => {
    observer.disconnect();
    document.querySelectorAll<HTMLElement>('[data-hero][id]').forEach((section) => observer.observe(section));
    sync();
  };

  watch();
  const boot = window.requestAnimationFrame(watch);
  window.addEventListener('hashchange', sync);
  window.addEventListener('resize', sync);

  return () => {
    if (frame !== null) window.cancelAnimationFrame(frame);
    window.cancelAnimationFrame(boot);
    observer.disconnect();
    window.removeEventListener('hashchange', sync);
    window.removeEventListener('resize', sync);
  };
}

function startPlain() {
  const sync = () => emit(readLocation());
  sync();
  window.addEventListener('hashchange', sync);
  return () => window.removeEventListener('hashchange', sync);
}

function retain(pathname: string, listener: Listener) {
  listeners.add(listener);
  refs += 1;

  if (enginePath !== pathname) {
    stopEngine?.();
    enginePath = pathname;
    current = '';
    const isHub = siteHubPaths.includes(pathname) || infraHubPaths.includes(pathname);
    stopEngine = isHub ? startHub(pathname) : startPlain();
  } else {
    listener(current);
  }

  return () => {
    listeners.delete(listener);
    refs -= 1;
    if (refs > 0) return;
    stopEngine?.();
    stopEngine = null;
    enginePath = '';
    current = '';
  };
}

/** Keep the hub hash in sync with the hero that is actually on screen.
 *  Header and jump rail share one observer — not two scroll listeners. */
export function useHubSectionHash(pathname: string) {
  const [hash, setHash] = useState('');

  useEffect(() => retain(pathname, setHash), [pathname]);

  return hash.startsWith('#') ? hash : hash ? `#${hash}` : '';
}
