import styles from './CompareTable.module.css';

type Props = {
  headers: [string, string, string, string];
  rows: [string, string, string, string][];
  /** Tier names read as headings in the wide table. */
  headerStyle?: 'label' | 'h3';
  caption: string;
};

/** Одна разметка на обе ширины. На широком экране это строки таблицы с шапкой,
 *  на узком - карточки горизонтальной ленты (класс rail в globals.css): шапка
 *  скрывается, а название столбца печатается в самой ячейке. Раньше на каждую
 *  таблицу рендерилось два дерева, обычное и карточное. */
export function CompareTable({ headers, rows, headerStyle = 'label', caption }: Props) {
  return (
    <div className={`${styles.table} rail`} role="table" aria-label={caption}>
      <div className={['divrow', 'divrow-head', styles.head].join(' ')} role="row">
        {headers.map((header, index) => (
          <div
            key={`${header}-${index}`}
            role="columnheader"
            className={[headerStyle === 'h3' ? 'h3' : 'label', styles.header].join(' ')}
          >
            {header || ' '}
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div className={['divrow', 'railcard', styles.row].join(' ')} role="row" key={row[0]}>
          <div role="rowheader" className={styles.key}>
            {row[0]}
          </div>
          {row.slice(1).map((cell, index) => (
            <div role="cell" className={styles.cellBox} key={`${row[0]}-${index}`}>
              <span className={styles.pairHead} aria-hidden="true">
                {headers[index + 1]}
              </span>
              <span className={['body', styles.cell].join(' ')}>{cell}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
