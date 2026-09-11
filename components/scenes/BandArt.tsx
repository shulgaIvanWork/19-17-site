'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';
import styles from './BandArt.module.css';
import { useSceneProgress } from './useSceneProgress';

export type SceneId =
  | 'pagesSite'
  | 'storeFloor'
  | 'auditSheet'
  | 'onecSwap'
  | 'crmPipe'
  | 'aiStack';

const scenes: Record<SceneId, (props: { uid: string }) => ReactNode> = {
  pagesSite: PagesSite,
  storeFloor: StoreFloor,
  auditSheet: AuditSheet,
  onecSwap: OnecSwap,
  crmPipe: CrmPipe,
  aiStack: AiStack,
};

/** Column illustration beside the matching copy - not a separate band above it. */
export function ScenePanel({ kind }: { kind: SceneId }) {
  const ref = useRef<HTMLDivElement>(null);
  useSceneProgress(ref);
  const Scene = scenes[kind];
  return (
    <div className={styles.lead} aria-hidden="true">
      <div ref={ref} className={styles.frame} data-cursor-glow="scene">
        <div className={styles.stage}>
          <svg className={styles.svg} viewBox="0 0 500 400" fill="none">
            <Scene uid={kind} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Piece({
  kind,
  origin,
  children,
}: {
  kind: 'sortL' | 'sortR' | 'sortM' | 'sortC' | 'stray' | 'scribble' | 'lock';
  origin?: string;
  children: ReactNode;
}) {
  return (
    <g className={`${styles.piece} ${styles[kind]}`} style={origin ? ({ transformOrigin: origin } as CSSProperties) : undefined}>
      {children}
    </g>
  );
}

function T({
  x,
  y,
  children,
  k = 'type',
  anchor = 'start',
  write,
}: {
  x: number | string;
  y: number | string;
  children: string;
  k?: 'type' | 'typeSub' | 'typeLead';
  anchor?: 'start' | 'middle' | 'end';
  write?: 'A' | 'B' | 'C' | 'D';
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={[styles[k], write ? styles[`write${write}`] : ''].filter(Boolean).join(' ')}
    >
      {children}
    </text>
  );
}

function Pane({
  x,
  y,
  w,
  h,
  r = 14,
  kind = 'glass',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  kind?: 'glass' | 'glassLift' | 'glassInk' | 'glassSoft';
}) {
  const shine = kind === 'glass' || kind === 'glassLift';
  return (
    <g>
      <rect className={styles[kind]} x={x} y={y} width={w} height={h} rx={r} />
      {shine ? (
        <rect className={styles.shine} x={x + 10} y={y + 2} width={Math.max(24, w - 20)} height={Math.min(18, h * 0.12)} rx={9} />
      ) : null}
    </g>
  );
}

function Dot({ cx, cy, r = 2.1 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} className={styles.dot} />;
}

function Node({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle className={styles.nodeRing} cx={cx} cy={cy} r="5.5" />
      <Dot cx={cx} cy={cy} />
    </g>
  );
}

function Chrome({ x, y, w, url }: { x: number; y: number; w: number; url?: string }) {
  const bar = Math.min(248, w - 88);
  return (
    <g>
      <path className={styles.hair} d={`M ${x} ${y} H ${x + w}`} />
      <circle className={styles.win} cx={x + 18} cy={y - 16} r="4" />
      <circle className={styles.win} cx={x + 36} cy={y - 16} r="4" />
      <circle className={styles.win} cx={x + 54} cy={y - 16} r="4" />
      {url ? (
        <>
          <rect className={styles.glassSoft} x={x + 72} y={y - 24} width={bar} height="16" rx="8" />
          <T x={x + 84} y={y - 12} k="typeSub">
            {url}
          </T>
        </>
      ) : null}
    </g>
  );
}

function Tick({ x, y, on = true }: { x: number; y: number; on?: boolean }) {
  return (
    <g>
      <rect className={styles.glassSoft} x={x} y={y} width="16" height="16" rx="4" />
      {on ? <rect className={`${styles.glassInk} ${styles.rest}`} x={x} y={y} width="16" height="16" rx="4" /> : null}
      {on ? <path className={styles.line} d={`M ${x + 3.5} ${y + 8.5} L ${x + 7} ${y + 12} L ${x + 12.5} ${y + 4.5}`} /> : null}
    </g>
  );
}

function Chip({
  x,
  y,
  w,
  label,
  on,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  on?: boolean;
}) {
  return (
    <g className={styles.rowHit}>
      <rect className={styles.glassSoft} x={x} y={y} width={w} height="22" rx="11" />
      {on ? <rect className={`${styles.glassInk} ${styles.rest}`} x={x} y={y} width={w} height="22" rx="11" /> : null}
      <rect className={styles.wash} x={x} y={y} width={w} height="22" rx="11" />
      <T x={x + w / 2} y={y + 15} k={on ? 'type' : 'typeSub'} anchor="middle">
        {label}
      </T>
    </g>
  );
}

function RowHit({
  x,
  y,
  w,
  h,
  r = 10,
  rest,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  rest?: boolean;
  children: ReactNode;
}) {
  return (
    <g className={styles.rowHit}>
      {rest ? <rect className={styles.glassSoft} x={x} y={y} width={w} height={h} rx={r} /> : null}
      {rest ? <rect className={`${styles.glassInk} ${styles.rest}`} x={x} y={y} width={w} height={h} rx={r} /> : null}
      <rect fill="transparent" x={x} y={y} width={w} height={h} rx={r} />
      <rect className={styles.wash} x={x} y={y} width={w} height={h} rx={r} />
      {children}
    </g>
  );
}

function FakeBtn({
  x,
  y,
  w,
  label,
  h = 32,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  h?: number;
}) {
  return (
    <g className={`${styles.fakeBtn} ${styles.rowHit}`}>
      <rect className={styles.glassSoft} x={x} y={y} width={w} height={h} rx={h / 2} />
      <rect className={`${styles.glassInk} ${styles.rest}`} x={x} y={y} width={w} height={h} rx={h / 2} />
      <rect className={styles.wash} x={x} y={y} width={w} height={h} rx={h / 2} />
      <T x={x + w / 2} y={y + h * 0.64} anchor="middle">
        {label}
      </T>
    </g>
  );
}

function PagesSite({ uid }: { uid: string }) {
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

function StoreFloor({ uid }: { uid: string }) {
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

function AuditSheet({ uid }: { uid: string }) {
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

function OnecSwap({ uid }: { uid: string }) {
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

function CrmPipe({ uid }: { uid: string }) {
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

function AiStack({ uid }: { uid: string }) {
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
            Qwen
          </T>
          <T x="236" y="214" k="typeSub" anchor="middle" write="C">
            8B · локально
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
