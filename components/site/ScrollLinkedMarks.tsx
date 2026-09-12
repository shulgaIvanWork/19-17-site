'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Марки на карточках крутятся сами, но только пока карточка в кадре. */
export function ScrollLinkedMarks() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-service-card]'));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.setAttribute('data-mark-live', '');
          else entry.target.removeAttribute('data-mark-live');
        }
      },
      { rootMargin: '10% 0px', threshold: 0.18 },
    );

    cards.forEach((card) => io.observe(card));
    return () => {
      io.disconnect();
      cards.forEach((card) => card.removeAttribute('data-mark-live'));
    };
  }, [pathname]);

  return null;
}
