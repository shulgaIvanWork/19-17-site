import styles from './CompareTable.module.css';

type Props = {
  headers: [string, string, string, string];
  rows: [string, string, string, string][];
  /** Websites sets its tier names at .h3; the pricing tables use .label. */
  headerStyle?: 'h3' | 'label';
  caption: string;
};

/** The .divrow comparison table: a borderless header row, then 1px cloud rules.
 *  Kept as a grid rather than a <table> because the design collapses it to two
 *  columns under 768px; the ARIA roles carry the semantics a table would. */
export function CompareTable({ headers, rows, headerStyle = 'label', caption }: Props) {
  return (
    <div role="table" aria-label={caption}>
      <div className={['divrow', 'divrow-head'].join(' ')} role="row">
        {headers.map((header, index) => (
          <div
            key={`${header}-${index}`}
            role="columnheader"
            className={headerStyle === 'h3' ? 'h3' : 'label'}
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
            <div role="cell" className="body" key={`${row[0]}-${index}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
