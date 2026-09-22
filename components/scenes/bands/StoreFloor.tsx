'use client';

import styles from '../BandArt.module.css';
import { Chip, Chrome, FakeBtn, Node, Pane, Piece, RowHit, T } from '../bandParts';

export function StoreFloor() {
  const rows = [
    { name: 'Станок 16К20', price: '186 000 ₽', stock: '2 шт.', hot: true, write: 'B' as const },
    { name: 'Насос ЦНС 13-70', price: '24 400 ₽', stock: '12 шт.', hot: false, write: 'C' as const },
    { name: 'Редуктор Ч-80', price: '9 870 ₽', stock: '4 шт.', hot: false, write: 'C' as const },
    { name: 'Подшипник 6205', price: '640 ₽', stock: '86 шт.', hot: false, write: 'D' as const },
  ];
  return (
    <g>
      <Piece kind="sortL" origin="178px 200px">
        <Pane x={32} y={34} w={292} h={332} r={18} kind="glassLift" />
        <Chrome x={32} y={70} w={292} url="shop.ru/catalog" />
        <g className={styles.rowHit}>
          <rect className={styles.glassSoft} x="44" y="84" width="268" height="28" rx="14" />
          <rect className={styles.wash} x="44" y="84" width="268" height="28" rx="14" />
          <T x="56" y="103" k="typeSub" write="A">
            Поиск по каталогу · насос
          </T>
        </g>
        <Chip x={44} y={122} w={52} label="Цена" />
        <Chip x={102} y={122} w={88} label="В наличии" on />
        <Chip x={196} y={122} w={56} label="Склад" />
        <Chip x={258} y={122} w={54} label="Новое" />
        {/* Шапка на 160, строки с 192: подложка первой строки начинается на
            y - 18, и при шапке на 168 и строках с 186 она наезжала на шапку. */}
        <T x="56" y="160" k="typeSub" write="A">
          Наименование
        </T>
        <T x="214" y="160" k="typeSub" write="A">
          Цена
        </T>
        <T x="276" y="160" k="typeSub" write="A">
          Ост.
        </T>
        {rows.map((row, i) => {
          const y = 192 + i * 38;
          return (
            <RowHit key={row.name} x={44} y={y - 18} w={268} h={34} r={10} rest={row.hot}>
              <T x="56" y={y} write={row.write}>
                {row.name}
              </T>
              <T x="214" y={y} k={row.hot ? 'type' : 'typeSub'} write={row.write}>
                {row.price}
              </T>
              <T x="276" y={y} k="typeSub" write={row.write}>
                {row.stock}
              </T>
            </RowHit>
          );
        })}
      </Piece>
      <Piece kind="sortR" origin="406px 200px">
        <Pane x={336} y={46} w={140} h={308} r={18} kind="glassLift" />
        <T x="350" y="72" k="typeLead" write="A">
          Корзина
        </T>
        <path className={styles.hair} d="M 336 84 H 476" />
        <RowHit x={344} y={92} w={124} h={42} r={8}>
          <T x="350" y="108" write="B">
            Станок 16К20
          </T>
          <T x="350" y="126" k="typeSub" write="B">
            1 × 186 000 ₽
          </T>
        </RowHit>
        <RowHit x={344} y={140} w={124} h={42} r={8}>
          <T x="350" y="156" write="C">
            Насос ЦНС 13-70
          </T>
          <T x="350" y="174" k="typeSub" write="C">
            1 × 24 400 ₽
          </T>
        </RowHit>
        <RowHit x={344} y={188} w={124} h={42} r={8}>
          <T x="350" y="204" k="typeSub" write="C">
            Доставка
          </T>
          <T x="350" y="222" write="D">
            по договору
          </T>
        </RowHit>
        <path className={styles.hair} d="M 350 242 H 462" />
        <T x="350" y="264" k="typeSub" write="D">
          Итого
        </T>
        <T x="350" y="284" k="typeLead" write="D">
          210 400 ₽
        </T>
        <FakeBtn x={350} y={300} w={112} label="Оформить" />
      </Piece>
      <Piece kind="lock">
        <Node cx={336} cy={84} />
      </Piece>
    </g>
  );
}
