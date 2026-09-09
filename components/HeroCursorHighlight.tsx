'use client';

import { useEffect } from 'react';

/** Writes --mx / --my / --mo on every hero as the pointer moves, which drives
 *  the radial highlight in Hero.module.css. Mounted once in the layout: one
 *  listener for the whole site, and no React re-render per pointer move.
 *
 *  Two details carried over from the prototype, both of which were bugs there
 *  first: the rAF token is a closure-local (an instance field broke on hot
 *  reload), and the leave handler sits on documentElement, because a window
 *  `pointerleave` does not fire reliably. */
export function HeroCursorHighlight({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame: number | null = null;
    let px = 0;
    let py = 0;

    const paint = () => {
      frame = null;
      document.querySelectorAll<HTMLElement>('[data-hero]').forEach((hero) => {
        const rect = hero.getBoundingClientRect();
        const inside = px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
        hero.style.setProperty('--mo', inside ? '1' : '0');
        if (inside) {
          hero.style.setProperty('--mx', `${(((px - rect.left) / rect.width) * 100).toFixed(2)}%`);
          hero.style.setProperty('--my', `${(((py - rect.top) / rect.height) * 100).toFixed(2)}%`);
        }
      });
    };

    const onMove = (event: PointerEvent) => {
      px = event.clientX;
      py = event.clientY;
      if (frame === null) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      document
        .querySelectorAll<HTMLElement>('[data-hero]')
        .forEach((hero) => hero.style.setProperty('--mo', '0'));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return null;
}
