import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { PlanBand } from '@/components/blocks/PlanBand';
import { SceneBand } from '@/components/blocks/SceneBand';
import { crmBands, crmFeatures, crmPackages, crmSystems } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'crm';
export const metadata: Metadata = serviceMeta[slug];

export default function CrmPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={crmFeatures} />
      <SceneBand
        scene="crmPipe"
        title={crmBands.connect.title}
        body={crmBands.connect.body}
        cta={crmBands.connect.cta}
        interest={interestOf(slug)}
        rows={crmSystems}
        caption="Системы, которые подключаем"
      />
      <PlanBand
        title={crmBands.priced.title}
        plans={crmPackages}
        interest={interestOf(slug)}
        note={footnotes[slug]}
      />
    </>
  );
}
