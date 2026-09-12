'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef, useState } from 'react';
import { onHubJumpEnd, onHubJumpStart, pinnedHubSection } from '@/components/nav/hubNav';
import type { HeroShape } from './heroTypes';

/** Loads the canvas object only where it is actually drawn. */
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
    const hero = host.closest<HTMLElement>('[data-hero]');

    const sync = () => {
      const dest = pinnedHubSection();
      if (dest && hero?.id === dest) {
        setNear(true);
        return;
      }
      setNear(isNear(host));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const dest = pinnedHubSection();
        if (dest && hero?.id === dest) {
          setNear(true);
          return;
        }
        setNear(entry.isIntersecting);
      },
      { root: null, rootMargin: nearMargin(), threshold: 0 },
    );
    io.observe(host);
    sync();
    const later = window.requestAnimationFrame(sync);
    const stopJump = onHubJumpEnd(sync);
    const stopStart = onHubJumpStart((id) => {
      if (hero?.id === id) setNear(true);
      else sync();
    });
    return () => {
      window.cancelAnimationFrame(later);
      stopJump();
      stopStart();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      {near ? <HeroObject nodes={nodes} shape={shape} /> : null}
    </div>
  );
}
