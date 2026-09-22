import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { Section } from '@/components/ui/Section';
import { TwoColList } from '@/components/blocks/TwoColList';
import { redesignAreas, redesignBands, redesignFeatures } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.redesign;

export default function RedesignPage() {
  return (
    <>
      <Hero copy={heroes.redesign} object="redesign" />

      <Section>
        <div className="g4">
          {redesignFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="auditSheet" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {redesignBands.audit.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {redesignBands.audit.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={redesignBands.audit.cta} interest="Обновление сайта" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={redesignAreas} caption="Что проверяем во время аудита" />
            </div>
          </div>
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.redesign}
        </p>
      </Section>
    </>
  );
}
