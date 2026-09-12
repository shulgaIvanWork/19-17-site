'use client';

import { useEffect } from 'react';

/** Clickable controls must not pick up the cursor wash: the spotlight would
 *  sit on the control and tint its hover. Card photos stay out of this list
 *  on purpose - they are links, but the glow on the illustration is wanted. */
const CURSOR_SKIP =
  'button, a.btn, .navbtn, .menurow, .actionlink, [role="button"], [data-cursor-skip], input, select, textarea, summary, [data-header-glow] a';

/** Writes --mx / --my / --mo on highlighted surfaces as the pointer moves.
 *  Mounted once in the layout: one listener for the whole site, and no React
 *  re-render per pointer move.
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
    let active: HTMLElement | null = null;

    const dim = (surface: HTMLElement | null) => {
      if (!surface) return;
      surface.style.setProperty('--mo', '0');
    };

    const paint = () => {
      frame = null;
      const hit = document.elementFromPoint(px, py);
      if (hit?.closest(CURSOR_SKIP)) {
        dim(active);
        active = null;
        return;
      }
      const next = hit?.closest<HTMLElement>('[data-hero], [data-header-glow], [data-cursor-glow]') ?? null;
      if (next !== active) {
        dim(active);
        active = next;
      }
      if (!active) return;
      const rect = active.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        dim(active);
        return;
      }
      active.style.setProperty('--mo', '1');
      active.style.setProperty('--mx', `${(((px - rect.left) / rect.width) * 100).toFixed(2)}%`);
      active.style.setProperty('--my', `${(((py - rect.top) / rect.height) * 100).toFixed(2)}%`);
    };

    const onMove = (event: PointerEvent) => {
      px = event.clientX;
      py = event.clientY;
      if (frame === null) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      dim(active);
      active = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      dim(active);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return null;
}
