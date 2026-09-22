'use client';

import { useRef } from 'react';
import styles from './BoardScene.module.css';
import { useSceneGaze } from './useSceneGaze';
import { useSceneProgress } from './useSceneProgress';

/** Доска - это сайт, фигура - подрядчик. Прокрутка вниз собирает раскладку,
 *  вверх разбирает. Ход сцены считается по ее положению в экране. */
export function BoardScene() {
  const ref = useRef<HTMLDivElement>(null);
  useSceneProgress(ref);
  useSceneGaze(ref);

  return (
    <div
      ref={ref}
      className={styles.frame}
      data-cursor-glow="scene"
      role="img"
      aria-label="Исполнитель собирает хаотичные блоки в структуру сайта"
    >
      <svg className={styles.svg} viewBox="0 0 540 360" fill="none">
        <rect className={styles.glass} x="152" y="36" width="356" height="276" rx="16" />
        <path className={styles.hair} d="M 152 66 H 508" />
        <circle className={styles.win} cx="170" cy="51" r="3.4" />
        <circle className={styles.win} cx="184" cy="51" r="3.4" />
        <circle className={styles.win} cx="198" cy="51" r="3.4" />
        <rect className={styles.glassSoft} x="214" y="43" width="168" height="16" rx="8" />
        <text className={styles.copySub} x="226" y="55">
          shop.ru/catalog
        </text>

        <path
          className={`${styles.soft} ${styles.scribble}`}
          d="M 214 168 C 236 132 258 204 286 154 C 312 110 338 198 372 160"
        />

        <g className={`${styles.header} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="172" y="82" width="316" height="24" rx="8" />
          <rect className={styles.wash} x="172" y="82" width="316" height="24" rx="8" />
          <text className={`${styles.copy} ${styles.writeA}`} x="184" y="98">
            Каталог оборудования
          </text>
        </g>
        <g className={`${styles.colL} ${styles.rowHit}`}>
          <rect className={styles.glass} x="172" y="118" width="148" height="172" rx="12" />
          <rect className={styles.wash} x="172" y="118" width="148" height="172" rx="12" />
          <text className={`${styles.copyLead} ${styles.writeB}`} x="186" y="142">
            Фрезерный станок
          </text>
          <text className={`${styles.copySub} ${styles.writeB}`} x="186" y="162">
            Для серийного выпуска
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="186" y="192">
            Мощность 7,5 кВт
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="186" y="210">
            Ход стола 800 мм
          </text>
          <text className={`${styles.copy} ${styles.writeD}`} x="186" y="240">
            1 240 000 ₽
          </text>
          <text className={`${styles.copySub} ${styles.writeD}`} x="186" y="258">
            Гарантия 24 месяца
          </text>
          <text className={`${styles.copySub} ${styles.writeD}`} x="186" y="276">
            Отгрузка со склада
          </text>
        </g>
        <g className={`${styles.colR} ${styles.rowHit}`}>
          <rect className={styles.glass} x="332" y="118" width="156" height="74" rx="12" />
          <rect className={styles.wash} x="332" y="118" width="156" height="74" rx="12" />
          <text className={`${styles.copy} ${styles.writeC}`} x="344" y="140">
            Отзыв заказчика
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="344" y="156">
            5,0 · 18 отзывов
          </text>
          <text className={`${styles.copySub} ${styles.writeD}`} x="344" y="174">
            Сдали в срок, без сюрпризов
          </text>
        </g>
        <g className={`${styles.cta} ${styles.fakeBtn} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="332" y="204" width="156" height="86" rx="18" />
          <rect className={`${styles.glassInk} ${styles.rest}`} x="332" y="204" width="156" height="86" rx="18" />
          <rect className={styles.wash} x="332" y="204" width="156" height="86" rx="18" />
          <text className={`${styles.copy} ${styles.writeD}`} x="410" y="252" textAnchor="middle">
            Обсудить задачу
          </text>
        </g>
        <g className={styles.stray}>
          <rect className={styles.glassSoft} x="390" y="96" width="44" height="36" rx="8" />
        </g>

        <circle className={`${styles.dot} ${styles.lock}`} cx="172" cy="82" r="2.3" />
        <circle className={`${styles.dot} ${styles.lock}`} cx="488" cy="82" r="2.3" />
        <circle className={`${styles.dot} ${styles.lock}`} cx="172" cy="290" r="2.3" />
        <circle className={`${styles.dot} ${styles.lock}`} cx="488" cy="290" r="2.3" />

        <g className={styles.body}>
          <g className={styles.sway}>
            <g className={styles.gaze}>
              <circle className={styles.panel} cx="78" cy="168" r="15" />
              <path className={styles.line} d="M 66 164 C 70 150 90 149 93 163" />
            </g>
            <path className={styles.line} d="M 78 183 V 192" />
            <path className={styles.panel} d="M 62 194 C 62 188 94 188 94 194 L 98 246 C 98 252 58 252 58 246 Z" />
          </g>
          <path className={styles.line} d="M 68 246 L 62 318 M 88 246 L 96 318" />
          <path className={styles.soft} d="M 56 318 H 68 M 90 318 H 104" />
          <path className={styles.soft} d="M 48 318 H 118" />
        </g>
        <g className={styles.armL}>
          <g className={styles.wave}>
            <path className={styles.line} d="M 64 200 L 50 236" />
            <g className={styles.flap}>
              <path className={styles.line} d="M 50 236 L 44 262" />
              <circle className={styles.dot} cx="44" cy="262" r="2.5" />
            </g>
          </g>
        </g>
        <g className={styles.armR}>
          <path className={styles.line} d="M 92 200 L 118 214 L 150 198" />
          <circle className={styles.dot} cx="150" cy="198" r="2.8" />
        </g>
      </svg>
    </div>
  );
}
