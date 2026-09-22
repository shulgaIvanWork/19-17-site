import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PlanFigure } from '@/components/blocks/PlanFigure';
import { Section } from '@/components/ui/Section';
import { ServiceMore } from '@/components/blocks/ServiceMore';
import { TwoColList } from '@/components/blocks/TwoColList';
import { storeAreas, storeBands, storeFeatures, storePlans } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.marketplace;

export default function MarketplacePage() {
  return (
    <>
      <Hero copy={heroes.store} object="store" />

      <Section>
        <div className="g4">
          {storeFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="storeFloor" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {storeBands.handles.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {storeBands.handles.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={storeBands.handles.cta} interest="Интернет-магазин" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={storeAreas} caption="Состав интернет-магазина" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{storeBands.sized.title}</h2>
        <div className="g3 rail" style={{ marginTop: 52 }}>
          {storePlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.skus}
              unit="Товаров в каталоге"
              name={plan.name}
              body={plan.body}
              interest="Интернет-магазин"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.store}
        </p>
      </Section>

      <ServiceMore current="marketplace" />
    </>
  );
}
