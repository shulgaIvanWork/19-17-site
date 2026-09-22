import type { Metadata } from 'next';
import { CompareTable } from '@/components/blocks/CompareTable';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { Section } from '@/components/ui/Section';
import { ServiceMore } from '@/components/blocks/ServiceMore';
import { webBand, webFeatures, webRows, webTierNames } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.landing;

const headers: [string, string, string, string] = ['', ...(webTierNames as [string, string, string])];
const rows = webRows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);

export default function LandingPage() {
  return (
    <>
      <Hero copy={heroes.websites} object="sites" />

      <Section>
        <div className="g4">
          {webFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2">{webBand.title}</h2>
        <p className="body" style={{ marginTop: 12, maxWidth: '44ch' }}>
          {webBand.body}
        </p>
        <div style={{ marginTop: 44 }}>
          <CompareTable headers={headers} rows={rows} headerStyle="h3" caption="Сравнение форматов работы" />
        </div>
        <p className="footnote" style={{ marginTop: 20 }}>
          {footnotes.websites}
        </p>
      </Section>

      <ServiceMore current="landing" />
    </>
  );
}
