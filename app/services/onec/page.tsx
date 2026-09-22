import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PlanFigure } from '@/components/blocks/PlanFigure';
import { Section } from '@/components/ui/Section';
import { TwoColList } from '@/components/blocks/TwoColList';
import { onecAreas, onecBands, onecFeatures, onecPackages } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.onec;

export default function OnecPage() {
  return (
    <>
      <Hero copy={heroes.onec} object="onec" />

      <Section>
        <div className="g4">
          {onecFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="onecSwap" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {onecBands.exchange.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {onecBands.exchange.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={onecBands.exchange.cta} interest="Интеграция с 1С" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={onecAreas} caption="Какие данные передаем" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{onecBands.priced.title}</h2>
        <div className="g3 rail" style={{ marginTop: 52 }}>
          {onecPackages.map((pkg) => (
            <PlanFigure
              key={pkg.name}
              figure={pkg.count}
              unit={pkg.unit}
              name={pkg.name}
              body={pkg.body}
              interest="Интеграция с 1С"
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
