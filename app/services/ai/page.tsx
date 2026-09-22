import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PlanFigure } from '@/components/blocks/PlanFigure';
import { Section } from '@/components/ui/Section';
import { ServiceMore } from '@/components/blocks/ServiceMore';
import { TwoColList } from '@/components/blocks/TwoColList';
import { aiBands, aiFeatures, aiPlans, aiUses } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.ai;

export default function AiPage() {
  return (
    <>
      <Hero copy={heroes.ai} object="ai" />

      <Section>
        <div className="g4">
          {aiFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="aiStack" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {aiBands.uses.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {aiBands.uses.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={aiBands.uses.cta} interest="Локальный AI" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={aiUses} caption="Задачи для локальной модели" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{aiBands.sized.title}</h2>
        <div className="g3 rail" style={{ marginTop: 52 }}>
          {aiPlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.seats}
              unit="Пользователей"
              name={plan.name}
              body={plan.body}
              interest="Локальный AI"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '64ch' }}>
          {footnotes.ai}
        </p>
      </Section>

      <ServiceMore current="ai" />
    </>
  );
}
