import type { Metadata } from 'next';
import { ScenePanel } from '@/components/BandArt';
import { ContactQuietButton } from '@/components/ContactSalesButton';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { PlanFigure } from '@/components/PlanFigure';
import { Section } from '@/components/Section';
import { TwoColList } from '@/components/TwoColList';
import {
  aiBands,
  aiFeatures,
  aiPlans,
  aiUses,
  vpnBand,
  vpnFeatures,
  vpnPlans,
} from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'VPN и локальный AI',
  description:
    'Корпоративный VPN и локальный AI на базе Qwen3-8B: закрытая сеть, развертывание модели и работа с внутренними документами.',
};

export default function VpnAiPage() {
  return (
    <>
      <Hero id="vpn" copy={heroes.vpn} object="vpn" />

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

      <Hero id="ai" copy={heroes.ai} object="ai" />

      <Section>
        <div className="g4">
          {aiFeatures.map((feature) => (
            <NumberedClaim key={`ai-${feature.num}`} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="aiStack" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {aiBands.uses.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {aiBands.uses.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={aiBands.uses.cta} interest="Локальный AI" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={aiUses} caption="Задачи для локальной модели" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{aiBands.sized.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {aiPlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.seats}
              unit="Пользователей"
              name={plan.name}
              body={plan.body}
              interest="Локальный AI"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '64ch' }}>
          {footnotes.ai}
        </p>
      </Section>
    </>
  );
}
