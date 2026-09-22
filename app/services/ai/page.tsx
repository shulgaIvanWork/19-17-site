import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { PlanBand } from '@/components/blocks/PlanBand';
import { SceneBand } from '@/components/blocks/SceneBand';
import { aiBands, aiFeatures, aiPlans, aiUses } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'ai';
export const metadata: Metadata = serviceMeta[slug];

export default function AiPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={aiFeatures} />
      <SceneBand
        scene="aiStack"
        title={aiBands.uses.title}
        body={aiBands.uses.body}
        cta={aiBands.uses.cta}
        interest={interestOf(slug)}
        rows={aiUses}
        caption="Задачи для локальной модели"
      />
      <PlanBand
        title={aiBands.sized.title}
        plans={aiPlans}
        interest={interestOf(slug)}
        note={footnotes[slug]}
      />
    </>
  );
}
