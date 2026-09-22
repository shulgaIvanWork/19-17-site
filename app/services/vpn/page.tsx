import type { Metadata } from 'next';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PlanFigure } from '@/components/blocks/PlanFigure';
import { Section } from '@/components/ui/Section';
import { ServiceMore } from '@/components/blocks/ServiceMore';
import { vpnBand, vpnFeatures, vpnPlans } from '@/content/products';
import { footnotes, heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.vpn;

export default function VpnPage() {
  return (
    <>
      <Hero copy={heroes.vpn} object="vpn" />

      <Section>
        <div className="g3">
          {vpnFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2">{vpnBand.title}</h2>
        <div className="g3 rail" style={{ marginTop: 52 }}>
          {vpnPlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.devices}
              unit="Устройств"
              name={plan.name}
              body={plan.body}
              interest="Корпоративный VPN"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '60ch' }}>
          {footnotes.vpn}
        </p>
      </Section>

      <ServiceMore current="vpn" />
    </>
  );
}
