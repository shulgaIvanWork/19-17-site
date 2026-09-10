'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { scrollToLocationHash } from '@/lib/hubNav';

/** Прокручивает к якорю из адреса после смены маршрута и при смене якоря.
 *  Хабы держат несколько разделов на одном адресе, меню прыгает по id.
 *  Сама механика - в lib/hubNav. */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    let stop = scrollToLocationHash();
    const onHash = () => {
      stop();
      stop = scrollToLocationHash();
    };
    window.addEventListener('hashchange', onHash);
    return () => {
      stop();
      window.removeEventListener('hashchange', onHash);
    };
  }, [pathname]);

  return null;
}
