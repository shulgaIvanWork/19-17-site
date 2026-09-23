import Image from 'next/image';
import { photoBlur } from '@/content/photoBlur';
import type { FlowStep } from '@/content/works';
import { versioned } from '@/lib/assets';
import styles from './ProjectFlow.module.css';

/** Путь проекта по этапам: на каждый этап своя строка - номер, что на нем
 *  делается и лист с результатом.
 *
 *  Раньше все восемь листов были сведены в один холст: он помещался на экран
 *  целиком, но прочитать на нем было нечего (правка заказчика 2026-09-24).
 *
 *  Листы показаны целиком, ни один не обрезан и не раскрывается по нажатию:
 *  заказчик перебрал их по одному и просмотр не понадобился нигде. Поэтому
 *  компонент серверный - ни состояния, ни обработчиков тут нет. */
export function ProjectFlow({ steps, caption }: { steps: FlowStep[]; caption: string }) {
  return (
    <>
      <p className={['footnote', styles.caption].join(' ')}>{caption}</p>

      <ol className={styles.flow}>
        {steps.map((step) => {
          const blur = photoBlur[step.shot.src];

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

              {/* Пропорция кадра - пропорция самого листа: лист виден целиком. */}
              <div
                className={styles.sheet}
                style={{ aspectRatio: step.shot.width / step.shot.height }}
              >
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
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
