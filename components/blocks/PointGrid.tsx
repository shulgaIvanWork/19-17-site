import { Check } from '@/components/ui/Check';
import type { Point } from '@/content/products';
import styles from './PointGrid.module.css';

/** Сетка коротких пунктов: галочка, заголовок и пояснение к нему. Одним
 *  компонентом собраны три полосы главной - кому мы подходим, почему
 *  обращаются к нам и почему работать с нами безопасно
 *  (правка заказчика 2026-09-24).
 *
 *  Колонок по умолчанию три; семь пунктов «почему к нам» на три не делятся,
 *  поэтому у этой полосы их две. */
export function PointGrid({ points, columns = 3 }: { points: Point[]; columns?: 2 | 3 }) {
  return (
    <ul className={styles.grid} data-cols={columns}>
      {points.map((point) => (
        <li key={point.title} className={styles.point}>
          <Check className={styles.check} />
          <div>
            <h3 className="h3">{point.title}</h3>
            <p className="body" style={{ marginTop: 6 }}>
              {point.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
