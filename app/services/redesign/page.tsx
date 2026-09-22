import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { SceneBand } from '@/components/blocks/SceneBand';
import { redesignAreas, redesignBands, redesignFeatures } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'redesign';
export const metadata: Metadata = serviceMeta[slug];

export default function RedesignPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={redesignFeatures} />
      <SceneBand
        scene="auditSheet"
        title={redesignBands.audit.title}
        body={redesignBands.audit.body}
        cta={redesignBands.audit.cta}
        interest={interestOf(slug)}
        rows={redesignAreas}
        caption="Что проверяем во время аудита"
        note={footnotes[slug]}
      />
    </>
  );
}
