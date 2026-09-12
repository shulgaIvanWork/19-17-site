'use client';

import { useEffect, useRef } from 'react';
import { Photo } from '@/components/ui/Photo';
import type { Founder } from '@/content/team';
import styles from './TeamCarousel.module.css';

const COPIES = 3;
/** From the screen midpoint to the edge the strip should advance this many people. */
const DRAG_PEOPLE = 0.8;
const SNAP_MS = 880;
const SNAP_EASE = 'cubic-bezier(0.22, 1, 0.32, 1)';

type Drag = {
  pointerId: number;
  x: number;
  y: number;
  origin: number;
  gain: number;
  axis: 'none' | 'x' | 'y';
};

export function TeamCarousel({ people }: { people: Founder[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const drag = useRef<Drag | null>(null);
  const wrapTimer = useRef<number | null>(null);

  const slides = Array.from({ length: COPIES }, (_, copy) =>
    people.map((person) => ({ person, copy, key: `${copy}-${person.image.id}` })),
  ).flat();

  const stride = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-team-card]');
    if (!track || !card) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const loop = () => stride() * people.length;

  const dragGain = () => {
    const step = stride();
    const halfScreen = window.innerWidth / 2;
    if (step <= 0 || halfScreen <= 0) return 1;
    return (DRAG_PEOPLE * step) / halfScreen;
  };

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const paint = (next: number, animate: boolean, ms = SNAP_MS) => {
    const track = trackRef.current;
    if (!track) return;
    offsetRef.current = next;
    track.style.transition = animate && !reduced() ? `transform ${ms}ms ${SNAP_EASE}` : 'none';
    track.style.transform = `translate3d(${-next}px, 0, 0)`;
  };

  const wrapQuiet = (value: number) => {
    const width = loop();
    if (width <= 0) return value;
    let next = value;
    while (next < width) next += width;
    while (next >= width * 2) next -= width;
    return next;
  };

  const settle = (value: number, animate: boolean) => {
    const step = stride();
    if (step <= 0) return;
    const snapped = Math.round(value / step) * step;
    const dist = Math.abs(snapped - value) / step;
    const ms = Math.round(640 + dist * 420);
    paint(snapped, animate, ms);
    if (wrapTimer.current !== null) window.clearTimeout(wrapTimer.current);
    wrapTimer.current = window.setTimeout(
      () => {
        const wrapped = wrapQuiet(offsetRef.current);
        if (wrapped !== offsetRef.current) paint(wrapped, false);
        wrapTimer.current = null;
      },
      animate && !reduced() ? ms + 16 : 0,
    );
  };

  useEffect(() => {
    const start = () => {
      const width = loop();
      if (width > 0) paint(width, false);
    };
    start();
    const view = viewportRef.current;
    const ro = view ? new ResizeObserver(start) : null;
    if (view) ro?.observe(view);
    return () => {
      ro?.disconnect();
      if (wrapTimer.current !== null) window.clearTimeout(wrapTimer.current);
    };
  }, [people.length]);

  const step = (direction: -1 | 1) => {
    const width = stride();
    if (width <= 0) return;
    settle(offsetRef.current + direction * width, true);
  };

  return (
    <div className={styles.rail} role="region" aria-label="Команда разработки">
      <button
        type="button"
        className={styles.arrow}
        data-side="prev"
        aria-label="Показать предыдущих"
        data-cursor-skip
        onClick={() => step(-1)}
      >
        <Chevron dir="prev" />
      </button>
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          if (wrapTimer.current !== null) {
            window.clearTimeout(wrapTimer.current);
            wrapTimer.current = null;
          }
          paint(wrapQuiet(offsetRef.current), false);
          drag.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            origin: offsetRef.current,
            gain: dragGain(),
            axis: 'none',
          };
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start || event.pointerId !== start.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (start.axis === 'none') {
            if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            start.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
            if (start.axis === 'x') viewportRef.current?.setPointerCapture(event.pointerId);
          }
          if (start.axis !== 'x') return;
          paint(wrapQuiet(start.origin - dx * start.gain), false);
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          if (!start || event.pointerId !== start.pointerId) {
            drag.current = null;
            return;
          }
          if (start.axis === 'x') {
            viewportRef.current?.releasePointerCapture(event.pointerId);
            settle(offsetRef.current, true);
          }
          drag.current = null;
        }}
        onPointerCancel={() => {
          const start = drag.current;
          if (start?.axis === 'x') settle(offsetRef.current, true);
          drag.current = null;
        }}
      >
        <div ref={trackRef} className={styles.track}>
          {slides.map(({ person, copy, key }) => (
            <article key={key} className={styles.card} data-team-card aria-hidden={copy !== 1 || undefined}>
              <Photo slot={person.image} ground="white" />
              <h3 className="h3" style={{ marginTop: 16 }}>
                {person.name}
              </h3>
              <div className="label">{person.role}</div>
              <p className="body" style={{ marginTop: 10 }}>
                {person.body}
              </p>
            </article>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.arrow}
        data-side="next"
        aria-label="Показать следующих"
        data-cursor-skip
        onClick={() => step(1)}
      >
        <Chevron dir="next" />
      </button>
    </div>
  );
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {dir === 'prev' ? <path d="M14 6l-6 6 6 6" /> : <path d="M10 6l6 6-6 6" />}
    </svg>
  );
}
