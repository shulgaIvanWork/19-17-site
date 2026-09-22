import type { Metadata } from 'next';
import { CompareTable } from '@/components/blocks/CompareTable';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { Section } from '@/components/ui/Section';
import { ServiceMore } from '@/components/blocks/ServiceMore';
import { supportBand, supportFeatures, supportRows, webTierNames } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.support;

const headers: [string, string, string, string] = ['', ...(webTierNames as [string, string, string])];
const rows = supportRows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);

export default function SupportPage() {
  return (
    <>
      <Hero copy={heroes.support} object="support" />

      <Section>
        <div className="g4">
          {supportFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2">{supportBand.title}</h2>
        <p className="body" style={{ marginTop: 12, maxWidth: '44ch' }}>
          {supportBand.body}
        </p>
        <div style={{ marginTop: 44 }}>
          <CompareTable headers={headers} rows={rows} headerStyle="h3" caption="Сравнение форматов поддержки" />
        </div>
        <p className="footnote" style={{ marginTop: 20 }}>
          {footnotes.support}
        </p>
      </Section>

      <ServiceMore current="support" />
    </>
  );
}
