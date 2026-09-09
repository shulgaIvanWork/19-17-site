import { ButtonLink } from './Button';
import { ContactSalesButton } from './ContactSalesButton';
import { HeroObjectMount } from './HeroObjectMount';
import { settings } from '@/content/settings';
import type { Hero as HeroCopy } from '@/content/site';
import styles from './Hero.module.css';

type Props = {
  copy: HeroCopy;
  /** 'tall' is Home; every product route uses 'short'. */
  size?: 'tall' | 'short';
  /** Where the white CTA goes. Pricing on every route in the approved design. */
  secondaryHref?: string;
  /** The wireframe object is Home only. */
  object?: boolean;
};

export function Hero({ copy, size = 'short', secondaryHref = '/pricing', object = false }: Props) {
  const showObject = object && settings.heroObject;

  return (
    <section
      className={[styles.hero, size === 'short' ? styles.short : ''].filter(Boolean).join(' ')}
      data-hero
    >
      {showObject && (
        <div className={styles.object}>
          <HeroObjectMount nodes={settings.heroObjectNodes} sway={settings.heroObjectSway} />
        </div>
      )}
      <div className={styles.block} style={{ maxWidth: copy.blockWidth }}>
        <h1 className="h1" style={{ maxWidth: copy.titleWidth }}>
          {copy.title}
        </h1>
        <p className="lede" style={{ maxWidth: copy.ledeWidth }}>
          {copy.lede}
        </p>
      </div>
      <div className={styles.cta}>
        <ContactSalesButton hero />
        <ButtonLink href={secondaryHref} variant="white" hero>
          {copy.secondaryCta}
        </ButtonLink>
      </div>
    </section>
  );
}
