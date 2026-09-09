import type { Metadata } from 'next';
import { ContactQuietButton } from '@/components/ContactSalesButton';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { PlanFigure } from '@/components/PlanFigure';
import { Section } from '@/components/Section';
import { TwoColList } from '@/components/TwoColList';
import { onecAreas, onecBands, onecFeatures, onecPackages } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Интеграции с 1С',
  description:
    'Номенклатура, цены, остатки и заказы ходят между сайтом и 1С по расписанию или по событию.',
};

export default function OneCIntegrationsPage() {
  return (
    <>
      <Hero copy={heroes.onec} />

      <Section>
        <div className="g4">
          {onecFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)' }}>
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {onecBands.exchange.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {onecBands.exchange.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={onecBands.exchange.cta} interest="Интеграции" />
            </div>
          </div>
          <TwoColList rows={onecAreas} caption="Что ходит между сайтом и 1С" />
        </div>
      </Section>

      <Section>
        <h2 className="h2">{onecBands.priced.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {onecPackages.map((pkg) => (
            <PlanFigure
              key={pkg.name}
              figure={pkg.count}
              unit={pkg.unit}
              name={pkg.name}
              body={pkg.body}
              interest="Интеграции"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.integrations}
        </p>
      </Section>
    </>
  );
}
