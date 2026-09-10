'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef, useState } from 'react';
import type { HeroShape } from './heroTypes';

/** Loads the canvas object only where it is actually drawn. */
const HeroObject = dynamic(() => import('./HeroObject').then((m) => m.HeroObject), {
  ssr: false,
});

/** Keep at most the current (and maybe next) hero canvas in memory.
 *  Hub landings mount seven heroes; each full-size 2D buffer is a GPU layer. */
const NEAR_MARGIN = '70% 0px';

export function HeroObjectMount({
  nodes,
  shape,
}: {
  nodes?: number;
  shape?: HeroShape;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      root: null,
      rootMargin: NEAR_MARGIN,
      threshold: 0,
    });
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      {near ? <HeroObject nodes={nodes} shape={shape} /> : null}
    </div>
  );
}
