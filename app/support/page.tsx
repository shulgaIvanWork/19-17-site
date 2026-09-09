import type { Metadata } from 'next';
import { CompareTable } from '@/components/CompareTable';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { Section } from '@/components/Section';
import { supportBand, supportFeatures, supportRows, webTierNames } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Техническая поддержка',
  description: 'Названный контакт, оговорённый срок ответа и часы разработки каждый месяц.',
};

const headers: [string, string, string, string] = ['', ...(webTierNames as [string, string, string])];
const rows = supportRows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);

export default function SupportPage() {
  return (
    <>
      <Hero copy={heroes.support} />

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
          <CompareTable headers={headers} rows={rows} headerStyle="h3" caption="Сравнение тарифов поддержки" />
        </div>
        <p className="footnote" style={{ marginTop: 20 }}>
          {footnotes.support}
        </p>
      </Section>
    </>
  );
}
