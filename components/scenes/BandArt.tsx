'use client';

import dynamic from 'next/dynamic';
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

/** Сцены грузятся по одной. Раньше все шесть лежали в этом файле, и страница,
 *  рисующая одну сцену, получала чанк со всеми: 25 КБ без сжатия на каждую из
 *  шести страниц услуг (замер на собранной копии, аудит 2026-09-22). Общие
 *  детали сцен лежат в bandParts и приезжают один раз. */
const scenes: Record<SceneId, ReturnType<typeof dynamic>> = {
  pagesSite: dynamic(() => import('./bands/PagesSite').then((m) => m.PagesSite)),
  storeFloor: dynamic(() => import('./bands/StoreFloor').then((m) => m.StoreFloor)),
  auditSheet: dynamic(() => import('./bands/AuditSheet').then((m) => m.AuditSheet)),
  onecSwap: dynamic(() => import('./bands/OnecSwap').then((m) => m.OnecSwap)),
  crmPipe: dynamic(() => import('./bands/CrmPipe').then((m) => m.CrmPipe)),
  aiStack: dynamic(() => import('./bands/AiStack').then((m) => m.AiStack)),
};

/** Иллюстрация в колонке рядом со своим текстом, а не отдельной полосой над ним. */
export function ScenePanel({ kind }: { kind: SceneId }) {
  const ref = useRef<HTMLDivElement>(null);
  useSceneProgress(ref);
  const Scene = scenes[kind];
  return (
    <div className={styles.lead} aria-hidden="true">
      <div ref={ref} className={styles.frame} data-cursor-glow="scene">
        <div className={styles.stage}>
          <svg className={styles.svg} viewBox="0 0 500 400" fill="none">
            <Scene />
          </svg>
        </div>
      </div>
    </div>
  );
}
