'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { usePathname } from 'next/navigation';
import { hubStops, isHashCurrent, jumpHash, onHubJumpEnd, setHubRailDrag, setHubRailHeld } from './hubNav';
import { useHoverMenu } from './useHoverMenu';
import { useHubSectionHash } from './useHubSectionHash';
import styles from './LandingNav.module.css';

/** Клик, а не перетаскивание: меньше этого сдвига указатель почти не двигали. */
const CLICK_PX = 10;
/** Ход на следующий слот. Полтора слота — заметный рывок, без перескока. */
const PULL_SLOTS = 1.5;
/** После шага курсор должен почти остановиться — иначе это тот же рывок. */
const REST_PX = 3;
const REST_MS = 120;

/** Точки слева на хабах «Сайты» и «VPN/AI». Без наведения видны только точки
 *  и линия между ними; капсула и подписи — по hover.
 *  Кружок не магнитится к курсору: его тащат, как бегунок скроллбара. Клик по
 *  слоту — прыжок. Один рывок — один раздел; следующий шаг только после
 *  короткой остановки курсора. Если перестали тянуть, страница остаётся
 *  на текущем слоте. */
export function LandingNav() {
  const pathname = usePathname();
  const hash = useHubSectionHash(pathname);
  const stops = hubStops(pathname);
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
  const pagerSwipe = useRef<{
    pointerId: number;
    downX: number;
    moved: boolean;
  } | null>(null);
  const unbindPager = useRef<(() => void) | null>(null);
  const swallowPagerClick = useRef(false);
  const pagerTrackRef = useRef<HTMLDivElement>(null);
  const [browse, setBrowse] = useState(0);

  const clearThumbTimer = () => {
    if (thumbTimer.current === null) return;
    window.clearTimeout(thumbTimer.current);
    thumbTimer.current = null;
  };

  const clearStepWait = () => {
    stopStepWait.current?.();
    stopStepWait.current = null;
    stepping.current = false;
    clearThumbTimer();
  };

  const dropDragListeners = () => {
    unbindDrag.current?.();
    unbindDrag.current = null;
  };

  const dropPagerListeners = () => {
    unbindPager.current?.();
    unbindPager.current = null;
  };

  useEffect(
    () => () => {
      clearStepWait();
      dropDragListeners();
      dropPagerListeners();
    },
    [],
  );

  useEffect(() => {
    const list = hubStops(pathname);
    if (!list || list.length < 2) return;
    const idx = Math.max(
      0,
      list.findIndex((item) => isHashCurrent(pathname, hash, item.href)),
    );
    setBrowse(idx);
  }, [hash, pathname]);

  const dots = () =>
    triggerRef.current ? [...triggerRef.current.querySelectorAll<HTMLElement>('[data-dot]')] : [];

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
  }, [hash, pathname, stops, triggerRef, placeThumb]);

  if (!stops || stops.length < 2) return null;

  const go = (href: string) => {
    if (jumpHash(href, pathname)) return;
    window.location.assign(href);
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
    state.lastBurst = performance.now();
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
    const now = performance.now();
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

  const onGripMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    pullByPointer(event.clientY, event.pointerId);
  };

  const onGripUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    endDrag(event.pointerId);
  };

  const currentIndex = Math.max(
    0,
    stops.findIndex((item) => isHashCurrent(pathname, hash, item.href)),
  );

  const stepTo = (index: number) => {
    const next = Math.max(0, Math.min(stops.length - 1, index));
    setBrowse(next);
    applyStop(next);
  };

  const browseTo = (index: number) => {
    setBrowse(Math.max(0, Math.min(stops.length - 1, index)));
  };

  const onPagerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    pagerSwipe.current = {
      pointerId: event.pointerId,
      downX: event.clientX,
      moved: false,
    };
    const track = pagerTrackRef.current;
    if (track) {
      track.dataset.dragging = 'true';
      track.style.setProperty('--drag', '0px');
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* захват есть только у настоящего указателя */
    }
    const move = (next: PointerEvent) => {
      const state = pagerSwipe.current;
      if (!state || next.pointerId !== state.pointerId) return;
      const dx = next.clientX - state.downX;
      if (Math.abs(dx) >= CLICK_PX) state.moved = true;
      pagerTrackRef.current?.style.setProperty('--drag', `${dx}px`);
    };
    const up = (next: PointerEvent) => {
      const state = pagerSwipe.current;
      if (!state || next.pointerId !== state.pointerId) return;
      pagerSwipe.current = null;
      dropPagerListeners();
      const track = pagerTrackRef.current;
      if (track) {
        track.style.setProperty('--drag', '0px');
        delete track.dataset.dragging;
      }
      if (!state.moved) return;
      swallowPagerClick.current = true;
      window.setTimeout(() => {
        swallowPagerClick.current = false;
      }, 0);
      const dx = next.clientX - state.downX;
      if (Math.abs(dx) < 48) return;
      browseTo(browse + (dx < 0 ? 1 : -1));
    };
    dropPagerListeners();
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', up, true);
    window.addEventListener('pointercancel', up, true);
    unbindPager.current = () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', up, true);
      window.removeEventListener('pointercancel', up, true);
    };
  };

  return (
    <>
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
        onPointerMove={onGripMove}
        onPointerUp={onGripUp}
        onPointerCancel={onGripUp}
      />
      <nav
        ref={triggerRef}
        className={styles.rail}
        aria-label="Разделы страницы"
        aria-expanded={open}
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
    <nav className={styles.pager} data-hub-pager aria-label="Разделы страницы">
      <button
        type="button"
        className={styles.pagerStep}
        aria-label="Листать назад"
        disabled={browse <= 0}
        onClick={() => browseTo(browse - 1)}
      >
        ‹
      </button>
      <div
        className={styles.pagerViewport}
        onPointerDown={onPagerDown}
        onClick={(event) => {
          if (!swallowPagerClick.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div
          ref={pagerTrackRef}
          className={styles.pagerTrack}
          style={{ ['--i' as string]: browse }}
        >
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
              onClick={() => stepTo(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.pagerStep}
        aria-label="Листать вперёд"
        disabled={browse >= stops.length - 1}
        onClick={() => browseTo(browse + 1)}
      >
        ›
      </button>
    </nav>
    </>
  );
}
