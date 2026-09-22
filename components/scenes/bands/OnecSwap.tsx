'use client';

import styles from '../BandArt.module.css';
import { Chrome, FakeBtn, Node, Pane, Piece, RowHit, T } from '../bandParts';

export function OnecSwap() {
  const rows = [
    { code: '00-12', name: 'Насос ЦНС', price: '24 400', write: 'B' as const },
    { code: '00-18', name: 'Редуктор Ч-80', price: '9 870', write: 'C' as const },
    { code: '00-21', name: 'Подшипник 6205', price: '640', write: 'D' as const },
  ];
  return (
    <g>
      <Piece kind="sortL" origin="128px 200px">
        <Pane x={30} y={42} w={196} h={316} r={16} kind="glassLift" />
        <T x="44" y="66" write="A">
          1С:Предприятие
        </T>
        <path className={styles.hair} d="M 30 78 H 226" />
        <T x="40" y="98" k="typeSub" write="A">
          Код
        </T>
        <T x="78" y="98" k="typeSub" write="A">
          Номенклатура
        </T>
        <T x="176" y="98" k="typeSub" write="A">
          Цена
        </T>
        {rows.map((row, i) => {
          const y = 128 + i * 40;
          return (
            <RowHit key={row.code} x={38} y={y - 18} w={180} h={34} r={8} rest={i === 1}>
              <T x="40" y={y} k="typeSub" write={row.write}>
                {row.code}
              </T>
              <T x="78" y={y} write={row.write}>
                {row.name}
              </T>
              <T x="176" y={y} k="typeSub" write={row.write}>
                {row.price}
              </T>
            </RowHit>
          );
        })}
        <RowHit x={42} y={242} w={172} h={42} r={8}>
          <T x="44" y="256" k="typeSub" write="C">
            Остаток по складу: 4 шт.
          </T>
          <T x="44" y="274" k="typeSub" write="C">
            Тип цен: оптовая
          </T>
        </RowHit>
        <g className={styles.rowHit}>
          <Pane x={44} y={292} w={168} h={48} r={12} kind="glassSoft" />
          <rect className={styles.wash} x={44} y={292} width={168} height={48} rx={12} />
          <T x="56" y="312" write="D">
            Заказ покупателя № 184
          </T>
          <T x="56" y="328" k="typeSub" write="D">
            к передаче на сайт
          </T>
        </g>
      </Piece>
      <Piece kind="lock">
        <path className={styles.line} d="M 226 140 H 272" />
        <path className={styles.line} d="M 258 126 L 272 140 L 258 154" />
        <path className={styles.line} d="M 272 236 H 226" />
        <path className={styles.line} d="M 240 222 L 226 236 L 240 250" />
        <T x="249" y="122" k="typeSub" anchor="middle">
          цены
        </T>
        <T x="249" y="262" k="typeSub" anchor="middle">
          заказы
        </T>
        <Node cx={226} cy={140} />
        <Node cx={284} cy={236} />
      </Piece>
      <Piece kind="sortR" origin="380px 200px">
        <Pane x={284} y={42} w={192} h={316} r={16} kind="glassLift" />
        <Chrome x={284} y={78} w={192} url="shop.ru/item" />
        <RowHit x={300} y={92} w={160} h={70} r={12} rest>
          <T x="312" y="116" write="A">
            Редуктор Ч-80
          </T>
          <T x="312" y="134" k="typeSub" write="B">
            9 870 ₽ · 4 шт. на складе
          </T>
          <T x="312" y="150" k="typeSub" write="B">
            код 00-18 · из 1С
          </T>
        </RowHit>
        <T x="312" y="180" write="C">
          Характеристики
        </T>
        <T x="312" y="200" k="typeSub" write="C">
          Передаточное число 40
        </T>
        <T x="312" y="216" k="typeSub" write="C">
          Межосевое расстояние 80 мм
        </T>
        <T x="312" y="248" write="D">
          Остаток
        </T>
        <T x="312" y="266" k="typeSub" write="D">
          Обновляется из 1С каждые 15 мин
        </T>
        <FakeBtn x={300} y={288} w={76} h={52} label="В корзину" />
        <FakeBtn x={384} y={288} w={76} h={52} label="Заказать" />
      </Piece>
    </g>
  );
}
