import type { Metadata } from 'next';
import { AboutScene } from '@/components/scenes/AboutScene';
import { Section } from '@/components/ui/Section';
import { phoneHref, phoneLabel } from '@/content/nav';
import { TeamCarousel } from '@/components/blocks/TeamCarousel';
import { aboutHero, howWeOperate, team, teamBand } from '@/content/team';

export const metadata: Metadata = {
  title: 'О нас',
  description: '19×17 — технический подрядчик по сайтам, интеграциям, корпоративному VPN и локальному AI.',
};

export default function AboutPage() {
  return (
    <>
      <Section style={{ paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 0 }}>
        <h1 className="h1" style={{ maxWidth: '20ch' }}>
          {aboutHero.title}
        </h1>
        <p className="lede" style={{ marginTop: 16, maxWidth: '48ch' }}>
          {aboutHero.lede}
        </p>
        <div style={{ marginTop: 40 }}>
          <div className="label">Телефон</div>
          <a href={phoneHref} className="phone" style={{ marginTop: 8 }}>
            {phoneLabel}
          </a>
        </div>
      </Section>

      <Section>
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'center' }}>
          <div>
            <h2 className="h3">{howWeOperate.title}</h2>
            <p className="body" style={{ marginTop: 12, maxWidth: '46ch' }}>
              {howWeOperate.body}
            </p>
            <p className="body" style={{ marginTop: 16, maxWidth: '46ch' }}>
              {howWeOperate.placeholder}
            </p>
          </div>
          <AboutScene />
        </div>
      </Section>

      {/* Одна лента на всех: основатели идут ее первыми карточками. Отдельной
          полосы с их портретами больше нет (правка заказчика 2026-09-22). */}
      <Section surface="ash">
        <h2 className="h2">{teamBand.title}</h2>
        <p className="body" style={{ marginTop: 12, maxWidth: '52ch' }}>
          {teamBand.body}
        </p>
        <div style={{ marginTop: 48 }}>
          <TeamCarousel people={team} />
        </div>
      </Section>
    </>
  );
}
