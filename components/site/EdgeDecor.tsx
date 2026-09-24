import Image from 'next/image';
import { versioned } from '@/lib/assets';
import styles from './EdgeDecor.module.css';

/** Объемные фигуры по левому и правому краю страницы (правка заказчика
 *  2026-09-24). Слой лежит поверх полос: секции рисуют непрозрачный фон, и
 *  декор под ними был бы не виден. Нажатия слой не перехватывает.
 *
 *  Положение задано долей высоты страницы, а не экранами (`vh`): на короткой
 *  странице фигура, отложенная на два экрана вниз, растянула бы прокрутку
 *  пустотой. Доля высоты работает одинаково и на главной, и на политике.
 *
 *  Ширина фигуры считается от свободного поля сбоку от колонки содержимого:
 *  `(100vw - --max) / 2 + --gut`. Уже 1280px поля почти нет, и слой скрыт
 *  целиком - иначе фигуры легли бы на текст. */

type Shape = { src: string; width: number; height: number };

const shapes = {
  shield: { src: '/decor/shield.webp', width: 461, height: 565 },
  stack: { src: '/decor/stack.webp', width: 480, height: 483 },
  network: { src: '/decor/network.webp', width: 480, height: 347 },
  loop: { src: '/decor/loop.webp', width: 480, height: 475 },
  sphere: { src: '/decor/sphere.webp', width: 480, height: 505 },
} satisfies Record<string, Shape>;

/** Доля высоты страницы, сторона, множитель размера и длительность качания.
 *  Первая фигура идет с 18%: выше стоит первый экран со своим объектом. */
const placed: { shape: keyof typeof shapes; side: 'left' | 'right'; top: number; k: number; dur: number }[] = [
  { shape: 'shield', side: 'left', top: 18, k: 1, dur: 9 },
  { shape: 'stack', side: 'right', top: 27, k: 0.82, dur: 11 },
  { shape: 'network', side: 'left', top: 38, k: 1.1, dur: 10 },
  { shape: 'loop', side: 'right', top: 48, k: 0.9, dur: 12 },
  { shape: 'sphere', side: 'left', top: 58, k: 0.85, dur: 9.5 },
  { shape: 'shield', side: 'right', top: 68, k: 1.05, dur: 11.5 },
  { shape: 'network', side: 'left', top: 78, k: 0.8, dur: 10.5 },
  { shape: 'sphere', side: 'right', top: 86, k: 1, dur: 12.5 },
];

export function EdgeDecor() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {placed.map((item, index) => {
        const shape = shapes[item.shape];
        return (
          <div
            key={`${item.shape}-${index}`}
            className={styles.item}
            data-side={item.side}
            style={{ top: `${item.top}%`, '--k': item.k, '--dur': `${item.dur}s` } as React.CSSProperties}
          >
            <Image
              src={versioned(shape.src)}
              alt=""
              width={shape.width}
              height={shape.height}
              sizes="160px"
              quality={82}
              className={styles.shape}
            />
          </div>
        );
      })}
    </div>
  );
}
