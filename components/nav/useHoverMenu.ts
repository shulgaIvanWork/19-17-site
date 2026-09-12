'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';

/** Поведение выпадающих меню шапки и навигации по разделам хаба.
 *
 *  Открывается по наведению и по фокусу. Закрытие отложено на delay мс и
 *  отменяется, если курсор вернулся: иначе меню схлопывается, пока курсор
 *  идет от кнопки к панели. Esc закрывает и возвращает фокус на кнопку,
 *  уход фокуса из группы закрывает, смена маршрута закрывает.
 *
 *  Раньше эта логика была скопирована в HubMenu и LandingNav. */
export function useHoverMenu<T extends HTMLElement>(pathname: string, delay = 200) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<T>(null);

  const cancelClose = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  const openNow = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const closeSoon = useCallback(() => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), delay);
  }, [cancelClose, delay]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  const wrapProps = {
    ref: wrapRef,
    onMouseEnter: openNow,
    onMouseLeave: closeSoon,
    onFocus: openNow,
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (wrapRef.current?.contains(event.relatedTarget as Node | null)) return;
      if (wrapRef.current?.matches(':hover')) return;
      close();
    },
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' && open) {
        close();
        triggerRef.current?.focus();
      }
    },
  };

  return { open, setOpen, close, openNow, cancelClose, closeSoon, wrapProps, triggerRef };
}
