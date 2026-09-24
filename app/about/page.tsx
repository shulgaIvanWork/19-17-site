import type { Metadata } from 'next';
import { AboutScene } from '@/components/scenes/AboutScene';
import { Hero } from '@/components/hero/Hero';
import { Section } from '@/components/ui/Section';
import { mailHref, mailLabel, phoneHref, phoneLabel } from '@/content/nav';
import { TeamCarousel } from '@/components/blocks/TeamCarousel';
import { heroes } from '@/content/site';
import { howWeOperate, team, teamBand } from '@/content/team';

export const metadata: Metadata = {
  title: 'О нас',
  description: '19×17 — технический подрядчик по сайтам, интеграциям, корпоративному VPN и локальному AI.',
};

export default function AboutPage() {
  return (
    <>
      {/* Первый экран как у остальных страниц: фон, текст и объект. Объект тут
          не проволочная фигура, а фирменный ролик (правка заказчика
          2026-09-24): до этого «О нас» начиналась просто с заголовка. */}
      <Hero copy={heroes.about} video="/video/logo.mp4" />

      <Section>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(20px, 5vw, 72px)',
          }}
        >
          <div>
            <div className="label">Телефон</div>
            <a href={phoneHref} className="phone" style={{ marginTop: 8 }}>
              {phoneLabel}
            </a>
          </div>
          <div>
            <div className="label">Почта</div>
            <a href={mailHref} className="phone" style={{ marginTop: 8 }}>
              {mailLabel}
            </a>
          </div>
        </div>
      </Section>

      <Section surface="ash">
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
      <Section>
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
