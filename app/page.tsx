import { BoardScene } from '@/components/BoardScene';
import { ButtonLink } from '@/components/Button';
import { Hero } from '@/components/Hero';
import { NumberedClaim } from '@/components/NumberedClaim';
import { ProductCard } from '@/components/ProductCard';
import { Section } from '@/components/Section';
import { homeAbout, paths, steps } from '@/content/products';
import { heroes } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <Hero copy={heroes.home} size="tall" object />

      <Section>
        <div className="gcards">
          {paths.map((path) => (
            <ProductCard key={path.href} path={path} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2" style={{ maxWidth: '22ch' }}>
          Как устроена работа
        </h2>
        <div className="g3" style={{ marginTop: 56 }}>
          {steps.map((step) => (
            <NumberedClaim key={step.num} claim={step} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'center' }}>
          <div>
            <h2 className="h2" style={{ maxWidth: '20ch' }}>
              {homeAbout.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '46ch' }}>
              {homeAbout.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ButtonLink href="/about" variant="ash">
                {homeAbout.cta}
              </ButtonLink>
            </div>
          </div>
          <BoardScene />
        </div>
      </Section>
    </>
  );
}
