import { BoardScene } from '@/components/scenes/BoardScene';
import { LegacyHashRedirect } from './LegacyHashRedirect';
import { ButtonLink } from '@/components/ui/Button';
import { FactsBand } from '@/components/blocks/FactsBand';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PointGrid } from '@/components/blocks/PointGrid';
import { ProductCard } from '@/components/blocks/ProductCard';
import { Section } from '@/components/ui/Section';
import { facts, fitCases, homeAbout, homeBands, paths, safety, steps, whyUs } from '@/content/products';
import { heroes } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero copy={heroes.home} size="tall" object />

      {/* Единственный полный список услуг на сайте: вкладка «Услуги» в шапке
          ведет на эту страницу, отдельной витрины нет. Якорь #services оставлен
          для старых адресов, на него ведут редиректы. */}
      <Section id="services">
        <div className="gcards rail rail-one">
          {paths.map((path) => (
            <ProductCard key={path.slug} path={path} />
          ))}
        </div>
      </Section>

      {/* Четыре полосы ниже добавлены правкой заказчика 2026-09-24: объем работ
          цифрами, с чем к нам приходят, почему выбирают и почему передавать нам
          действующие системы не страшно. */}
      <Section surface="ash">
        <h2 className="h2" style={{ maxWidth: '20ch' }}>
          {homeBands.facts.title}
        </h2>
        <p className="body" style={{ marginTop: 16, maxWidth: '54ch' }}>
          {homeBands.facts.body}
        </p>
        <FactsBand facts={facts} />
      </Section>

      <Section>
        <h2 className="h2" style={{ maxWidth: '22ch' }}>
          {homeBands.fit.title}
        </h2>
        <p className="body" style={{ marginTop: 16, maxWidth: '58ch' }}>
          {homeBands.fit.body}
        </p>
        <PointGrid points={fitCases} />
      </Section>

      {/* Семь доводов на три колонки не делятся, поэтому полоса в две. */}
      <Section surface="ash">
        <h2 className="h2" style={{ maxWidth: '22ch' }}>
          {homeBands.why.title}
        </h2>
        <p className="body" style={{ marginTop: 16, maxWidth: '58ch' }}>
          {homeBands.why.body}
        </p>
        <PointGrid points={whyUs} columns={2} />
      </Section>

      <Section>
        <h2 className="h2" style={{ maxWidth: '22ch' }}>
          Как устроена работа
        </h2>
        <div className="g3" style={{ marginTop: 56 }}>
          {steps.map((step) => (
            <NumberedClaim key={step.num} claim={step} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2" style={{ maxWidth: '22ch' }}>
          {homeBands.safety.title}
        </h2>
        <p className="body" style={{ marginTop: 16, maxWidth: '58ch' }}>
          {homeBands.safety.body}
        </p>
        <PointGrid points={safety} />
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
