'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Overlay } from '@/components/ui/Overlay';
import { photoBlur } from '@/content/photoBlur';
import type { FlowStep } from '@/content/works';
import { versioned } from '@/lib/assets';
import styles from './ProjectFlow.module.css';

/** Предел высоты кадра: лист не бывает выше собственной ширины. Без предела
 *  сетка референсов, отобранные снимки и готовая страница занимают по экрану
 *  каждая. Предел задан пропорцией, а не пикселями: тогда обрезаются одни и те
 *  же листы на любой ширине экрана.
 *
 *  Под предел попадают три листа из восьми, они и открываются по нажатию.
 *  Остальные видны целиком, и раскрывать у них нечего (правка заказчика
 *  2026-09-24). */
const minRatio = 1;

/** Путь проекта по этапам: на каждый этап своя строка - номер, что на нем
 *  делается и лист с результатом. Раньше все восемь листов были сведены в один
 *  холст: он помещался на экран целиком, но прочитать на нем было нечего
 *  (правка заказчика 2026-09-24).
 *
 *  Нажатие открывает лист целиком, поэтому компонент клиентский. */
export function ProjectFlow({ steps, caption }: { steps: FlowStep[]; caption: string }) {
  const [openN, setOpenN] = useState<number | null>(null);
  const open = steps.find((step) => step.n === openN) ?? null;

  return (
    <>
      <p className={['footnote', styles.caption].join(' ')}>{caption}</p>

      <ol className={styles.flow}>
        {steps.map((step) => {
          const ratio = step.shot.width / step.shot.height;
          const clipped = ratio < minRatio;
          const blur = photoBlur[step.shot.src];

          const sheet = (
            <Image
              src={versioned(step.shot.src)}
              alt={step.shot.alt}
              fill
              sizes="(max-width: 900px) 92vw, 1000px"
              quality={82}
              placeholder={blur ? 'blur' : 'empty'}
              blurDataURL={blur}
              className={styles.shot}
            />
          );

          return (
            <li key={step.n} className={styles.step}>
              <div className={styles.copy}>
                <div className={styles.num}>{String(step.n).padStart(2, '0')}</div>
                <h3 className="h3" style={{ marginTop: 12 }}>
                  {step.title}
                </h3>
                <p className="body" style={{ marginTop: 8 }}>
                  {step.body}
                </p>
              </div>

              {/* Обрезанный лист открывается по нажатию, целый остается
                  картинкой: нажимать на него незачем. Подписи про просмотр нет,
                  она закрывала собой низ листа. */}
              {clipped ? (
                <button
                  type="button"
                  className={[styles.sheet, styles.zoom].join(' ')}
                  style={{ aspectRatio: minRatio }}
                  onClick={() => setOpenN(step.n)}
                  data-cursor-skip
                  aria-label={`Открыть лист целиком: ${step.title}`}
                >
                  {sheet}
                </button>
              ) : (
                <div className={styles.sheet} style={{ aspectRatio: ratio }}>
                  {sheet}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {open ? (
        <Overlay size="wide" labelledBy="flow-view-title" onClose={() => setOpenN(null)}>
          <div className={styles.head}>
            <div>
              <div className={styles.kind}>{`Этап ${open.n}`}</div>
              <h2 id="flow-view-title" className={styles.title}>
                {open.title}
              </h2>
            </div>
            <button type="button" className={styles.close} onClick={() => setOpenN(null)} aria-label="Закрыть">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className={styles.page}>
            {/* Ширину держит панель, высоту задает сам лист: у листов этапов
                пропорции разные, одной на всех нет. */}
            <Image
              src={versioned(open.shot.src)}
              alt={open.shot.alt}
              width={open.shot.width}
              height={open.shot.height}
              sizes="(max-width: 768px) 100vw, 1040px"
              quality={82}
              placeholder={photoBlur[open.shot.src] ? 'blur' : 'empty'}
              blurDataURL={photoBlur[open.shot.src]}
              className={styles.full}
            />
          </div>
        </Overlay>
      ) : null}
    </>
  );
}
