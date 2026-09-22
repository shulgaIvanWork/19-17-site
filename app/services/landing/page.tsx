import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { CompareBand } from '@/components/blocks/CompareBand';
import { Hero } from '@/components/hero/Hero';
import { webBand, webFeatures, webRows, webTierNames } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'landing';
export const metadata: Metadata = serviceMeta[slug];

export default function LandingPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={webFeatures} />
      <CompareBand
        title={webBand.title}
        body={webBand.body}
        tiers={webTierNames}
        rows={webRows}
        caption="Сравнение форматов работы"
        note={footnotes[slug]}
      />
    </>
  );
}
