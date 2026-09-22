import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { PlanBand } from '@/components/blocks/PlanBand';
import { SceneBand } from '@/components/blocks/SceneBand';
import { storeAreas, storeBands, storeFeatures, storePlans } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'marketplace';
export const metadata: Metadata = serviceMeta[slug];

export default function MarketplacePage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={storeFeatures} />
      <SceneBand
        scene="storeFloor"
        title={storeBands.handles.title}
        body={storeBands.handles.body}
        cta={storeBands.handles.cta}
        interest={interestOf(slug)}
        rows={storeAreas}
        caption="Состав интернет-магазина"
      />
      <PlanBand
        title={storeBands.sized.title}
        plans={storePlans}
        interest={interestOf(slug)}
        note={footnotes[slug]}
      />
    </>
  );
}
