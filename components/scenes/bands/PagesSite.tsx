'use client';

import styles from '../BandArt.module.css';
import { Chip, Chrome, FakeBtn, Node, Pane, Piece, RowHit, T } from '../bandParts';

export function PagesSite() {
  return (
    <g>
      <path
        className={`${styles.line} ${styles.piece} ${styles.scribble}`}
        d="M 190 210 C 220 168 250 252 292 198 C 328 154 358 246 402 204"
      />
      <Piece kind="sortM" origin="250px 210px">
        <Pane x={34} y={46} w={432} h={328} r={18} kind="glassLift" />
        <Chrome x={34} y={82} w={432} url="site.ru/o-kompanii" />
      </Piece>
      <Piece kind="sortC" origin="200px 103px">
        <Chip x={46} y={92} w={78} label="Главная" />
        <Chip x={130} y={92} w={88} label="Компания" on />
        <Chip x={224} y={92} w={72} label="Услуги" />
        <Chip x={302} y={92} w={58} label="Блог" />
      </Piece>
      <Piece kind="sortL" origin="105px 241px">
        <Pane x={46} y={128} w={118} h={226} r={12} />
        <T x="58" y="152" k="typeSub" write="A">
          Разделы
        </T>
        <RowHit x={54} y={164} w={102} h={28} r={8} rest>
          <T x="64" y="183" write="B">
            О компании
          </T>
        </RowHit>
        <RowHit x={54} y={196} w={102} h={22} r={8}>
          <T x="64" y="212" k="typeSub" write="B">
            Услуги
          </T>
        </RowHit>
        <RowHit x={54} y={218} w={102} h={20} r={8}>
          <T x="74" y="232" k="typeSub" write="C">
            Производство
          </T>
        </RowHit>
        <RowHit x={54} y={238} w={102} h={20} r={8}>
          <T x="74" y="250" k="typeSub" write="C">
            Поставки
          </T>
        </RowHit>
        <RowHit x={54} y={260} w={102} h={22} r={8}>
          <T x="64" y="274" k="typeSub" write="D">
            Кейсы
          </T>
        </RowHit>
        <RowHit x={54} y={282} w={102} h={22} r={8}>
          <T x="64" y="294" k="typeSub" write="D">
            Контакты
          </T>
        </RowHit>
      </Piece>
      <Piece kind="sortR" origin="320px 230px">
        <T x="180" y="152" k="typeLead" write="A">
          О компании
        </T>
        <T x="180" y="176" k="typeSub" write="B">
          Проектируем и запускаем сайты
        </T>
        <T x="180" y="194" k="typeSub" write="B">
          для производства и оптовой торговли:
        </T>
        <T x="180" y="212" k="typeSub" write="C">
          структура, тексты и запуск в одном договоре.
        </T>
        <g className={styles.rowHit}>
          <Pane x={180} y={228} w={84} h={70} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={180} y={228} width={84} height={70} rx={12} />
          <T x="192" y="250" write="C">
            Цех
          </T>
          <T x="192" y="268" k="typeSub" write="C">
            Станки
          </T>
          <T x="192" y="284" k="typeSub" write="D">
            и сроки
          </T>
        </g>
        <g className={styles.rowHit}>
          <Pane x={272} y={228} w={84} h={70} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={272} y={228} width={84} height={70} rx={12} />
          <T x="284" y="250" write="C">
            Склад
          </T>
          <T x="284" y="268" k="typeSub" write="C">
            Поставки
          </T>
          <T x="284" y="284" k="typeSub" write="D">
            и отгрузка
          </T>
        </g>
        <g className={styles.rowHit}>
          <Pane x={364} y={228} w={82} h={70} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={364} y={228} width={82} height={70} rx={12} />
          <T x="376" y="250" write="C">
            Сервис
          </T>
          <T x="376" y="268" k="typeSub" write="C">
            Заявка
          </T>
          <T x="376" y="284" k="typeSub" write="D">
            за 15 минут
          </T>
        </g>
        <FakeBtn x={180} y={328} w={148} label="Оставить заявку" />
      </Piece>
      <Piece kind="lock">
        <Node cx={34} cy={82} />
        <Node cx={466} cy={82} />
      </Piece>
    </g>
  );
}
