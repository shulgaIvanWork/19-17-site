import type { CSSProperties } from 'react';
import type { PricingMarkId } from '@/content/pricing';
import styles from './PricingMark.module.css';

const DX = 14;
const DY = -8;

type Pt = readonly [number, number];

function quad(a: Pt, b: Pt, c: Pt, d: Pt) {
  return `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`;
}

/** Glass box in the same extrusion as the pricing ₽: top, right wall, front. */
function Box({
  x,
  y,
  w,
  h,
  z = 0,
  d = 1,
  cls,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
  d?: number;
  cls?: string;
}) {
  const fl: Pt = [x + z * DX, y + z * DY];
  const fr: Pt = [x + w + z * DX, y + z * DY];
  const br: Pt = [x + w + (z + d) * DX, y + (z + d) * DY];
  const bl: Pt = [x + (z + d) * DX, y + (z + d) * DY];
  const flb: Pt = [x + z * DX, y + h + z * DY];
  const frb: Pt = [x + w + z * DX, y + h + z * DY];
  const brb: Pt = [x + w + (z + d) * DX, y + h + (z + d) * DY];
  return (
    <g className={cls}>
      <path className={styles.faceTop} d={quad(bl, br, fr, fl)} />
      <path className={styles.faceRight} d={quad(fr, br, brb, frb)} />
      <path className={styles.faceFront} d={quad(fl, fr, frb, flb)} />
    </g>
  );
}

function Dot({ cx, cy, r = 2.1, className }: { cx: number; cy: number; r?: number; className?: string }) {
  return <circle cx={cx} cy={cy} r={r} className={className ?? styles.dot} />;
}

function Ground() {
  return <ellipse className={styles.ground} cx="200" cy="178" rx="132" ry="16" />;
}

function Label({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={styles.caption}>
      {children}
    </text>
  );
}

export function PricingMark({ kind }: { kind: PricingMarkId }) {
  return (
    <div className={styles.stage} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 400 200" fill="none">
        <Ground />
        {kind === 'landing' && <WebNew />}
        {kind === 'pages' && <Pages />}
        {kind === 'store' && <Store />}
        {kind === 'redesign' && <WebRefresh />}
        {kind === 'support' && <WebCare />}
        {kind === 'onec' && <IntPair right="1С" />}
        {kind === 'crm' && <IntPair right="CRM" />}
        {kind === 'mail' && <Mail />}
        {kind === 'vpn' && <Vpn nodes={5} />}
        {kind === 'ai' && <Ai seats={3} />}
      </svg>
    </div>
  );
}

function Chrome({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <path className={styles.line} d={`M ${x} ${y} H ${x + w}`} />
      <circle className={`${styles.win} ${styles.winA}`} cx={x + 12} cy={y - 10} r="3.2" />
      <circle className={`${styles.win} ${styles.winB}`} cx={x + 24} cy={y - 10} r="3.2" />
      <circle className={`${styles.win} ${styles.winC}`} cx={x + 36} cy={y - 10} r="3.2" />
      <rect className={styles.soft} x={x + 52} y={y - 16} width={Math.min(120, w - 64)} height="12" rx="6" />
      <rect className={`${styles.pulse} ${styles.addr}`} x={x + 54} y={y - 14} width={Math.min(116, w - 68)} height="8" rx="4" />
    </g>
  );
}

function WebNew() {
  return (
    <g>
      <Box x={108} y={36} w={184} h={118} />
      <Chrome x={118} y={58} w={164} />
      <rect className={`${styles.panel} ${styles.block}`} x="124" y="70" width="152" height="16" rx="4" />
      <rect className={`${styles.panel} ${styles.block}`} x="124" y="94" width="72" height="48" rx="6" />
      <rect className={`${styles.panel} ${styles.block}`} x="204" y="94" width="72" height="22" rx="6" />
      <rect className={`${styles.panel} ${styles.block}`} x="204" y="122" width="72" height="20" rx="10" />
      <Dot cx="108" cy="36" />
      <Dot cx="292" cy="36" />
      <circle className={`${styles.ride} ${styles.rideSite}`} r="2.6" />
    </g>
  );
}

function Pages() {
  const rows = [
    { label: 'О компании', y: 78, on: true },
    { label: 'Услуги', y: 102, on: false },
    { label: 'Кейсы', y: 126, on: false },
    { label: 'Контакты', y: 150, on: false },
  ];
  return (
    <g>
      <Box x={42} y={36} w={112} h={128} />
      <Label x={54} y={58}>
        Разделы
      </Label>
      {rows.map((row) => (
        <g key={row.label}>
          <rect
            className={row.on ? styles.panel : styles.soft}
            x="52"
            y={row.y - 14}
            width="92"
            height="22"
            rx="6"
          />
          <Label x={62} y={row.y}>
            {row.label}
          </Label>
        </g>
      ))}
      <Box x={172} y={28} w={188} h={132} />
      <Chrome x={182} y={50} w={168} />
      <rect className={`${styles.panel} ${styles.block}`} x="186" y="64" width="152" height="16" rx="4" />
      <rect className={`${styles.panel} ${styles.block}`} x="186" y="88" width="70" height="52" rx="6" />
      <rect className={`${styles.panel} ${styles.block}`} x="266" y="88" width="72" height="24" rx="6" />
      <rect className={`${styles.panel} ${styles.block}`} x="266" y="118" width="72" height="22" rx="11" />
      <Dot cx="42" cy="36" />
      <Dot cx="360" cy="28" />
      <circle className={`${styles.ride} ${styles.rideSite}`} r="2.6" />
    </g>
  );
}

function WebRefresh() {
  return (
    <g>
      <g className={styles.frameB}>
        <Box x={128} y={42} w={150} h={108} />
        <path className={styles.soft} d="M 138 64 H 268 M 138 84 H 250 M 138 100 H 220" />
      </g>
      <g className={styles.frameA}>
        <Box x={108} y={32} w={168} h={118} />
        <Chrome x={118} y={54} w={148} />
        <rect className={`${styles.panel} ${styles.block}`} x="124" y="68" width="136" height="14" rx="4" />
        <rect className={`${styles.panel} ${styles.block}`} x="124" y="90" width="62" height="44" rx="6" />
        <rect className={`${styles.panel} ${styles.block}`} x="196" y="90" width="64" height="20" rx="6" />
        <rect className={`${styles.panel} ${styles.block}`} x="196" y="116" width="64" height="18" rx="9" />
        <Dot cx="108" cy="32" />
      </g>
    </g>
  );
}

function WebCare() {
  return (
    <g>
      <Box x={86} y={40} w={150} h={108} />
      <Chrome x={96} y={62} w={130} />
      <path className={styles.soft} d="M 104 80 H 220 M 104 96 H 196 M 104 112 H 208" />
      <g className={styles.shield}>
        <path
          className={styles.faceFront}
          d="M 278 52 L 322 68 V 108 C 322 138 278 158 278 158 C 278 158 234 138 234 108 V 68 Z"
        />
        <path className={`${styles.line} ${styles.ecg}`} pathLength="100" d="M 248 108 H 262 L 270 90 L 280 126 L 290 102 L 298 108 H 314" />
      </g>
      <Dot cx="86" cy="40" />
      <Dot cx="278" cy="52" />
    </g>
  );
}

function Store() {
  const originY = 86;
  const boxes = Array.from({ length: 6 }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const w = 28 + (i % 3) * 4;
    const h = 28 + (i % 2) * 10;
    const z = row * 0.35;
    const x = 92 + col * 44 + row * 6;
    const y = originY + row * 36 - h;
    return {
      x,
      y,
      w,
      h,
      z,
      cx: x + z * DX + w / 2,
      cy: y + z * DY + h / 2,
    };
  });
  return (
    <g>
      {Array.from({ length: 2 }, (_, row) => (
        <Box key={row} x={84 + row * 6} y={originY + row * 36} w={188} h={10} z={row * 0.35} />
      ))}
      {boxes.map((box, i) => (
        <Box key={i} x={box.x} y={box.y} w={box.w} h={box.h} z={box.z} cls={styles.goods} />
      ))}
      <g className={styles.bag}>
        <path className={styles.line} d="M 318 96 C 304 96 302 78 318 76 H 328" />
        <path className={styles.faceFront} d="M 318 94 L 324 132 H 348 L 356 94 Z" />
        <path className={styles.line} d="M 324 108 H 350 M 330 94 V 132 M 342 94 V 132" />
        <circle className={styles.line} cx="330" cy="140" r="5" />
        <circle className={styles.line} cx="344" cy="140" r="5" />
      </g>
      {boxes.map((box, i) => (
        <circle
          key={`fly-${i}`}
          className={`${styles.ride} ${styles[`cart${i}` as 'cart0']}`}
          r="3"
          style={{ '--sx': `${box.cx}px`, '--sy': `${box.cy}px` } as CSSProperties}
        />
      ))}
    </g>
  );
}

function Panel({ x, y, title, lines }: { x: number; y: number; title: string; lines: number }) {
  return (
    <g>
      <Box x={x} y={y} w={96} h={108} />
      <Label x={x + 12} y={y + 22}>
        {title}
      </Label>
      {Array.from({ length: lines }, (_, i) => (
        <rect key={i} className={styles.soft} x={x + 12} y={y + 36 + i * 16} width={i % 2 ? 52 : 68} height="8" rx="3" />
      ))}
    </g>
  );
}

function IntPair({ right }: { right: 'CRM' | '1С' }) {
  return (
    <g>
      <Panel x={64} y={42} title="сайт" lines={3} />
      <path className={`${styles.soft} ${styles.flow}`} pathLength="100" d="M 174 86 C 196 74 204 74 226 86" />
      <path className={`${styles.soft} ${styles.flow}`} pathLength="100" d="M 226 118 C 204 130 196 130 174 118" />
      <Panel x={226} y={42} title={right} lines={3} />
      <circle className={`${styles.ride} ${styles.rideEast}`} r="3" />
      <circle className={`${styles.ride} ${styles.rideWest}`} r="3" />
    </g>
  );
}

function Mail() {
  return (
    <g>
      <Box x={48} y={42} w={148} h={112} />
      <Chrome x={58} y={64} w={128} />
      <path className={styles.soft} d="M 68 84 H 180 M 68 102 H 164 M 68 120 H 172" />
      <path className={`${styles.soft} ${styles.flow}`} pathLength="100" d="M 196 98 C 210 90 218 90 230 100" />
      <path className={`${styles.soft} ${styles.flow}`} pathLength="100" d="M 230 118 C 218 128 210 128 196 118" />
      <g className={styles.doc}>
        <Box x={230} y={64} w={112} h={72} />
        <path className={styles.line} d="M 230 64 L 286 102 L 342 64" />
        <path className={styles.soft} d="M 248 118 H 324" />
      </g>
      <Dot cx="48" cy="42" />
      <circle className={`${styles.ride} ${styles.rideMail}`} r="3" />
    </g>
  );
}

function Building({ x, y, h, windows }: { x: number; y: number; h: number; windows: number }) {
  const cols = 2;
  const rows = Math.max(2, windows);
  return (
    <g>
      <Box x={x} y={y} w={44} h={h} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            className={styles.soft}
            x={x + 8 + c * 14}
            y={y + 12 + r * 14}
            width="10"
            height="8"
            rx="1.5"
          />
        )),
      )}
    </g>
  );
}

function Vpn({ nodes }: { nodes: 3 | 5 | 7 }) {
  const sats: Pt[] =
    nodes === 3
      ? [
          [200, 40],
          [286, 118],
          [114, 118],
        ]
      : nodes === 5
        ? [
            [200, 36],
            [278, 78],
            [262, 148],
            [138, 148],
            [122, 78],
          ]
        : [
            [200, 32],
            [268, 58],
            [292, 118],
            [248, 166],
            [152, 166],
            [108, 118],
            [132, 58],
          ];
  return (
    <g>
      {nodes >= 5 ? <Building x={72} y={88} h={70} windows={3} /> : null}
      {nodes === 7 ? <Building x={284} y={80} h={78} windows={4} /> : null}
      <circle className={`${styles.soft} ${styles.wave}`} cx="200" cy="108" r="58" />
      <circle className={`${styles.soft} ${styles.ring}`} cx="200" cy="108" r="58" />
      {sats.map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <path className={styles.soft} d={`M 200 108 L ${x} ${y}`} />
          <circle className={`${styles.dot} ${styles[`sat${i}` as 'sat0']}`} cx={x} cy={y} r="3.1" />
        </g>
      ))}
      <g className={styles.lock}>
        <path className={styles.line} d="M 188 96 C 188 82 212 82 212 96" />
        <rect className={styles.faceFront} x="182" y="96" width="36" height="26" rx="5" />
        <Dot cx="200" cy="109" r="2.2" />
      </g>
    </g>
  );
}

function Ai({ seats }: { seats: 1 | 3 | 5 }) {
  const hex: Pt[] = [
    [200, 52],
    [248, 80],
    [248, 136],
    [200, 164],
    [152, 136],
    [152, 80],
  ];
  const docs =
    seats === 1
      ? [{ x: 52, y: 70 }]
      : seats === 3
        ? [
            { x: 40, y: 48 },
            { x: 48, y: 92 },
            { x: 36, y: 136 },
          ]
        : [
            { x: 28, y: 36 },
            { x: 40, y: 76 },
            { x: 28, y: 116 },
            { x: 44, y: 156 },
            { x: 312, y: 88 },
          ];
  return (
    <g>
      <polygon className={`${styles.soft} ${styles.net}`} points={hex.map((p) => p.join(',')).join(' ')} />
      {hex.map(([x, y]) => (
        <path key={`${x}-${y}`} className={`${styles.soft} ${styles.net}`} d={`M 200 108 L ${x} ${y}`} />
      ))}
      {hex.map(([x, y]) => (
        <Dot key={`n-${x}-${y}`} cx={x} cy={y} r="2.4" />
      ))}
      <circle className={`${styles.dot} ${styles.core}`} cx="200" cy="108" r="5" />
      {docs.map((doc, i) => (
        <g key={i} className={styles.doc}>
          <Box x={doc.x} y={doc.y} w={52} h={36} d={0.7} />
          <path className={styles.soft} d={`M ${doc.x + 8} ${doc.y + 12} H ${doc.x + 40}`} />
          <path className={styles.soft} d={`M ${doc.x + 8} ${doc.y + 22} H ${doc.x + 32}`} />
        </g>
      ))}
      {seats >= 3 ? (
        <g className={styles.chat}>
          <rect className={styles.faceFront} x="292" y="44" width="72" height="44" rx="12" />
          <path className={styles.soft} d="M 304 62 H 348 M 304 74 H 332" />
        </g>
      ) : null}
      <circle className={`${styles.ride} ${styles.rideHex}`} r="2.8" />
    </g>
  );
}
