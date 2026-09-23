'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Overlay } from '@/components/ui/Overlay';
import { WorkCard } from './WorkCard';
import type { Work } from '@/content/works';
import { versioned } from '@/lib/assets';
import styles from './WorksGallery.module.css';

/** Сетка работ. В карточке виден только первый экран макета; нажатие открывает
 *  макет целиком в оверлее. У работы без снимка `full` карточка не нажимается -
 *  открывать нечего. */
export function WorksGallery({ works }: { works: Work[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = works.find((work) => work.id === openId) ?? null;

  return (
    <>
      <div className={styles.grid}>
        {works.map((work) => (
          <WorkCard key={work.id} work={work} onOpen={work.full ? () => setOpenId(work.id) : undefined} />
        ))}
      </div>

      {open?.full ? (
        <Overlay size="wide" labelledBy="work-view-title" onClose={() => setOpenId(null)}>
          <div className={styles.head}>
            <div>
              <div className={styles.kind}>{open.kind}</div>
              <h2 id="work-view-title" className={styles.title}>
                {open.title}
              </h2>
            </div>
            <button type="button" className={styles.close} onClick={() => setOpenId(null)} aria-label="Закрыть">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className={styles.sheet}>
            {/* Ширину держит панель, высоту задает само изображение: макеты
                разной длины, фиксированной пропорции у них нет. */}
            <Image
              src={versioned(open.full.src)}
              alt={`${open.title}: макет целиком`}
              width={open.full.width}
              height={open.full.height}
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
