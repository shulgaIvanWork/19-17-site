'use client';

import { useRef } from 'react';
import styles from './PricingScene.module.css';
import { useSceneGaze } from './useSceneGaze';
import { useSceneProgress } from './useSceneProgress';

const OX = 200;
const OY = 172;
const DX = 16;
const DY = -9;

type Pt = readonly [number, number];

const OUTER: Pt[] = [
  [18, 0],
  [112, 0],
  [112, 64],
  [42, 64],
  [42, 80],
  [112, 80],
  [112, 96],
  [42, 96],
  [42, 146],
  [18, 146],
  [18, 96],
  [2, 96],
  [2, 80],
  [18, 80],
  [18, 64],
  [2, 64],
  [2, 48],
  [18, 48],
];

const HOLE: Pt[] = [
  [42, 16],
  [90, 16],
  [90, 48],
  [42, 48],
];

function pt(x: number, y: number, back = false) {
  return back ? `${OX + x + DX} ${OY + y + DY}` : `${OX + x} ${OY + y}`;
}

function quad(ax: number, ay: number, bx: number, by: number) {
  return `M ${pt(ax, ay)} L ${pt(bx, by)} L ${pt(bx, by, true)} L ${pt(ax, ay, true)} Z`;
}

function topFace(x: number, y: number, w: number) {
  return quad(x, y, x + w, y);
}

function rightFace(x2: number, y: number, h: number) {
  return quad(x2, y, x2, y + h);
}

function leftFace(x: number, y: number, h: number) {
  return quad(x, y, x, y + h);
}

function bottomFace(x: number, y2: number, w: number) {
  return quad(x, y2, x + w, y2);
}

function ring(points: Pt[]) {
  const [start, ...rest] = points.map(([x, y]) => pt(x, y));
  return `M ${start} ${rest.map((p) => `L ${p}`).join(' ')} Z`;
}

function at(p: Pt, back = false) {
  return pt(p[0], p[1], back);
}

function link(p: Pt) {
  return `M ${at(p)} L ${at(p, true)}`;
}

function back(a: Pt, b: Pt) {
  return `M ${at(a, true)} L ${at(b, true)}`;
}

const FRONT = `${ring(OUTER)} ${ring(HOLE)}`;

const RIM = [
  link([18, 0]),
  back([18, 0], [112, 0]),
  link([112, 0]),
  back([112, 0], [112, 64]),
  link([112, 64]),
  link([2, 48]),
  link([2, 80]),
  back([42, 73], [42, 80]),
  link([112, 80]),
  back([112, 80], [112, 96]),
  link([112, 96]),
  back([42, 80], [112, 80]),
  back([42, 105], [42, 146]),
  link([42, 146]),
].join(' ');

const HINT = [
  link([42, 16]),
  link([90, 16]),
  link([90, 48]),
  link([42, 48]),
  back([42, 16], [90, 16]),
  back([90, 16], [90, 48]),
  back([42, 48], [42, 16]),
  back([112, 64], [42, 64]),
  back([42, 48], [112, 48]),
  back([2, 48], [18, 48]),
  back([42, 64], [42, 73]),
  back([112, 96], [42, 96]),
  back([2, 80], [18, 80]),
  back([42, 96], [42, 105]),
  link([42, 80]),
  link([42, 64]),
  link([42, 96]),
].join(' ');

const TOPS = [
  topFace(18, 0, 94),
  topFace(2, 48, 16),
  topFace(42, 48, 70),
  topFace(2, 80, 16),
  topFace(42, 80, 70),
];

const RIGHTS = [
  rightFace(112, 0, 64),
  rightFace(112, 80, 16),
  rightFace(42, 16, 32),
  rightFace(42, 64, 16),
  rightFace(42, 96, 50),
];

const INNERS = [
  leftFace(90, 16, 32),
  bottomFace(42, 16, 48),
];

export function PricingScene() {
  const ref = useRef<HTMLDivElement>(null);
  useSceneProgress(ref);
  useSceneGaze(ref);

  return (
    <div ref={ref} className={styles.frame} role="img" aria-label="Человек опирается на знак рубля и машет рукой">
      <svg className={styles.svg} viewBox="50 100 400 250" fill="none">
        <path className={styles.mound} d="M 86 322 C 140 304 186 298 236 298 C 292 298 344 308 382 322 C 344 336 292 342 236 342 C 186 342 140 336 86 322 Z" />
        <path className={styles.moundCrest} d="M 102 320 C 164 306 308 306 366 320" />

        {RIGHTS.map((d) => (
          <path key={`r:${d}`} className={styles.rubRight} d={d} />
        ))}
        {INNERS.map((d) => (
          <path key={`i:${d}`} className={styles.rubInner} d={d} />
        ))}
        {TOPS.map((d) => (
          <path key={`t:${d}`} className={styles.rubTop} d={d} />
        ))}
        <path className={styles.rubFront} d={FRONT} fillRule="evenodd" />
        <path className={styles.rubHint} d={HINT} />
        <path className={styles.rubRim} d={RIM} />

        <g className={styles.sparkA} aria-hidden="true">
          <path className={styles.spark} d="M 328 156 L 330.4 162.6 L 337 165 L 330.4 167.4 L 328 174 L 325.6 167.4 L 319 165 L 325.6 162.6 Z" />
        </g>

        <g className={styles.lean}>
          <g className={styles.sway}>
            <g className={styles.gaze}>
              <circle className={styles.panel} cx="128" cy="178" r="15" />
              <path className={styles.line} d="M 116 174 C 120 160 140 159 143 173" />
            </g>
            <path className={styles.line} d="M 128 193 V 202" />
            <path className={styles.panel} d="M 112 204 C 112 198 144 198 144 204 L 148 256 C 148 262 108 262 108 256 Z" />
          </g>
          <path className={styles.line} d="M 118 256 L 108 318 M 138 256 L 150 318" />
          <path className={styles.soft} d="M 98 318 H 114 M 144 318 H 160" />
          <g className={styles.armR}>
            <path className={styles.line} d="M 142 210 C 166 238 184 232 204 224" />
            <circle className={styles.dot} cx="204" cy="224" r="3.2" />
          </g>
          <g className={styles.armL}>
            <g className={styles.wave}>
              <path className={styles.line} d="M 114 210 L 96 244" />
              <g className={styles.flap}>
                <path className={styles.line} d="M 96 244 L 88 268" />
                <circle className={styles.dot} cx="88" cy="268" r="2.5" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
