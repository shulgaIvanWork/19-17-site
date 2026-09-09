import type { Metadata } from 'next';
import { ContactQuietButton } from '@/components/ContactSalesButton';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { PlanFigure } from '@/components/PlanFigure';
import { Section } from '@/components/Section';
import { TwoColList } from '@/components/TwoColList';
import { crmBands, crmFeatures, crmPackages, crmSystems } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Интеграции с CRM',
  description: 'Битрикс24, amoCRM и другие системы — связаны с сайтом и между собой.',
};

export default function CrmIntegrationsPage() {
  return (
    <>
      <Hero copy={heroes.crm} />

      <Section>
        <div className="g4">
          {crmFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)' }}>
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {crmBands.connect.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {crmBands.connect.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={crmBands.connect.cta} interest="Интеграции" />
            </div>
          </div>
          <TwoColList rows={crmSystems} caption="Системы, которые подключаем" />
        </div>
      </Section>

      <Section>
        <h2 className="h2">{crmBands.priced.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {crmPackages.map((pkg) => (
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
