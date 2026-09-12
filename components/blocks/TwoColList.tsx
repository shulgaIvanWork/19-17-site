import type { TwoColRow } from '@/content/products';
import styles from './TwoColList.module.css';

/** The .tworow list: a 1fr / 1.3fr split under a 1px pale rule.
 *  Разметка одна на обе ширины: на узком экране те же строки становятся
 *  карточками горизонтальной ленты (класс rail в globals.css). */
export function TwoColList({ rows, caption }: { rows: TwoColRow[]; caption: string }) {
  return (
    <dl className={`${styles.list} rail`} aria-label={caption}>
      {rows.map((row) => (
        <div className={['tworow', 'railcard', styles.row].join(' ')} key={row.k}>
          <dt className={styles.key}>{row.k}</dt>
          <dd className="body" style={{ margin: 0 }}>
            {row.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
