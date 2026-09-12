'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { NavItem } from '@/content/nav';
import { isHashCurrent } from './hubLinks';
import { jumpHash } from './hubScroll';
import styles from './HubPager.module.css';

/** Нажатие, а не свайп: меньше этого сдвига палец почти не двигали. */
const CLICK_PX = 10;
/** Короткий свайп не листает: его легко сделать случайно при прокрутке. */
const SWIPE_PX = 48;

/** Нижняя полоса разделов на узком экране: стрелки, свайп и выбор раздела.
 *  Просмотр и положение страницы разделены намеренно: browse - что человек
 *  листает пальцем, currentIndex - раздел, который сейчас на экране. Раньше
 *  полоса жила в одном файле с рельсом точек, общего у них только список. */
export function HubPager({ pathname, hash, stops }: { pathname: string; hash: string; stops: NavItem[] }) {
  const [browse, setBrowse] = useState(0);
  const swipe = useRef<{ pointerId: number; downX: number; moved: boolean } | null>(null);
  const unbind = useRef<(() => void) | null>(null);
  const swallowClick = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const currentIndex = Math.max(
    0,
    stops.findIndex((item) => isHashCurrent(pathname, hash, item.href)),
  );

  useEffect(() => {
    setBrowse(currentIndex);
  }, [currentIndex]);

  useEffect(
    () => () => {
      unbind.current?.();
      unbind.current = null;
    },
    [],
  );

  const browseTo = (index: number) => setBrowse(Math.max(0, Math.min(stops.length - 1, index)));

  const stepTo = (index: number) => {
    const next = Math.max(0, Math.min(stops.length - 1, index));
    setBrowse(next);
    const href = stops[next]?.href;
    if (href) jumpHash(href, pathname, { replace: true, chase: true });
  };

  /** Захвата указателя здесь намеренно нет: с ним браузер переадресует клик
   *  на область просмотра, и нажатие на раздел не срабатывало (проверено на
   *  сборке 12.09.2026). Свайп ловят слушатели окна, им захват не нужен. */
  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    swipe.current = { pointerId: event.pointerId, downX: event.clientX, moved: false };
    const track = trackRef.current;
    if (track) {
      track.dataset.dragging = 'true';
      track.style.setProperty('--drag', '0px');
    }
    const move = (next: PointerEvent) => {
      const state = swipe.current;
      if (!state || next.pointerId !== state.pointerId) return;
      const dx = next.clientX - state.downX;
      if (Math.abs(dx) >= CLICK_PX) state.moved = true;
      trackRef.current?.style.setProperty('--drag', `${dx}px`);
    };

    const up = (next: PointerEvent) => {
      const state = swipe.current;
      if (!state || next.pointerId !== state.pointerId) return;
      swipe.current = null;
      unbind.current?.();
      unbind.current = null;
      const done = trackRef.current;
      if (done) {
        done.style.setProperty('--drag', '0px');
        delete done.dataset.dragging;
      }
      if (!state.moved) return;
      // Свайп не должен заодно нажать чип под пальцем: клик придет сразу за
      // отпусканием, и его гасит сам чип.
      swallowClick.current = true;
      window.setTimeout(() => {
        swallowClick.current = false;
      }, 0);
      const dx = next.clientX - state.downX;
      if (Math.abs(dx) < SWIPE_PX) return;
      browseTo(browse + (dx < 0 ? 1 : -1));
    };

    unbind.current?.();
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', up, true);
    window.addEventListener('pointercancel', up, true);
    unbind.current = () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', up, true);
      window.removeEventListener('pointercancel', up, true);
    };
  };

  return (
    <nav className={styles.pager} data-hub-pager aria-label="Разделы страницы">
      <button
        type="button"
        className={styles.pagerStep}
        aria-label="Листать назад"
        disabled={browse <= 0}
        onClick={() => browseTo(browse - 1)}
      >
        &#8249;
      </button>
      <div className={styles.pagerViewport} onPointerDown={onPointerDown}>
        <div ref={trackRef} className={styles.pagerTrack} style={{ ['--i' as string]: browse }}>
          {stops.map((item, index) => (
            <button
              key={item.href}
              type="button"
              className={[
                styles.pagerChip,
                index === browse ? styles.pagerChipOn : '',
                index === currentIndex ? styles.pagerChipHere : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={index === currentIndex ? 'page' : undefined}
              onClick={(event) => {
                // После свайпа палец отрывается над соседним чипом: этот клик
                // не выбор раздела, а хвост жеста.
                if (swallowClick.current) {
                  event.preventDefault();
                  return;
                }
                stepTo(index);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.pagerStep}
        aria-label="Листать вперед"
        disabled={browse >= stops.length - 1}
        onClick={() => browseTo(browse + 1)}
      >
        &#8250;
      </button>
    </nav>
  );
}
