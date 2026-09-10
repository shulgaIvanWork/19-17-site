import type { CardMarkId } from '@/content/products';
import styles from './CardMark.module.css';

/** Geometric service marks. Rest pose is the logo; hover runs a closed loop
 *  in the same line-and-node language as the hero wireframes. */
export function CardMark({ kind, still = false }: { kind: CardMarkId; still?: boolean }) {
  return (
    <div className={[styles.stage, still ? styles.still : ''].filter(Boolean).join(' ')} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 480 240" fill="none">
        {kind === 'websites' && <Websites />}
        {kind === 'store' && <Store />}
        {kind === 'redesign' && <Redesign />}
        {kind === 'support' && <Support />}
        {kind === 'crm' && <Crm />}
        {kind === 'onec' && <Onec />}
        {kind === 'vpn' && <Vpn />}
        {kind === 'ai' && <Ai />}
      </svg>
    </div>
  );
}

function Dot({
  cx,
  cy,
  r = 2.2,
  className,
}: {
  cx: number | string;
  cy: number | string;
  r?: number | string;
  className?: string;
}) {
  return <circle cx={cx} cy={cy} r={r} className={className ?? styles.dot} />;
}

function Websites() {
  return (
    <g>
      <rect className={styles.panel} x="142" y="40" width="196" height="160" rx="12" />
      <path className={styles.line} d="M 142 70 H 338" />
      <circle className={`${styles.win} ${styles.winA}`} cx="160" cy="55" r="3.4" />
      <circle className={`${styles.win} ${styles.winB}`} cx="174" cy="55" r="3.4" />
      <circle className={`${styles.win} ${styles.winC}`} cx="188" cy="55" r="3.4" />
      <rect className={styles.soft} x="206" y="49" width="118" height="12" rx="6" />
      <rect className={`${styles.pulse} ${styles.addr}`} x="208" y="51" width="114" height="8" rx="4" />
      <rect className={`${styles.panel} ${styles.siteBlock}`} x="158" y="84" width="164" height="18" rx="4" />
      <rect className={`${styles.panel} ${styles.siteBlock}`} x="158" y="110" width="76" height="72" rx="4" />
      <rect className={`${styles.panel} ${styles.siteBlock}`} x="246" y="110" width="76" height="32" rx="4" />
      <rect className={`${styles.panel} ${styles.siteBlock}`} x="246" y="150" width="76" height="32" rx="16" />
      <Dot cx="158" cy="84" />
      <Dot cx="322" cy="84" />
      <Dot cx="158" cy="182" />
      <Dot cx="322" cy="182" />
      <circle className={`${styles.ride} ${styles.rideSite}`} r="2.5" />
    </g>
  );
}

function Store() {
  const clip = 'card-mark-store';
  const tiles = [
    { x: 108, lines: 2 },
    { x: 184, lines: 3 },
    { x: 260, lines: 2 },
    { x: 336, lines: 2 },
  ];
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="104" y="64" width="228" height="116" rx="2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <g className={styles.storeTrack}>
          {tiles.map((tile, i) => (
            <g key={i}>
              <rect className={styles.panel} x={tile.x} y="72" width="64" height="100" rx="8" />
              <rect className={styles.soft} x={tile.x + 10} y="84" width="44" height="36" rx="4" />
              <path className={styles.soft} d={`M ${tile.x + 10} 132 H ${tile.x + 54}`} />
              <path className={styles.line} d={`M ${tile.x + 10} 146 H ${tile.x + 38}`} />
              <Dot cx={tile.x + 32} cy="102" r="2" />
            </g>
          ))}
        </g>
      </g>
      <g className={styles.bag}>
        <path className={styles.line} d="M 350 104 C 334 104 332 82 350 80 H 362" />
        <path className={styles.panel} d="M 350 100 L 358 142 H 386 L 396 100 Z" />
        <path className={styles.line} d="M 358 116 H 390 M 366 100 V 142 M 378 100 V 142" />
        <circle className={styles.line} cx="364" cy="152" r="5.5" />
        <circle className={styles.line} cx="380" cy="152" r="5.5" />
        <Dot cx="364" cy="152" r="1.5" />
        <Dot cx="380" cy="152" r="1.5" />
      </g>
      <circle className={`${styles.ride} ${styles.rideCart}`} r="3.4" />
    </g>
  );
}

function Redesign() {
  return (
    <g>
      <g className={styles.frameB}>
        <rect className={styles.soft} x="164" y="48" width="152" height="144" rx="10" />
        <path className={styles.soft} d="M 164 74 H 316" />
        <path className={styles.soft} d="M 178 92 H 302 M 178 108 H 250 M 178 124 H 288 M 178 140 H 236 M 178 156 H 270" />
      </g>
      <g className={styles.frameA}>
        <rect className={styles.panel} x="164" y="48" width="152" height="144" rx="10" />
        <path className={styles.line} d="M 164 74 H 316" />
        <rect className={styles.panel} x="178" y="88" width="124" height="16" rx="3" />
        <rect className={styles.panel} x="178" y="112" width="58" height="60" rx="4" />
        <rect className={styles.panel} x="244" y="112" width="58" height="28" rx="4" />
        <rect className={styles.panel} x="244" y="148" width="58" height="24" rx="12" />
        <Dot cx="178" cy="74" />
        <Dot cx="302" cy="74" />
      </g>
    </g>
  );
}

function Support() {
  return (
    <g>
      <path
        className={`${styles.panel} ${styles.shield}`}
        d="M 240 46 L 298 68 V 124 C 298 168 240 194 240 194 C 240 194 182 168 182 124 V 68 Z"
      />
      <path
        className={`${styles.line} ${styles.ecg}`}
        pathLength="100"
        d="M 192 126 H 212 L 222 102 L 232 150 L 244 118 L 254 126 H 288"
      />
      <Dot cx="240" cy="46" />
      <Dot cx="182" cy="68" />
      <Dot cx="298" cy="68" />
      <circle className={`${styles.ride} ${styles.rideEcg}`} r="3.2" />
    </g>
  );
}

function Crm() {
  const cols = [128, 208, 288];
  return (
    <g>
      {cols.map((x) => (
        <g key={x}>
          <rect className={styles.panel} x={x} y="56" width="68" height="128" rx="6" />
          <rect className={styles.panel} x={x} y="56" width="68" height="22" rx="6" />
          <path className={styles.line} d={`M ${x} 78 H ${x + 68}`} />
        </g>
      ))}
      <rect className={styles.soft} x="138" y="88" width="48" height="16" rx="3" />
      <rect className={styles.soft} x="138" y="136" width="48" height="16" rx="3" />
      <rect className={styles.soft} x="218" y="112" width="48" height="16" rx="3" />
      <rect className={styles.soft} x="218" y="136" width="48" height="16" rx="3" />
      <rect className={styles.soft} x="298" y="88" width="48" height="16" rx="3" />
      <rect className={styles.soft} x="298" y="160" width="48" height="16" rx="3" />
      <g className={styles.lead}>
        <rect className={styles.panel} x="138" y="112" width="48" height="16" rx="3" />
        <path className={styles.line} d="M 146 120 H 178" />
      </g>
    </g>
  );
}

function Onec() {
  return (
    <g>
      <rect className={styles.panel} x="118" y="64" width="92" height="112" rx="10" />
      <path className={styles.line} d="M 118 86 H 210" />
      <rect className={styles.soft} x="132" y="98" width="64" height="10" rx="3" />
      <rect className={styles.soft} x="132" y="116" width="48" height="10" rx="3" />
      <rect className={styles.soft} x="132" y="134" width="56" height="10" rx="3" />
      <Dot cx="132" cy="75" />
      <g>
        <ellipse className={styles.panel} cx="314" cy="80" rx="42" ry="14" />
        <path className={styles.line} d="M 272 80 V 160" />
        <path className={styles.line} d="M 356 80 V 160" />
        <ellipse className={styles.panel} cx="314" cy="160" rx="42" ry="14" />
        <ellipse className={styles.soft} cx="314" cy="120" rx="42" ry="14" />
      </g>
      <path className={`${styles.soft} ${styles.flowEast}`} pathLength="100" d="M 186 98 C 240 70 240 70 294 98" />
      <path className={`${styles.soft} ${styles.flowWest}`} pathLength="100" d="M 294 142 C 240 170 240 170 186 142" />
      <circle className={`${styles.ride} ${styles.rideEast}`} r="3.2" />
      <circle className={`${styles.ride} ${styles.rideEast2}`} r="3.2" />
      <circle className={`${styles.ride} ${styles.rideWest}`} r="3.2" />
    </g>
  );
}

function Vpn() {
  const sats: [number, number, string][] = [
    [240, 52, styles.satA],
    [292, 82, styles.satB],
    [292, 158, styles.satC],
    [240, 188, styles.satD],
    [188, 158, styles.satE],
    [188, 82, styles.satF],
  ];
  return (
    <g>
      <circle className={`${styles.soft} ${styles.wave}`} cx="240" cy="120" r="68" />
      <circle className={`${styles.soft} ${styles.ring}`} cx="240" cy="120" r="68" />
      {sats.map(([x, y, cls]) => (
        <g key={cls}>
          <path className={styles.soft} d={`M 240 120 L ${x} ${y}`} />
          <circle className={`${styles.dot} ${cls}`} cx={x} cy={y} r="3" />
        </g>
      ))}
      <g className={styles.lock}>
        <path className={styles.line} d="M 228 108 C 228 94 252 94 252 108" />
        <rect className={styles.panel} x="222" y="108" width="36" height="28" rx="5" />
        <Dot cx="240" cy="122" r="2.4" />
      </g>
    </g>
  );
}

function Ai() {
  const pts: [number, number][] = [
    [240, 64],
    [288.5, 92],
    [288.5, 148],
    [240, 176],
    [191.5, 148],
    [191.5, 92],
  ];
  return (
    <g>
      <polygon className={`${styles.soft} ${styles.net}`} points={pts.map((p) => p.join(',')).join(' ')} />
      {pts.map(([x, y], i) => (
        <path key={i} className={`${styles.soft} ${styles.net}`} d={`M 240 120 L ${x} ${y}`} />
      ))}
      {pts.map(([x, y]) => (
        <Dot key={`${x}-${y}`} cx={x} cy={y} r="2.6" />
      ))}
      <circle className={`${styles.dot} ${styles.core}`} cx="240" cy="120" r="4.2" />
      <circle className={`${styles.ride} ${styles.rideHex}`} r="3.2" />
    </g>
  );
}
