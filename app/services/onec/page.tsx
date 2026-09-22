import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { PlanBand } from '@/components/blocks/PlanBand';
import { SceneBand } from '@/components/blocks/SceneBand';
import { onecAreas, onecBands, onecFeatures, onecPackages } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'onec';
export const metadata: Metadata = serviceMeta[slug];

export default function OnecPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={onecFeatures} />
      <SceneBand
        scene="onecSwap"
        title={onecBands.exchange.title}
        body={onecBands.exchange.body}
        cta={onecBands.exchange.cta}
        interest={interestOf(slug)}
        rows={onecAreas}
        caption="Какие данные передаем"
      />
      <PlanBand
        title={onecBands.priced.title}
        plans={onecPackages}
        interest={interestOf(slug)}
        note={footnotes[slug]}
      />
    </>
  );
}
