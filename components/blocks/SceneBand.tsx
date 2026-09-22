import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { ScenePanel } from '@/components/scenes/BandArt';
import { Section } from '@/components/ui/Section';
import { TwoColList } from './TwoColList';
import type { SceneId } from '@/components/scenes/BandArt';
import type { Interest } from '@/content/services';
import type { TwoColRow } from '@/content/products';
import styles from './ServiceBand.module.css';

type Props = {
  scene: SceneId;
  title: string;
  body: string;
  cta: string;
  interest: Interest;
  rows: TwoColRow[];
  /** Подпись списка: ее читает программа чтения с экрана. */
  caption: string;
  /** Сноска под полосой. Есть не у всех услуг. */
  note?: string;
};

/** Серая полоса: живая сцена слева, рассказ об услуге справа. Собрана из
 *  одинаковых кусков шести страниц услуг. */
export function SceneBand({ scene, title, body, cta, interest, rows, caption, note }: Props) {
  return (
    <Section surface="ash">
      <div className={['g2', styles.split].join(' ')}>
        <ScenePanel kind={scene} />
        <div>
          <h2 className={['h2', styles.title].join(' ')}>{title}</h2>
          <p className={['body', styles.lede].join(' ')}>{body}</p>
          <div className={styles.cta}>
            <ContactSalesButton label={cta} interest={interest} />
          </div>
          <div className={styles.list}>
            <TwoColList rows={rows} caption={caption} />
          </div>
        </div>
      </div>
      {note ? <p className={['footnote', styles.note].join(' ')}>{note}</p> : null}
    </Section>
  );
}
