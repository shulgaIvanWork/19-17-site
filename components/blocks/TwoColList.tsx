import type { TwoColRow } from '@/content/products';
import { LoopCarousel } from './LoopCarousel';
import styles from './TwoColList.module.css';

/** The .tworow list: a 1fr / 1.3fr split under a 1px pale rule.
 *  На мобилке те же пары — циклическая карусель карточек. */
export function TwoColList({ rows, caption }: { rows: TwoColRow[]; caption: string }) {
  return (
    <>
      <dl className={styles.wide} aria-label={caption}>
        {rows.map((row) => (
          <div className="tworow" key={row.k}>
            <dt className={styles.key}>{row.k}</dt>
            <dd className="body" style={{ margin: 0 }}>
              {row.v}
            </dd>
          </div>
        ))}
      </dl>
      <LoopCarousel label={caption}>
        {rows.map((row) => (
          <div key={row.k} className={styles.card}>
            <p className={styles.cardKey}>{row.k}</p>
            <p className={['body', styles.cardVal].join(' ')}>{row.v}</p>
          </div>
        ))}
      </LoopCarousel>
    </>
  );
}
