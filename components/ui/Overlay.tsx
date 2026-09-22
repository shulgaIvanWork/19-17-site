'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import styles from './Overlay.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

type Props = {
  onClose: () => void;
  labelledBy: string;
  /** 'form' - узкая панель заявки, 'wide' - просмотр макета во всю страницу. */
  size?: 'form' | 'wide';
  /** Меняйте значение, когда панель подменяет содержимое (форма на
   *  подтверждение): тогда фокус переходит в новый вид, а не падает на body. */
  focusOn?: string;
  children: ReactNode;
};

/** Второй уровень над страницей: ровная серая подложка и одна панель. В
 *  прототипе не было ни удержания фокуса, ни закрытия по Esc, ни блокировки
 *  прокрутки; рабочему сайту нужны все три. */
export function Overlay({ onClose, labelledBy, size = 'form', focusOn, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Панель уходит в <body> через портал. На месте вызова она попадает внутрь
  // `.section`, а у секции стоит content-visibility: auto - это включает
  // contain: paint, и секция становится системой отсчета для position: fixed.
  // Из-за этого окно просмотра садилось не в экран, а в начало секции: при
  // нажатии на нижние карточки оно оказывалось выше видимой области.
  // Панель монтируется только по действию пользователя, на сервере ее в дереве
  // нет, поэтому document берется прямо при отрисовке.
  const host = typeof document === 'undefined' ? null : document.body;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Блокировка прокрутки с поправкой на ширину полосы: иначе страница прыгает.
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  // Фокус переводится в панель при открытии и снова при подмене вида.
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [focusOn, host]);

  if (!host) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={[styles.panel, size === 'wide' ? styles.wide : ''].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>,
    host,
  );
}
