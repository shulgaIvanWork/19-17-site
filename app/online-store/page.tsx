import type { Metadata } from 'next';
import { ContactQuietButton } from '@/components/ContactSalesButton';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { PlanFigure } from '@/components/PlanFigure';
import { Section } from '@/components/Section';
import { TwoColList } from '@/components/TwoColList';
import { storeAreas, storeBands, storeFeatures, storePlans } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Интернет-магазин',
  description: 'Товары, оплата и остатки в связке с системами, в которых вы уже работаете.',
};

export default function OnlineStorePage() {
  return (
    <>
      <Hero copy={heroes.store} />

      <Section>
        <div className="g4">
          {storeFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)' }}>
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {storeBands.handles.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {storeBands.handles.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={storeBands.handles.cta} interest="Интернет-магазин" />
            </div>
          </div>
          <TwoColList rows={storeAreas} caption="Что берёт на себя магазин" />
        </div>
      </Section>

      <Section>
        <h2 className="h2">{storeBands.sized.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {storePlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.skus}
              unit="Товаров в тарифе"
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
    </>
  );
}
