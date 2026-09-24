'use client';

import { useEffect, useRef } from 'react';
import { versioned } from '@/lib/assets';
import styles from './Hero.module.css';

/** Фирменная анимация на первом экране «О нас». Занимает место проволочной
 *  фигуры, которой у этой страницы нет (правка заказчика 2026-09-24).
 *
 *  Без звука, по кругу и без органов управления: это оформление экрана, а не
 *  ролик, который смотрят. Поэтому же скрыт от скринридера - за него говорят
 *  заголовок и текст рядом.
 *
 *  При сокращенных анимациях ролик останавливается на первом кадре: то же
 *  правило действует на остальные движения сайта. Проверяется после монтажа,
 *  а не разметкой: `autoplay` отменить стилями нельзя. */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    // Автозапуск браузер иногда отклоняет: вкладка была скрыта в момент
    // загрузки. Просим еще раз, уже после монтажа. Отказ гасим: без ролика
    // экран остается рабочим.
    video.muted = true;
    void video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className={styles.video}
      src={versioned(src)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
