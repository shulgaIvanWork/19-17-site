import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { PlanFigure } from '@/components/PlanFigure';
import { Section } from '@/components/Section';
import { vpnBand, vpnFeatures, vpnPlans } from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Корпоративный VPN',
  description: 'Одна частная сеть на все офисы. Цена по устройствам, а не по сотрудникам.',
};

export default function VpnPage() {
  return (
    <>
      <Hero copy={heroes.vpn} />

      <Section>
        <div className="g3">
          {vpnFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2">{vpnBand.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {vpnPlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.devices}
              unit="Устройств в тарифе"
              name={plan.name}
              body={plan.body}
              interest="VPN"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '60ch' }}>
          {footnotes.vpn}
        </p>
      </Section>
    </>
  );
}
