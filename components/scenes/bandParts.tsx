'use client';

import type { CSSProperties, ReactNode } from 'react';
import styles from './BandArt.module.css';

/** Общие детали живых сцен: рамка окна, строки, чипы, узлы и кнопки. Сцены
 *  лежат по одной в файле рядом (bands/), а эти детали нужны всем сразу,
 *  поэтому приезжают одним чанком. */

export function Piece({
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

export function T({
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

export function Pane({
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

export function Dot({ cx, cy, r = 2.1 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} className={styles.dot} />;
}

export function Node({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle className={styles.nodeRing} cx={cx} cy={cy} r="5.5" />
      <Dot cx={cx} cy={cy} />
    </g>
  );
}

export function Chrome({ x, y, w, url }: { x: number; y: number; w: number; url?: string }) {
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

export function Tick({ x, y, on = true }: { x: number; y: number; on?: boolean }) {
  return (
    <g>
      <rect className={styles.glassSoft} x={x} y={y} width="16" height="16" rx="4" />
      {on ? <rect className={`${styles.glassInk} ${styles.rest}`} x={x} y={y} width="16" height="16" rx="4" /> : null}
      {on ? <path className={styles.line} d={`M ${x + 3.5} ${y + 8.5} L ${x + 7} ${y + 12} L ${x + 12.5} ${y + 4.5}`} /> : null}
    </g>
  );
}

export function Chip({
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

export function RowHit({
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

export function FakeBtn({
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
