import type { Fact } from '@/content/products';
import styles from './FactsBand.module.css';

/** Полоса цифр: крупное число, подпись под ним и строка пояснения. Число
 *  рисует класс .figure из globals.css - он закреплен за текстовой гарнитурой,
 *  у дисплейной цифр нет, только орнамент. */
export function FactsBand({ facts }: { facts: Fact[] }) {
  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.unit} className={styles.fact}>
          <dt className="figure">{fact.figure}</dt>
          <dd className={styles.unit}>
            <div className="label">{fact.unit}</div>
            <p className="body" style={{ marginTop: 6 }}>
              {fact.body}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
