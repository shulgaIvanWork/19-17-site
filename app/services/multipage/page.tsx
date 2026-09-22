import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { SceneBand } from '@/components/blocks/SceneBand';
import { pagesAreas, pagesBand, pagesFeatures } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'multipage';
export const metadata: Metadata = serviceMeta[slug];

export default function MultipagePage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={pagesFeatures} />
      <SceneBand
        scene="pagesSite"
        title={pagesBand.title}
        body={pagesBand.body}
        cta={pagesBand.cta}
        interest={interestOf(slug)}
        rows={pagesAreas}
        caption="Состав многостраничного сайта"
        note={footnotes[slug]}
      />
    </>
  );
}
