import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PlanFigure } from '@/components/blocks/PlanFigure';
import { Section } from '@/components/ui/Section';
import { ServiceMore } from '@/components/blocks/ServiceMore';
import { TwoColList } from '@/components/blocks/TwoColList';
import { crmBands, crmFeatures, crmPackages, crmSystems } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.crm;

export default function CrmPage() {
  return (
    <>
      <Hero copy={heroes.crm} object="crm" />

      <Section>
        <div className="g4">
          {crmFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="crmPipe" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {crmBands.connect.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {crmBands.connect.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={crmBands.connect.cta} interest="Интеграция с CRM" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={crmSystems} caption="Системы, которые подключаем" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{crmBands.priced.title}</h2>
        <div className="g3 rail" style={{ marginTop: 52 }}>
          {crmPackages.map((pkg) => (
            <PlanFigure
              key={pkg.name}
              figure={pkg.count}
              unit={pkg.unit}
              name={pkg.name}
              body={pkg.body}
              interest="Интеграция с CRM"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.integrations}
        </p>
      </Section>

      <ServiceMore current="crm" />
    </>
  );
}
