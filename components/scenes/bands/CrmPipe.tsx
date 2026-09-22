'use client';

import styles from '../BandArt.module.css';
import { FakeBtn, Node, Pane, Piece, T } from '../bandParts';

function Deal({
  x,
  y,
  title,
  meta,
  sum,
  hot,
  write = 'B',
}: {
  x: number;
  y: number;
  title: string;
  meta: string;
  sum: string;
  hot?: boolean;
  write?: 'A' | 'B' | 'C' | 'D';
}) {
  return (
    <g className={styles.rowHit}>
      <rect className={styles.glassSoft} x={x} y={y} width="120" height="72" rx="12" />
      {hot ? <rect className={`${styles.glassInk} ${styles.rest}`} x={x} y={y} width="120" height="72" rx="12" /> : null}
      <rect className={styles.wash} x={x} y={y} width="120" height="72" rx="12" />
      <T x={x + 12} y={y + 22} write={write}>
        {title}
      </T>
      <T x={x + 12} y={y + 40} k="typeSub" write={write}>
        {meta}
      </T>
      <T x={x + 12} y={y + 58} k={hot ? 'type' : 'typeSub'} write={write}>
        {sum}
      </T>
    </g>
  );
}

export function CrmPipe() {
  return (
    <g>
      <Piece kind="sortL" origin="100px 200px">
        <Pane x={32} y={42} w={136} h={316} r={16} kind="glassLift" />
        <T x="48" y="68" write="A">
          Лиды
        </T>
        <T x="118" y="68" k="typeSub" write="A">
          3
        </T>
        <Deal x={40} y={84} title="Заявка с сайта" meta="Форма · сегодня" sum="ожидает" write="B" />
        <Deal x={40} y={166} title="Звонок 12:40" meta="Входящий" sum="перезвонить" write="C" />
        <Deal x={40} y={248} title="Письмо с КП" meta="Повторный контакт" sum="ожидает" write="D" />
        <T x="48" y="340" k="typeSub" write="D">
          новые
        </T>
      </Piece>
      <Piece kind="sortM" origin="250px 200px">
        <Pane x={182} y={42} w={136} h={316} r={16} kind="glassLift" />
        <T x="198" y="68" write="A">
          Сделки
        </T>
        <T x="268" y="68" k="typeSub" write="A">
          3
        </T>
        <Deal x={190} y={84} title="ООО «Вектор»" meta="КП отправлено" sum="420 000 ₽" hot write="B" />
        <Deal x={190} y={166} title="ИП Сергеев" meta="Счет выставлен" sum="86 000 ₽" write="C" />
        <Deal x={190} y={248} title="«Рассвет»" meta="Согласование" sum="1,2 млн ₽" write="D" />
        <T x="198" y="340" k="typeSub" write="D">
          в работе
        </T>
      </Piece>
      <Piece kind="sortR" origin="400px 200px">
        <Pane x={332} y={42} w={136} h={316} r={16} kind="glassLift" />
        <T x="348" y="68" write="A">
          Успех
        </T>
        <T x="418" y="68" k="typeSub" write="A">
          2
        </T>
        <Deal x={340} y={84} title="Договор" meta="Оплата получена" sum="310 000 ₽" write="B" />
        <Deal x={340} y={166} title="Отгрузка" meta="Статус на сайт" sum="закрыто" write="C" />
        <FakeBtn x={340} y={248} w={120} label="К сделке" />
        <T x="348" y="340" k="typeSub" write="D">
          закрыто
        </T>
      </Piece>
      <Piece kind="lock">
        <path className={styles.line} d="M 168 60 H 182" />
        <path className={styles.line} d="M 174 50 L 182 60 L 174 70" />
        <path className={styles.line} d="M 318 60 H 332" />
        <path className={styles.line} d="M 324 50 L 332 60 L 324 70" />
        <Node cx={100} cy={42} />
        <Node cx={250} cy={42} />
        <Node cx={400} cy={42} />
      </Piece>
    </g>
  );
}
