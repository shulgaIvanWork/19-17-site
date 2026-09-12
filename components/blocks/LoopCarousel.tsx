'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';
import styles from './LoopCarousel.module.css';

const DRAG_SLIDES = 0.85;
const SNAP_EASE = 'cubic-bezier(0.22, 1, 0.32, 1)';

type Drag = {
  pointerId: number;
  x: number;
  y: number;
  origin: number;
  gain: number;
  axis: 'none' | 'x' | 'y';
};

type Props = {
  children: ReactNode;
  /** pair — 2–3 карточки в кадре, one — одна с подсказкой следующей. */
  peek?: 'pair' | 'one';
  label?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Карусель для мобильной вёрстки. На широком экране не показывается.
 *  Крайние карточки — тупик: дальше не крутит. */
export function LoopCarousel({ children, peek = 'pair', label }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const drag = useRef<Drag | null>(null);
  const items = Children.toArray(children);

  const stride = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-loop-card]');
    if (!track || !card) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  /** Сколько можно сдвинуть, чтобы последняя карточка упёрлась в правый край
   *  видимой области — без пустого слота за ней. */
  const maxOffset = () => {
    const track = trackRef.current;
    const view = viewportRef.current;
    if (!track || !view) return 0;
    const cards = track.querySelectorAll<HTMLElement>('[data-loop-card]');
    if (cards.length === 0) return 0;
    const first = cards[0].getBoundingClientRect();
    const last = cards[cards.length - 1].getBoundingClientRect();
    const style = getComputedStyle(view);
    const padL = Number.parseFloat(style.paddingLeft) || 0;
    const padR = Number.parseFloat(style.paddingRight) || 0;
    const inner = view.clientWidth - padL - padR;
    return Math.max(0, last.right - first.left - inner);
  };

  const dragGain = () => {
    const step = stride();
    const halfScreen = window.innerWidth / 2;
    if (step <= 0 || halfScreen <= 0) return 1;
    return (DRAG_SLIDES * step) / halfScreen;
  };

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resist = (value: number) => {
    const max = maxOffset();
    if (value < 0) return value * 0.32;
    if (value > max) return max + (value - max) * 0.32;
    return value;
  };

  const paint = (next: number, animate: boolean, ms = 720) => {
    const track = trackRef.current;
    if (!track) return;
    offsetRef.current = next;
    track.style.transition = animate && !reduced() ? `transform ${ms}ms ${SNAP_EASE}` : 'none';
    track.style.transform = `translate3d(${-next}px, 0, 0)`;
  };

  const settle = (value: number, animate: boolean) => {
    const step = stride();
    const max = maxOffset();
    if (step <= 0) {
      paint(0, animate);
      return;
    }
    const card = clamp(Math.round(value / step) * step, 0, max);
    const snapped = Math.abs(value - max) < Math.abs(value - card) ? max : card;
    const dist = Math.abs(snapped - value) / step;
    const ms = Math.round(420 + dist * 280);
    paint(snapped, animate, ms);
  };

  useEffect(() => {
    const start = () => paint(clamp(offsetRef.current, 0, maxOffset()), false);
    start();
    const view = viewportRef.current;
    const ro = view ? new ResizeObserver(start) : null;
    if (view) ro?.observe(view);
    return () => ro?.disconnect();
  }, [items.length, peek]);

  if (items.length < 2) return <div className={styles.single}>{children}</div>;

  return (
    <div className={styles.wrap} role="region" aria-label={label} aria-roledescription="карусель">
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          paint(offsetRef.current, false);
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
          paint(resist(start.origin - dx * start.gain), false);
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
          {items.map((child, index) => (
            <div key={index} className={styles.slide} data-loop-card data-peek={peek}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
