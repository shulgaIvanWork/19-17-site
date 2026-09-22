'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeroCursorHighlight = dynamic(
  () => import('@/components/hero/HeroCursorHighlight').then((mod) => mod.HeroCursorHighlight),
  { ssr: false },
);
const SiteMotion = dynamic(() => import('./SiteMotion').then((mod) => mod.SiteMotion), { ssr: false });
const ScrollLinkedMarks = dynamic(
  () => import('./ScrollLinkedMarks').then((mod) => mod.ScrollLinkedMarks),
  { ssr: false },
);
const ScrollToTop = dynamic(() => import('./ScrollToTop').then((mod) => mod.ScrollToTop), { ssr: false });

/** Подсветка и появление блоков подгружаются после первого кадра. */
export function ClientDecor({ cursorHighlight }: { cursorHighlight: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const boot = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(boot, { timeout: 800 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(boot, 1);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <>
      <HeroCursorHighlight enabled={cursorHighlight} />
      <SiteMotion />
      <ScrollLinkedMarks />
      <ScrollToTop />
    </>
  );
}
