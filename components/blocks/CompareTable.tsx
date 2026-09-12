import { CompareCards } from './CompareCards';
import styles from './CompareTable.module.css';

type Props = {
  headers: [string, string, string, string];
  rows: [string, string, string, string][];
  /** Websites sets its tier names at .h3; the pricing tables use .label. */
  headerStyle?: 'h3' | 'label';
  caption: string;
};

/** The .divrow comparison table: a borderless header row, then 1px cloud rules.
 *  On a phone the four-column grid is unreadable, so the same data is stacked
 *  as labeled pairs instead of wrapping into a 2×2 scramble. */
export function CompareTable({ headers, rows, headerStyle = 'label', caption }: Props) {
  return (
    <>
      <div className={styles.table} role="table" aria-label={caption}>
        <div className={styles.wide}>
          <div className={['divrow', 'divrow-head'].join(' ')} role="row">
            {headers.map((header, index) => (
              <div
                key={`${header}-${index}`}
                role="columnheader"
                className={[headerStyle === 'h3' ? 'h3' : 'label', styles.header].join(' ')}
              >
                {header || ' '}
              </div>
            ))}
          </div>
          {rows.map((row) => (
            <div className="divrow" role="row" key={row[0]}>
              <div role="rowheader" className={styles.key}>
                {row[0]}
              </div>
              {row.slice(1).map((cell, index) => (
                <div role="cell" className={['body', styles.cell].join(' ')} key={`${row[0]}-${index}`}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.narrow}>
        <CompareCards headers={headers} rows={rows} />
      </div>
    </>
  );
}
