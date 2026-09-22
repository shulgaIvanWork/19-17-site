'use client';

import styles from '../BandArt.module.css';
import { Chrome, FakeBtn, Node, Pane, Piece, RowHit, T, Tick } from '../bandParts';

export function AuditSheet() {
  const checks = [
    { label: 'Скорость', note: '2,8 с', on: true, write: 'B' as const },
    { label: 'Мобильная', note: 'есть', on: true, write: 'B' as const },
    { label: 'Формы заявок', note: 'ошибка', on: false, write: 'C' as const },
    { label: 'Заголовки', note: 'частично', on: true, write: 'C' as const },
    { label: 'Изображения', note: '4,1 МБ', on: false, write: 'D' as const },
  ];
  return (
    <g>
      <Piece kind="sortL" origin="158px 200px">
        <Pane x={32} y={38} w={252} h={324} r={18} kind="glassLift" />
        <Chrome x={32} y={74} w={252} url="client.ru" />
        <T x="44" y="98" k="typeSub" write="A">
          Главная · Каталог · Контакты
        </T>
        <RowHit x={44} y={112} w={228} h={64} r={12} rest>
          <T x="56" y="136" write="B">
            Поставка оборудования
          </T>
          <T x="56" y="154" k="typeSub" write="B">
            Станки, насосы, комплектующие
          </T>
        </RowHit>
        <g className={styles.rowHit}>
          <Pane x={44} y={188} w={108} h={58} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={44} y={188} width={108} height={58} rx={12} />
          <T x="56" y="210" write="C">
            Каталог
          </T>
          <T x="56" y="228" k="typeSub" write="C">
            240 позиций
          </T>
        </g>
        <g className={styles.rowHit}>
          <Pane x={164} y={188} w={108} h={58} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={164} y={188} width={108} height={58} rx={12} />
          <T x="176" y="210" write="C">
            Заявка
          </T>
          <T x="176" y="228" k="typeSub" write="C">
            форма не уходит
          </T>
        </g>
        <g className={styles.rowHit}>
          <Pane x={44} y={258} w={228} h={86} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={44} y={258} width={228} height={86} rx={12} />
          <T x="56" y="280" write="D">
            Контакты
          </T>
          <T x="56" y="298" k="typeSub" write="D">
            Телефон есть, схемы проезда нет
          </T>
          <T x="56" y="316" k="typeSub" write="D">
            Реквизиты и карта не размечены
          </T>
        </g>
        <FakeBtn x={44} y={332} w={148} h={24} label="Заказать аудит" />
      </Piece>
      <Piece kind="sortR" origin="388px 200px">
        <Pane x={300} y={54} w={176} h={292} r={18} kind="glassLift" />
        <T x="316" y="80" k="typeLead" write="A">
          Аудит сайта
        </T>
        <path className={styles.hair} d="M 300 94 H 476" />
        <circle className={styles.glassSoft} cx="388" cy="136" r="28" />
        <T x="388" y="132" k="typeLead" anchor="middle" write="B">
          68
        </T>
        <T x="388" y="148" k="typeSub" anchor="middle" write="B">
          из 100
        </T>
        {checks.map((item, i) => (
          <RowHit key={item.label} x={308} y={172 + i * 32} w={160} h={28} r={8}>
            <Tick x={316} y={176 + i * 32} on={item.on} />
            <T x="340" y={188 + i * 32} write={item.write}>
              {item.label}
            </T>
            <T x="460" y={188 + i * 32} k="typeSub" anchor="end" write={item.write}>
              {item.note}
            </T>
          </RowHit>
        ))}
      </Piece>
      <Piece kind="lock">
        <Node cx={32} cy={74} />
        <Node cx={300} cy={94} />
      </Piece>
    </g>
  );
}
