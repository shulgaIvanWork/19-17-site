'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Scrolls to `location.hash` after a route change. Combined service pages
 *  keep several heroes on one URL; the menu jumps by id. */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const go = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    go();
    const frame = window.requestAnimationFrame(go);
    const timer = window.setTimeout(go, 160);
    window.addEventListener('hashchange', go);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', go);
    };
  }, [pathname]);

  return null;
}
