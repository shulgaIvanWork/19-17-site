'use client';

import dynamic from 'next/dynamic';

/** Loads the canvas object only where it is actually drawn. Without this the
 *  engine ships with every page that imports Hero, including the four product
 *  routes that never render it. */
const HeroObject = dynamic(() => import('./HeroObject').then((m) => m.HeroObject), {
  ssr: false,
});

export function HeroObjectMount({ nodes, sway }: { nodes?: number; sway?: number }) {
  return <HeroObject nodes={nodes} sway={sway} />;
}
