import type { Metadata } from 'next';
import { ClaimRow } from '@/components/blocks/ClaimRow';
import { Hero } from '@/components/hero/Hero';
import { PlanBand } from '@/components/blocks/PlanBand';
import { vpnBand, vpnFeatures, vpnPlans } from '@/content/products';
import { interestOf } from '@/content/services';
import { footnotes, heroes, serviceMeta } from '@/content/site';

const slug = 'vpn';
export const metadata: Metadata = serviceMeta[slug];

export default function VpnPage() {
  return (
    <>
      <Hero copy={heroes[slug]} object={slug} />
      <ClaimRow claims={vpnFeatures} />
      <PlanBand
        title={vpnBand.title}
        plans={vpnPlans}
        interest={interestOf(slug)}
        note={footnotes[slug]}
      />
    </>
  );
}
