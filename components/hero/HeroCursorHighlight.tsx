'use client';

import { useEffect } from 'react';

/** Нажимаемые элементы подсветку не берут: пятно легло бы на сам элемент и
 *  перекрасило его наведение. Плашки карточек в список намеренно не входят -
 *  они ссылки, но свечение на рисунке там нужно. */
const CURSOR_SKIP =
  'button, a.btn, .navbtn, .menurow, .actionlink, [role="button"], [data-cursor-skip], input, select, textarea, summary, [data-header-glow] a';

/** Пишет --mx / --my / --mo на подсвечиваемых поверхностях по мере движения
 *  курсора. Подключается один раз в layout: один обработчик на весь сайт и
 *  ни одной перерисовки React на движение мыши.
 *
 *  Две детали перенесены из прототипа, и обе там сперва были ошибками: номер
 *  кадра rAF хранится в замыкании (поле объекта ломалось при горячей
 *  перезагрузке), а обработчик ухода висит на documentElement, потому что
 *  `pointerleave` у window срабатывает не всегда. */
export function HeroCursorHighlight({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame: number | null = null;
    let px = 0;
    let py = 0;
    let active: HTMLElement | null = null;

    const dim = (surface: HTMLElement | null) => {
      if (!surface) return;
      surface.style.setProperty('--mo', '0');
    };

    const paint = () => {
      frame = null;
      const hit = document.elementFromPoint(px, py);
      if (hit?.closest(CURSOR_SKIP)) {
        dim(active);
        active = null;
        return;
      }
      const next = hit?.closest<HTMLElement>('[data-hero], [data-header-glow], [data-cursor-glow]') ?? null;
      if (next !== active) {
        dim(active);
        active = next;
      }
      if (!active) return;
      const rect = active.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        dim(active);
        return;
      }
      active.style.setProperty('--mo', '1');
      active.style.setProperty('--mx', `${(((px - rect.left) / rect.width) * 100).toFixed(2)}%`);
      active.style.setProperty('--my', `${(((py - rect.top) / rect.height) * 100).toFixed(2)}%`);
    };

    const onMove = (event: PointerEvent) => {
      // Подсветка идет только за мышью. От пальца pointermove тоже приходит, и на
      // телефоне пятно оставалось там, где коснулись экрана.
      if (event.pointerType !== 'mouse') return;
      px = event.clientX;
      py = event.clientY;
      if (frame === null) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      dim(active);
      active = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      dim(active);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return null;
}
