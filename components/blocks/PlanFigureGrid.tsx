'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { LoopCarousel } from './LoopCarousel';
import styles from './PlanFigure.module.css';

/** На широком экране — сетка из трёх колонок. На мобилке те же карточки
 *  в карусели. Нумерованные шаги 01–04 сюда не входят. */
export function PlanFigureGrid({ children, label }: { children: ReactNode; label?: string }) {
  const items = Children.toArray(children);
  return (
    <>
      <div className={`g3 desk-only ${styles.offset}`}>{children}</div>
      <div className={styles.mobile}>
        <LoopCarousel peek="pair" label={label}>
          {items.map((child, index) => (
            <div
              key={isValidElement(child) && child.key != null ? String(child.key) : index}
              className={styles.card}
            >
              {child}
            </div>
          ))}
        </LoopCarousel>
      </div>
    </>
  );
}
