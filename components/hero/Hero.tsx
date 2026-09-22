import { ButtonLink } from '@/components/ui/Button';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { HeroObjectMount } from './HeroObjectMount';
import { type HeroShape } from './heroTypes';
import { settings } from '@/content/settings';
import type { Hero as HeroCopy } from '@/content/site';
import styles from './Hero.module.css';

const interestByShape: Partial<Record<HeroShape, string>> = {
  sites: 'Создание сайта',
  pages: 'Создание сайта',
  store: 'Интернет-магазин',
  update: 'Обновление сайта',
  support: 'Поддержка сайта',
  onec: 'Интеграция с 1С',
  crm: 'Интеграция с CRM',
  vpn: 'Корпоративный VPN',
  ai: 'Локальный AI',
};

type Props = {
  copy: HeroCopy;
  /** 'tall' is Home; every product route uses 'short'. */
  size?: 'tall' | 'short';
  /** Where the white CTA goes. Pricing on every route in the approved design. */
  secondaryHref?: string;
  /** Wireframe behind the type. `true` is the Home globe. */
  object?: boolean | HeroShape;
};

export function Hero({ copy, size = 'short', secondaryHref = '/pricing', object = false }: Props) {
  const shape: HeroShape | null = !object || !settings.heroObject ? null : object === true ? 'globe' : object;

  return (
    <section
      className={[styles.hero, size === 'short' ? styles.short : ''].filter(Boolean).join(' ')}
      data-hero
    >
      <div className={styles.block} style={{ maxWidth: copy.blockWidth }}>
        <h1 className="h1" style={{ maxWidth: copy.titleWidth }}>
          {copy.title}
        </h1>
        <p className="lede" style={{ maxWidth: copy.ledeWidth }}>
          {copy.lede}
        </p>
      </div>
      {shape && (
        <div className={styles.object}>
          <HeroObjectMount nodes={settings.heroObjectNodes} shape={shape} />
        </div>
      )}
      <div className={styles.cta}>
        <ContactSalesButton hero interest={shape ? interestByShape[shape] : undefined} />
        <ButtonLink href={secondaryHref} variant="white" hero prefetch>
          {copy.secondaryCta}
        </ButtonLink>
      </div>
    </section>
  );
}
