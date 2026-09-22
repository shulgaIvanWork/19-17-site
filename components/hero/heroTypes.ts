export type HeroShape =
  | 'globe'
  | 'sites'
  | 'pages'
  | 'vpn'
  | 'ai'
  | 'store'
  | 'update'
  | 'support'
  | 'crm'
  | 'onec'
  | 'works';
export type Point = [number, number, number];
export type Mesh = {
  points: Point[];
  edges: [number, number][];
  /** Semantic group per point (page index, 1 vs C, star, …). */
  parts?: number[];
  /** 0-1 along a stroke; used to grow the CRM arrow from its base. */
  along?: number[];
};

export function isLetterShape(shape: HeroShape): boolean {
  return shape !== 'globe';
}
