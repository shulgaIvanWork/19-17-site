'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef, useState } from 'react';
import type { HeroShape } from './heroTypes';

/** Грузит холст с фигурой только там, где ее действительно рисуют. */
const HeroObject = dynamic(() => import('./HeroObject').then((m) => m.HeroObject), {
  ssr: false,
});

function coarsePointer() {
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

function nearMargin() {
  return coarsePointer() ? '18% 0px' : '45% 0px';
}

function isNear(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return false;
  const slop = window.innerHeight * (coarsePointer() ? 0.18 : 0.45);
  return rect.bottom > -slop && rect.top < window.innerHeight + slop;
}

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

    const sync = () => setNear(isNear(host));

    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      root: null,
      rootMargin: nearMargin(),
      threshold: 0,
    });
    io.observe(host);
    sync();
    const later = window.requestAnimationFrame(sync);
    return () => {
      window.cancelAnimationFrame(later);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      {near ? <HeroObject nodes={nodes} shape={shape} /> : null}
    </div>
  );
}
