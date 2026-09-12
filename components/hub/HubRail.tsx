'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { NavItem } from '@/content/nav';
import { useHoverMenu } from '@/components/nav/useHoverMenu';
import { isHashCurrent } from './hubLinks';
import { jumpHash, onHubJumpEnd, setHubRailDrag, setHubRailHeld } from './hubScroll';
import styles from './HubRail.module.css';

/** Часы вынесены из компонента: прямой вызов performance.now() в теле
 *  компонента правило react-hooks/purity считает вызовом во время отрисовки,
 *  хотя сюда попадают только обработчики указателя. */
function nowMs() {
  return performance.now();
}

/** Клик, а не перетаскивание: меньше этого сдвига указатель почти не двигали. */
const CLICK_PX = 10;
/** Ход на следующий слот. Полтора слота — заметный рывок, без перескока. */
const PULL_SLOTS = 1.5;
/** После шага курсор должен почти остановиться — иначе это тот же рывок. */
const REST_PX = 3;
const REST_MS = 120;

/** Рельс разделов слева на хабах «Сайты» и «VPN/AI», широкий экран. Без
 *  наведения видны только точки и линия между ними; капсула и подписи - по
 *  наведению. Нижняя полоса для узкого экрана - отдельный компонент HubPager.
 *  Кружок не магнитится к курсору: его тащат, как бегунок скроллбара. Клик по
 *  слоту — прыжок. Один рывок — один раздел; следующий шаг только после
 *  короткой остановки курсора. Если перестали тянуть, страница остаётся
 *  на текущем слоте. */
export function HubRail({ pathname, hash, stops }: { pathname: string; hash: string; stops: NavItem[] }) {
  const router = useRouter();
  const { open, setOpen, openNow, cancelClose, closeSoon, wrapProps, triggerRef } =
    useHoverMenu<HTMLElement>(pathname);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const ready = useRef(false);
  const drag = useRef<{
    pointerId: number;
    lastY: number;
    downY: number;
    downIndex: number;
    moved: boolean;
    accum: number;
    lastDir: -1 | 0 | 1;
    pull: number;
    awaitRest: boolean;
    lastBurst: number;
    slots: { top: number; bottom: number }[];
  } | null>(null);
  const thumbAt = useRef(0);
  const thumbWant = useRef(0);
  const thumbTimer = useRef<number | null>(null);
  const stepping = useRef(false);
  const stopStepWait = useRef<(() => void) | null>(null);
  const unbindDrag = useRef<(() => void) | null>(null);

  const clearThumbTimer = () => {
    if (thumbTimer.current === null) return;
    window.clearTimeout(thumbTimer.current);
    thumbTimer.current = null;
  };

  const clearStepWait = useCallback(() => {
    stopStepWait.current?.();
    stopStepWait.current = null;
    stepping.current = false;
    clearThumbTimer();
  }, []);

  const dropDragListeners = useCallback(() => {
    unbindDrag.current?.();
    unbindDrag.current = null;
  }, []);

  useEffect(
    () => () => {
      clearStepWait();
      dropDragListeners();
    },
    [clearStepWait, dropDragListeners],
  );

  const dots = useCallback(
    () => (triggerRef.current ? [...triggerRef.current.querySelectorAll<HTMLElement>('[data-dot]')] : []),
    [triggerRef],
  );

  const placeThumb = useCallback((y: number) => {
    const thumb = thumbRef.current;
    if (!thumb) return;
    thumb.style.transform = `translateY(${y}px)`;
  }, []);

  const indexFromPointer = (clientY: number, marks = drag.current?.slots) => {
    if (!marks?.length) return 0;
    if (clientY < marks[0].top) return 0;
    if (clientY >= marks[marks.length - 1].bottom) return marks.length - 1;
    let index = 0;
    for (let i = 0; i < marks.length; i += 1) {
      const row = marks[i];
      if (clientY >= row.top && clientY < row.bottom) index = i;
    }
    return index;
  };

  const placeStop = (index: number) => {
    const mark = dots()[index];
    const thumb = thumbRef.current;
    if (!mark || !thumb) return;
    placeThumb(mark.offsetTop - thumb.offsetTop);
  };

  useLayoutEffect(() => {
    if (drag.current) return;
    const rail = triggerRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;

    const place = () => {
      if (drag.current || thumbTimer.current !== null) return;
      const current =
        rail.querySelector<HTMLElement>('[aria-current="page"] [data-dot]') ??
        rail.querySelector<HTMLElement>('[data-dot]');
      if (!current) return;
      const marks = dots();
      const index = Math.max(0, marks.indexOf(current));
      thumbAt.current = index;
      thumbWant.current = index;
      placeThumb(current.offsetTop - thumb.offsetTop);
      if (!ready.current) {
        ready.current = true;
        window.requestAnimationFrame(() => {
          thumb.dataset.ready = 'true';
        });
      }
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [hash, pathname, stops, triggerRef, placeThumb, dots]);

  const go = (href: string) => {
    if (jumpHash(href, pathname)) return;
    router.push(href);
  };

  const jumpStop = (index: number) => {
    const href = stops[index]?.href;
    if (href) jumpHash(href, pathname, { replace: true, chase: true });
  };

  const applyStop = (index: number) => {
    thumbAt.current = index;
    thumbWant.current = index;
    placeStop(index);
    jumpStop(index);
  };

  const consumePull = () => {
    thumbTimer.current = null;
    const state = drag.current;
    if (!state || stepping.current) return;
    const dir = state.accum > 0 ? 1 : state.accum < 0 ? -1 : 0;
    if (!dir || Math.abs(state.accum) < state.pull) return;
    const next = Math.max(0, Math.min(stops.length - 1, thumbAt.current + dir));
    state.accum = 0;
    state.awaitRest = true;
    state.lastBurst = nowMs();
    if (next === thumbAt.current) return;
    state.lastDir = dir;
    stepping.current = true;
    applyStop(next);
    const release = () => {
      if (!stepping.current) return;
      stopStepWait.current = null;
      stepping.current = false;
      if (drag.current) consumePull();
    };
    const stop = onHubJumpEnd(() => {
      stop();
      window.clearTimeout(fallback);
      release();
    });
    const fallback = window.setTimeout(() => {
      stop();
      release();
    }, 720);
    stopStepWait.current = () => {
      stop();
      window.clearTimeout(fallback);
      clearThumbTimer();
    };
  };

  const onGripDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    openNow();
    cancelClose();
    const slots = dots().map((mark) => {
      const row = mark.parentElement?.getBoundingClientRect();
      return { top: row?.top ?? 0, bottom: row?.bottom ?? 0 };
    });
    const pitch = slots.length > 1 ? Math.max(24, slots[1].top - slots[0].top) : 32;
    drag.current = {
      pointerId: event.pointerId,
      lastY: event.clientY,
      downY: event.clientY,
      downIndex: indexFromPointer(event.clientY, slots),
      moved: false,
      accum: 0,
      lastDir: 0,
      pull: pitch * PULL_SLOTS,
      awaitRest: false,
      lastBurst: 0,
      slots,
    };
    setHubRailHeld(true);
    setHubRailDrag(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* захват есть только у настоящего указателя */
    }
    bindDragListeners(event.pointerId);
  };

  const pullByPointer = (clientY: number, pointerId: number) => {
    const state = drag.current;
    if (!state || pointerId !== state.pointerId) return;
    const dy = clientY - state.lastY;
    const now = nowMs();
    state.lastY = clientY;
    if (!state.moved) {
      if (Math.abs(clientY - state.downY) < CLICK_PX) return;
      state.moved = true;
    }
    const along = state.accum !== 0 ? Math.sign(state.accum) : state.lastDir;
    const flipped = dy !== 0 && along !== 0 && Math.sign(dy) !== along;
    if (flipped) {
      state.awaitRest = false;
      state.accum = dy;
    } else if (state.awaitRest) {
      if (Math.abs(dy) <= REST_PX) {
        if (now - state.lastBurst >= REST_MS) state.awaitRest = false;
        return;
      }
      if (now - state.lastBurst < REST_MS) {
        state.lastBurst = now;
        return;
      }
      state.awaitRest = false;
      state.accum = dy;
    } else {
      state.accum += dy;
    }
    if (!stepping.current && thumbTimer.current === null) consumePull();
  };

  const endDrag = (pointerId: number) => {
    const state = drag.current;
    if (!state || pointerId !== state.pointerId) return;
    const clickIndex = state.downIndex;
    const wasDrag = state.moved;
    clearStepWait();
    dropDragListeners();
    drag.current = null;
    if (!wasDrag) applyStop(clickIndex);
    setHubRailHeld(false);
    setHubRailDrag(false);
    const wrap = triggerRef.current?.parentElement;
    if (!wrap?.matches(':hover')) closeSoon();
  };

  const bindDragListeners = (pointerId: number) => {
    dropDragListeners();
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      event.preventDefault();
      pullByPointer(event.clientY, event.pointerId);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      const wasDrag = Boolean(drag.current?.moved);
      endDrag(pointerId);
      if (!wasDrag) return;
      const swallow = (click: MouseEvent) => {
        click.preventDefault();
        click.stopPropagation();
      };
      window.addEventListener('click', swallow, true);
      window.setTimeout(() => window.removeEventListener('click', swallow, true), 0);
    };
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', up, true);
    window.addEventListener('pointercancel', up, true);
    unbindDrag.current = () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', up, true);
      window.removeEventListener('pointercancel', up, true);
    };
  };

  return (
    <div
      className={[styles.wrap, open ? styles.open : ''].filter(Boolean).join(' ')}
      data-hub-rail
      {...wrapProps}
      onMouseLeave={() => {
        if (drag.current) {
          cancelClose();
          return;
        }
        closeSoon();
      }}
      onPointerDown={(event) => {
        if (event.button === 0) setHubRailHeld(true);
      }}
      onDragStart={(event) => event.preventDefault()}
      onClick={() => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        setOpen((value) => !value);
      }}
    >
      <span className={styles.capsule} aria-hidden="true" />
      <span className={styles.sheet} aria-hidden="true" />
      <span
        className={styles.grip}
        aria-hidden="true"
        onPointerDown={onGripDown}
      />
      <nav
        ref={triggerRef}
        className={styles.rail}
        aria-label="Разделы страницы"
        tabIndex={-1}
      >
        <span ref={thumbRef} className={styles.thumb} aria-hidden="true" />
        {stops.map((item) => {
          const active = isHashCurrent(pathname, hash, item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              draggable={false}
              data-cursor-skip
              className={[styles.item, active ? styles.active : ''].filter(Boolean).join(' ')}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              tabIndex={0}
              onDragStart={(event) => event.preventDefault()}
              onMouseDown={(event) => {
                if (event.button === 0) event.preventDefault();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (drag.current) return;
                go(item.href);
              }}
            >
              <span className={styles.dot} data-dot aria-hidden="true" />
              <span className={styles.label}>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
