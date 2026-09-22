'use client';

import styles from '../BandArt.module.css';
import { FakeBtn, Node, Pane, Piece, RowHit, T } from '../bandParts';

export function AiStack() {
  return (
    <g>
      {/* Схема выровнена по одной оси y = 200: центр карточки документов,
          центр Qwen, обе линии и центр чата. Раньше линии стояли на 126 и 168,
          а карточка шириной 128 не вмещала строку "4.2. Заявление подается"
          (117 при полях 12). */}
      <Piece kind="sortL" origin="96px 200px">
        <Pane x={22} y={90} w={148} h={220} r={16} kind="glassLift" />
        <T x="34" y="112" k="typeSub" write="A">
          Документы
        </T>
        <RowHit x={34} y={128} w={124} h={36} r={8}>
          <T x="34" y="138" write="B">
            Регламент отпуска
          </T>
          <T x="34" y="156" k="typeSub" write="B">
            PDF · 14 страниц
          </T>
        </RowHit>
        <RowHit x={34} y={176} w={124} h={68} r={8}>
          <T x="34" y="184" k="typeSub" write="C">
            4.2. Заявление подается
          </T>
          <T x="34" y="202" k="typeSub" write="C">
            не позднее чем за 14
          </T>
          <T x="34" y="220" k="typeSub" write="C">
            календарных дней до
          </T>
          <T x="34" y="238" k="typeSub" write="C">
            начала отпуска.
          </T>
        </RowHit>
        <RowHit x={34} y={252} w={124} h={22} r={8} rest>
          <T x="42" y="267" k="typeSub" write="D">
            источник · п. 4.2
          </T>
        </RowHit>
        <RowHit x={34} y={280} w={124} h={22} r={8}>
          <T x="34" y="294" k="typeSub" write="D">
            Правила командировок
          </T>
        </RowHit>
      </Piece>
      <Piece kind="sortM" origin="236px 200px">
        <g className={styles.rowHit}>
          <circle className={styles.glassLift} cx="236" cy="200" r="48" />
          <circle className={styles.wash} cx="236" cy="200" r="48" />
          <T x="236" y="196" k="typeLead" anchor="middle" write="B">
            Qwen3-8B
          </T>
          <T x="236" y="214" k="typeSub" anchor="middle" write="C">
            локально
          </T>
        </g>
      </Piece>
      <Piece kind="lock">
        <path className={styles.line} d="M 170 200 H 188" />
        <path className={styles.line} d="M 284 200 H 318" />
        <path className={styles.line} d="M 304 186 L 318 200 L 304 214" />
      </Piece>
      <Piece kind="sortR" origin="397px 200px">
        <Pane x={318} y={42} w={158} h={316} r={18} kind="glassLift" />
        <T x="334" y="68" write="A">
          Чат
        </T>
        <path className={styles.hair} d="M 318 80 H 476" />
        <g className={styles.rowHit}>
          <rect className={styles.glassSoft} x="334" y="96" width="126" height="48" rx="14" />
          <rect className={styles.wash} x="334" y="96" width="126" height="48" rx="14" />
          <T x="346" y="116" k="typeSub" write="B">
            Как оформить отпуск?
          </T>
          <T x="346" y="132" k="typeSub" write="B">
            Кому согласовать?
          </T>
        </g>
        <g className={styles.rowHit}>
          {/* Строки не шире 102 (пузырь 126 при полях 12): прежняя строка
              "за 14 календарных дней." была 116 и вылезала за пузырь. */}
          <rect className={styles.glassSoft} x="334" y="156" width="126" height="124" rx="14" />
          <rect className={`${styles.glassInk} ${styles.rest}`} x="334" y="156" width="126" height="124" rx="14" />
          <rect className={styles.wash} x="334" y="156" width="126" height="124" rx="14" />
          <T x="346" y="176" k="typeSub" write="C">
            Подайте заявление
          </T>
          <T x="346" y="192" k="typeSub" write="C">
            за 14 календарных
          </T>
          <T x="346" y="208" k="typeSub" write="C">
            дней. Согласование
          </T>
          <T x="346" y="224" k="typeSub" write="D">
            у руководителя
          </T>
          <T x="346" y="240" k="typeSub" write="D">
            отдела.
          </T>
          <T x="346" y="262" k="typeSub" write="D">
            Источник: п. 4.2
          </T>
        </g>
        <FakeBtn x={334} y={304} w={126} h={28} label="Спросить" />
      </Piece>
      <Piece kind="lock">
        <Node cx={318} cy={80} />
      </Piece>
    </g>
  );
}
