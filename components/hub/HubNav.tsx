'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { hubStops } from './hubLinks';
import { HubPager } from './HubPager';
import { HubRail } from './HubRail';
import { useHubSectionHash } from './useHubSectionHash';

/** Навигация по разделам хаба. Список разделов один, показывают его два разных
 *  виджета: рельс с точками слева на широком экране и нижняя полоса на узком.
 *  Раньше оба жили в одном файле на 532 строки. На обычных страницах разделов
 *  нет, и компонент ничего не рисует. */
export function HubNav() {
  const pathname = usePathname();
  const hash = useHubSectionHash(pathname);
  const stops = useMemo(() => hubStops(pathname), [pathname]);

  if (!stops || stops.length < 2) return null;

  return (
    <>
      <HubRail pathname={pathname} hash={hash} stops={stops} />
      <HubPager pathname={pathname} hash={hash} stops={stops} />
    </>
  );
}
