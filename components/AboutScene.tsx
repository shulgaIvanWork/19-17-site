'use client';

import { useRef } from 'react';
import styles from './AboutScene.module.css';
import { useSceneGaze } from './useSceneGaze';
import { useSceneProgress } from './useSceneProgress';

/** How the two founders work — the About page's main presentational scene.
 *  Scroll sorts a brief into a structured project; two figures run the board. */
export function AboutScene() {
  const ref = useRef<HTMLDivElement>(null);
  useSceneProgress(ref);
  useSceneGaze(ref);

  return (
    <div
      ref={ref}
      className={styles.frame}
      data-cursor-glow="scene"
      role="img"
      aria-label="Два основателя разбирают задачу и собирают её в этапы проекта"
    >
      <svg className={styles.svg} viewBox="0 0 540 360" fill="none">
        <path className={styles.soft} d="M 22 328 H 518" />

        <path
          className={`${styles.soft} ${styles.scribble}`}
          d="M 168 168 C 196 128 228 214 268 154 C 304 102 338 208 382 162"
        />

        <rect className={styles.glass} x="118" y="28" width="304" height="288" rx="16" />
        <path className={styles.hair} d="M 118 58 H 422" />
        <circle className={styles.win} cx="136" cy="43" r="3.4" />
        <circle className={styles.win} cx="150" cy="43" r="3.4" />
        <circle className={styles.win} cx="164" cy="43" r="3.4" />
        <rect className={styles.glassSoft} x="180" y="35" width="156" height="16" rx="8" />
        <text className={styles.copySub} x="192" y="47">
          1917.online/project
        </text>

        <g className={`${styles.brief} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="134" y="74" width="272" height="36" rx="10" />
          <rect className={styles.wash} x="134" y="74" width="272" height="36" rx="10" />
          <text className={`${styles.copy} ${styles.writeA}`} x="146" y="90">
            Входящая задача
          </text>
          <text className={`${styles.copySub} ${styles.writeA}`} x="146" y="104">
            Сайт, обмен с 1С, доступ для отдела продаж
          </text>
        </g>

        <g className={`${styles.stepA} ${styles.rowHit}`}>
          <rect className={styles.glass} x="134" y="122" width="84" height="96" rx="12" />
          <rect className={styles.wash} x="134" y="122" width="84" height="96" rx="12" />
          <text className={`${styles.copySub} ${styles.writeB}`} x="146" y="142">
            01
          </text>
          <text className={`${styles.copy} ${styles.writeB}`} x="146" y="162">
            Разбор
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="146" y="180">
            Что есть
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="146" y="196">
            сейчас
          </text>
        </g>
        <g className={`${styles.stepB} ${styles.rowHit}`}>
          <rect className={styles.glass} x="226" y="122" width="88" height="96" rx="12" />
          <rect className={`${styles.glassInk} ${styles.rest}`} x="226" y="122" width="88" height="96" rx="12" />
          <rect className={styles.wash} x="226" y="122" width="88" height="96" rx="12" />
          <text className={`${styles.copySub} ${styles.writeB}`} x="238" y="142">
            02
          </text>
          <text className={`${styles.copy} ${styles.writeB}`} x="238" y="162">
            Состав
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="238" y="180">
            Этапы
          </text>
          <text className={`${styles.copySub} ${styles.writeC}`} x="238" y="196">
            и стоимость
          </text>
        </g>
        <g className={`${styles.stepC} ${styles.rowHit}`}>
          <rect className={styles.glass} x="322" y="122" width="84" height="96" rx="12" />
          <rect className={styles.wash} x="322" y="122" width="84" height="96" rx="12" />
          <text className={`${styles.copySub} ${styles.writeB}`} x="334" y="142">
            03
          </text>
          <text className={`${styles.copy} ${styles.writeC}`} x="334" y="162">
            Запуск
          </text>
          <text className={`${styles.copySub} ${styles.writeD}`} x="334" y="180">
            Результат
          </text>
          <text className={`${styles.copySub} ${styles.writeD}`} x="334" y="196">
            и поддержка
          </text>
        </g>

        <g className={`${styles.chipL} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="134" y="232" width="84" height="28" rx="14" />
          <rect className={styles.wash} x="134" y="232" width="84" height="28" rx="14" />
          <text className={`${styles.copy} ${styles.writeC}`} x="176" y="250" textAnchor="middle">
            1С
          </text>
        </g>
        <g className={`${styles.chipM} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="226" y="232" width="88" height="28" rx="14" />
          <rect className={`${styles.glassInk} ${styles.rest}`} x="226" y="232" width="88" height="28" rx="14" />
          <rect className={styles.wash} x="226" y="232" width="88" height="28" rx="14" />
          <text className={`${styles.copy} ${styles.writeC}`} x="270" y="250" textAnchor="middle">
            Сайт
          </text>
        </g>
        <g className={`${styles.chipR} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="322" y="232" width="84" height="28" rx="14" />
          <rect className={styles.wash} x="322" y="232" width="84" height="28" rx="14" />
          <text className={`${styles.copy} ${styles.writeC}`} x="364" y="250" textAnchor="middle">
            CRM
          </text>
        </g>

        <g className={`${styles.cta} ${styles.fakeBtn} ${styles.rowHit}`}>
          <rect className={styles.glassSoft} x="176" y="268" width="188" height="36" rx="18" />
          <rect className={`${styles.glassInk} ${styles.rest}`} x="176" y="268" width="188" height="36" rx="18" />
          <rect className={styles.wash} x="176" y="268" width="188" height="36" rx="18" />
          <text className={`${styles.copy} ${styles.writeD}`} x="270" y="291" textAnchor="middle">
            Обсудить задачу
          </text>
        </g>

        <g className={styles.stray}>
          <rect className={styles.glassSoft} x="348" y="86" width="48" height="32" rx="8" />
        </g>

        <circle className={`${styles.dot} ${styles.lock}`} cx="134" cy="74" r="2.3" />
        <circle className={`${styles.dot} ${styles.lock}`} cx="406" cy="74" r="2.3" />
        <circle className={`${styles.dot} ${styles.lock}`} cx="134" cy="300" r="2.3" />
        <circle className={`${styles.dot} ${styles.lock}`} cx="406" cy="300" r="2.3" />

        <path className={`${styles.line} ${styles.lock}`} d="M 96 198 H 118" />
        <path className={`${styles.line} ${styles.lock}`} d="M 422 198 H 444" />

        <g className={styles.bodyL}>
          <g className={styles.swayL}>
            <g className={styles.gazeL}>
              <circle className={styles.panel} cx="58" cy="168" r="14" />
              <path className={styles.line} d="M 47 164 C 51 151 68 150 71 163" />
            </g>
            <path className={styles.line} d="M 58 182 V 190" />
            <path className={styles.panel} d="M 43 192 C 43 186 73 186 73 192 L 77 244 C 77 250 39 250 39 244 Z" />
            <path className={styles.line} d="M 49 244 L 44 318 M 67 244 L 74 318" />
            <path className={styles.soft} d="M 38 318 H 50 M 68 318 H 82" />
          </g>
        </g>
        <g className={styles.armLL}>
          <g className={styles.waveL}>
            <path className={styles.line} d="M 45 198 L 32 232" />
            <g className={styles.flapL}>
              <path className={styles.line} d="M 32 232 L 28 258" />
              <circle className={styles.dot} cx="28" cy="258" r="2.4" />
            </g>
          </g>
        </g>
        <g className={styles.armLR}>
          <path className={styles.line} d="M 71 198 L 92 210 L 116 198" />
          <circle className={styles.dot} cx="116" cy="198" r="2.6" />
        </g>

        <g className={styles.bodyR}>
          <g className={styles.swayR}>
            <g className={styles.gazeR}>
              <circle className={styles.panel} cx="482" cy="168" r="14" />
              <path className={styles.line} d="M 493 164 C 489 151 472 150 469 163" />
            </g>
            <path className={styles.line} d="M 482 182 V 190" />
            <path className={styles.panel} d="M 467 192 C 467 186 497 186 497 192 L 501 244 C 501 250 463 250 463 244 Z" />
            <path className={styles.line} d="M 473 244 L 466 318 M 491 244 L 498 318" />
            <path className={styles.soft} d="M 458 318 H 472 M 492 318 H 506" />
          </g>
        </g>
        <g className={styles.armRL}>
          <path className={styles.line} d="M 469 198 L 448 210 L 424 198" />
          <circle className={styles.dot} cx="424" cy="198" r="2.6" />
        </g>
        <g className={styles.armRR}>
          <g className={styles.waveR}>
            <path className={styles.line} d="M 495 198 L 508 232" />
            <g className={styles.flapR}>
              <path className={styles.line} d="M 508 232 L 514 258" />
              <circle className={styles.dot} cx="514" cy="258" r="2.4" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
