'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/** On touch devices there is no hover, so card-mark animations are paused 1s
 *  loops whose delay is `var(--mark-p)`. This writes that progress from each
 *  card's place in the viewport: down plays forward, up reverses. */
export function ScrollLinkedMarks() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia(FINE_POINTER).matches) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-service-card]'));
    if (!cards.length) return;

    let frame: number | null = null;
    const write = () => {
      frame = null;
      const view = window.innerHeight;
      const start = view * 0.9;
      const end = view * 0.22;
      const span = start - end;
      for (const node of cards) {
        const next = Math.min(1, Math.max(0, (start - node.getBoundingClientRect().top) / span));
        node.style.setProperty('--mark-p', next.toFixed(4));
      }
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return null;
}
