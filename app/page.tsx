import { BoardScene } from '@/components/scenes/BoardScene';
import { ButtonLink } from '@/components/ui/Button';
import { Hero } from '@/components/hero/Hero';
import { LoopCarousel } from '@/components/blocks/LoopCarousel';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { ProductCard } from '@/components/blocks/ProductCard';
import { Section } from '@/components/ui/Section';
import { homeAbout, paths, steps } from '@/content/products';
import { heroes } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <Hero copy={heroes.home} size="tall" object />

      <Section>
        <div className="gcards desk-only">
          {paths.map((path) => (
            <ProductCard key={path.href} path={path} />
          ))}
        </div>
        <LoopCarousel peek="one" label="Направления">
          {paths.map((path) => (
            <ProductCard key={path.href} path={path} />
          ))}
        </LoopCarousel>
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
