'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { serviceBySlug, serviceHref } from '@/content/nav';

/** Переводит старую ссылку с якорем на страницу услуги.
 *
 *  До сентября 2026 услуги были разделами двух длинных страниц: /websites#crm,
 *  /vpn-ai#ai. Сервер перенаправляет /websites и /vpn-ai сюда, на витрину, а
 *  якорь переносит браузер - серверу он его не отправляет. Здесь якорь читается
 *  и заменяется адресом услуги.
 *
 *  replace, а не push: возврат назад должен вести туда, откуда пришли, а не на
 *  витрину, с которой посетителя тут же увели. */
export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const slug = window.location.hash.replace(/^#/, '');
    if (slug && serviceBySlug.has(slug)) router.replace(serviceHref(slug));
  }, [router]);

  return null;
}
