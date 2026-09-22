'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isServiceSlug, serviceHref } from '@/content/services';

/** Переводит старую ссылку с якорем на страницу услуги.
 *
 *  До сентября 2026 услуги были разделами двух длинных страниц: /websites#crm,
 *  /vpn-ai#ai. Сервер перенаправляет /websites и /vpn-ai на главную без якоря -
 *  якорь серверу не приходит вовсе, зато браузер переносит его сам. Здесь он
 *  читается и заменяется адресом услуги. Свой якорь главной (#services) в
 *  списке услуг не значится, поэтому под правило не попадает.
 *
 *  replace, а не push: возврат назад должен вести туда, откуда пришли, а не на
 *  главную, с которой посетителя тут же увели. */
export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const slug = window.location.hash.replace(/^#/, '');
    if (isServiceSlug(slug)) router.replace(serviceHref(slug));
  }, [router]);

  return null;
}
