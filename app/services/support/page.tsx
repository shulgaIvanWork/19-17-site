import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { CompareBand } from '@/components/blocks/CompareBand';
import { Hero } from '@/components/hero/Hero';
import { supportBand, supportFeatures, supportRows, webTierNames } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'support';
export const metadata: Metadata = serviceMeta[slug];

export default function SupportPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={supportFeatures} />
      <CompareBand
        title={supportBand.title}
        body={supportBand.body}
        tiers={webTierNames}
        rows={supportRows}
        caption="Сравнение форматов поддержки"
        note={footnotes[slug]}
      />
    </>
  );
}
