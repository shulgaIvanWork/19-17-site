import { NumberedClaim } from './NumberedClaim';
import { Section } from '@/components/ui/Section';
import type { Claim } from '@/content/products';

/** Полоса пронумерованных признаков под героем. Колонок столько, сколько
 *  признаков: у восьми услуг их четыре, у корпоративного VPN три. */
export function ClaimRow({ claims }: { claims: Claim[] }) {
  return (
    <Section>
      <div className={claims.length === 3 ? 'g3' : 'g4'}>
        {claims.map((claim) => (
          <NumberedClaim key={claim.num} claim={claim} />
        ))}
      </div>
    </Section>
  );
}
