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
  /** Change this when the panel swaps its contents (form to confirmation) so
   *  focus follows into the new view instead of falling back to the body. */
  focusOn?: string;
  children: ReactNode;
};

/** Level-2 elevation: a flat grey backdrop and one panel. The prototype had no
 *  focus trap, Esc or scroll lock; production needs all three. */
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

    // Scroll lock, compensating for the scrollbar so the page does not jump.
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

  // Move focus into the panel on open, and again whenever it swaps views.
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
