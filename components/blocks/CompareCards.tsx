'use client';

import { LoopCarousel } from './LoopCarousel';
import styles from './CompareTable.module.css';

type Props = {
  headers: [string, string, string, string];
  rows: [string, string, string, string][];
};

export function CompareCards({ headers, rows }: Props) {
  return (
    <LoopCarousel label="Сравнение форматов">
      {rows.map((row) => (
        <div key={row[0]} className={styles.card} role="group">
          <div role="rowheader" className={styles.key}>
            {row[0]}
          </div>
          {row.slice(1).map((cell, index) => {
            const label = headers[index + 1];
            return (
              <div className={styles.pair} role="cell" key={`${row[0]}-${index}`}>
                {label ? <span className={styles.pairHead}>{label}</span> : null}
                <span className={['body', styles.cell, styles.pairVal].join(' ')}>{cell}</span>
              </div>
            );
          })}
        </div>
      ))}
    </LoopCarousel>
  );
}
