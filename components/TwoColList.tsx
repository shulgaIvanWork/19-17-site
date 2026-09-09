import type { TwoColRow } from '@/content/products';
import styles from './TwoColList.module.css';

/** The .tworow list: a 1fr / 1.3fr split under a 1px pale rule. */
export function TwoColList({ rows, caption }: { rows: TwoColRow[]; caption: string }) {
  return (
    <dl aria-label={caption} style={{ margin: 0 }}>
      {rows.map((row) => (
        <div className="tworow" key={row.k}>
          <dt className={styles.key}>{row.k}</dt>
          <dd className="body" style={{ margin: 0 }}>
            {row.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
