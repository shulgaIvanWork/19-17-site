import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { Section } from '@/components/ui/Section';
import { TwoColList } from '@/components/blocks/TwoColList';
import { pagesAreas, pagesBand, pagesFeatures } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.multipage;

export default function MultipagePage() {
  return (
    <>
      <Hero copy={heroes.pages} object="pages" />

      <Section>
        <div className="g4">
          {pagesFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="pagesSite" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {pagesBand.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {pagesBand.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={pagesBand.cta} interest="Создание сайта" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={pagesAreas} caption="Состав многостраничного сайта" />
            </div>
          </div>
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.pages}
        </p>
      </Section>
    </>
  );
}
