'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Overlay } from '@/components/ui/Overlay';
import { photoBlur } from '@/content/photoBlur';
import type { worksBand } from '@/content/works';
import styles from './ProjectFlow.module.css';

type Plan = typeof worksBand.plan;

/** Путь проекта одним листом: холст, на котором этапы разложены по колонкам, а
 *  справа готовая страница. Нажатие открывает холст целиком - тем же оверлеем,
 *  что и макеты работ, чтобы поведение на странице было одно. */
export function ProjectFlow({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const blur = photoBlur[plan.board.src];

  return (
    <>
      <figure className={styles.board} data-cursor-glow>
        <div className={styles.frame}>
          <button
            type="button"
            className={styles.hit}
            onClick={() => setOpen(true)}
            data-cursor-skip
            aria-label="Посмотреть схему работы целиком"
          />
          <Image
            src={plan.board.src}
            alt={plan.board.alt}
            width={plan.board.width}
            height={plan.board.height}
            sizes="(max-width: 768px) 92vw, 1040px"
            quality={82}
            placeholder={blur ? 'blur' : 'empty'}
            blurDataURL={blur}
            className={styles.shot}
          />
          <span className={styles.peek} aria-hidden="true">
            Смотреть целиком
          </span>
        </div>
        <figcaption className="footnote">{plan.caption}</figcaption>
      </figure>

      {open ? (
        <Overlay size="wide" labelledBy="plan-view-title" onClose={() => setOpen(false)}>
          <div className={styles.head}>
            <div>
              <div className={styles.kind}>Разбор работы</div>
              <h2 id="plan-view-title" className={styles.title}>
                Как мы ведем проект
              </h2>
            </div>
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Закрыть">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className={styles.paper}>
            <Image
              src={plan.board.src}
              alt={plan.board.alt}
              width={plan.board.width}
              height={plan.board.height}
              sizes="(max-width: 768px) 100vw, 1040px"
              quality={82}
              className={styles.shot}
            />
          </div>
        </Overlay>
      ) : null}
    </>
  );
}
