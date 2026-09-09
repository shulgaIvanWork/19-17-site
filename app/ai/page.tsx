import type { Metadata } from 'next';
import { ContactQuietButton } from '@/components/ContactSalesButton';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { PlanFigure } from '@/components/PlanFigure';
import { Section } from '@/components/Section';
import { TwoColList } from '@/components/TwoColList';
import { aiBands, aiFeatures, aiPlans, aiUses } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Локальный AI',
  description: 'Нейросеть на ваших серверах, дообученная на ваших материалах. Данные не покидают периметр.',
};

export default function AiPage() {
  return (
    <>
      <Hero copy={heroes.ai} />

      <Section>
        <div className="g4">
          {aiFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)' }}>
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {aiBands.uses.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {aiBands.uses.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={aiBands.uses.cta} interest="AI" />
            </div>
          </div>
          <TwoColList rows={aiUses} caption="О чём спрашивают модель" />
        </div>
      </Section>

      <Section>
        <h2 className="h2">{aiBands.sized.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {aiPlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.seats}
              unit="Сотрудников в тарифе"
              name={plan.name}
              body={plan.body}
              interest="AI"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '64ch' }}>
          {footnotes.ai}
        </p>
      </Section>
    </>
  );
}
