import type { ServiceSlug } from '@/content/services';

/** Фигура в герое. У девяти услуг она зовется так же, как услуга в реестре
 *  (`content/services.ts`), поэтому отдельного списка имен фигур больше нет:
 *  раньше лендинг был `sites`, магазин `store`, обновление `update`, и связь
 *  со страницей держалась глазами. Своя фигура есть еще у главной (глобус) и
 *  у раздела работ. */
export type HeroShape = ServiceSlug | 'globe' | 'works';
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
