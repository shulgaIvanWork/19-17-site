import type { Metadata } from 'next';
import { PricingCard } from '@/components/blocks/PricingCard';
import { PricingScene } from '@/components/scenes/PricingScene';
import { Section } from '@/components/ui/Section';
import { pricingBands, pricingHero } from '@/content/pricing';
import { footnotes } from '@/content/site';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Цены',
  description: 'Как рассчитывается стоимость сайта, поддержки, интеграций, корпоративного VPN и локального AI.',
};

export default function PricingPage() {
  return (
    <>
      <Section style={{ paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 0 }}>
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'center' }}>
          <div>
            <h1 className="h1" style={{ maxWidth: '24ch' }}>
              {pricingHero.title}
            </h1>
            <p className="lede" style={{ marginTop: 16, maxWidth: '56ch' }}>
              {pricingHero.lede}
            </p>
          </div>
          <PricingScene />
        </div>
      </Section>

      {pricingBands.map((band, index) => (
        <Section surface={band.surface} key={band.heading}>
          <div className={styles.bandHead}>
            <h2 className="h2">{band.heading}</h2>
            <p className="body">{band.lede}</p>
          </div>
          <div
            className={[styles.grid, band.offers.length % 2 === 0 ? styles.gridTwo : '', 'rail', 'rail-one']
              .filter(Boolean)
              .join(' ')}
          >
            {band.offers.map((offer) => (
              <PricingCard key={offer.name} offer={offer} />
            ))}
          </div>
          {index === pricingBands.length - 1 && (
            <p className="footnote" style={{ marginTop: 28, maxWidth: '64ch' }}>
              {footnotes.pricing}
            </p>
          )}
        </Section>
      ))}
    </>
  );
}
