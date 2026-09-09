import type { Metadata } from 'next';
import { ContactQuietButton } from '@/components/ContactSalesButton';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { Section } from '@/components/Section';
import { TwoColList } from '@/components/TwoColList';
import { redesignAreas, redesignBands, redesignFeatures } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Обновление сайта',
  description: 'Разбираем, что мешает существующему сайту, и приводим его в порядок.',
};

export default function WebsiteRedesignPage() {
  return (
    <>
      <Hero copy={heroes.redesign} />

      <Section>
        <div className="g4">
          {redesignFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)' }}>
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {redesignBands.audit.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {redesignBands.audit.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={redesignBands.audit.cta} interest="Сайт" />
            </div>
          </div>
          <TwoColList rows={redesignAreas} caption="Что смотрим при осмотре" />
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.redesign}
        </p>
      </Section>
    </>
  );
}
