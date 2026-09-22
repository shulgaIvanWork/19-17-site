import { CompareTable } from './CompareTable';
import { Section } from '@/components/ui/Section';
import styles from './ServiceBand.module.css';

type Row = { k: string; a: string; b: string; c: string };

type Props = {
  title: string;
  body: string;
  /** Названия трех форматов работы. Первая колонка таблицы без заголовка. */
  tiers: readonly [string, string, string];
  rows: readonly Row[];
  caption: string;
  note: string;
};

/** Серая полоса со сравнением форматов работы. Такая есть у лендинга и у
 *  поддержки: обе продаются одними и теми же тремя уровнями. */
export function CompareBand({ title, body, tiers, rows, caption, note }: Props) {
  const headers: [string, string, string, string] = ['', ...tiers];
  const cells = rows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);

  return (
    <Section surface="ash">
      <h2 className="h2">{title}</h2>
      <p className={['body', styles.wideLede].join(' ')}>{body}</p>
      <div className={styles.table}>
        <CompareTable headers={headers} rows={cells} headerStyle="h3" caption={caption} />
      </div>
      <p className={['footnote', styles.tableNote].join(' ')}>{note}</p>
    </Section>
  );
}
