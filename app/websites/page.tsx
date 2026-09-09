import type { Metadata } from 'next';
import { CompareTable } from '@/components/CompareTable';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { Section } from '@/components/Section';
import { webBand, webFeatures, webRows, webTierNames } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Создание сайта',
  description: 'Сайт под ключ для вашей компании, затем поддержка и развитие на одном из трёх тарифов.',
};

const headers: [string, string, string, string] = ['', ...(webTierNames as [string, string, string])];
const rows = webRows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);

export default function WebsitesPage() {
  return (
    <>
      <Hero copy={heroes.websites} />

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
          <CompareTable headers={headers} rows={rows} headerStyle="h3" caption="Сравнение тарифов" />
        </div>
        <p className="footnote" style={{ marginTop: 20 }}>
          {footnotes.websites}
        </p>
      </Section>
    </>
  );
}
