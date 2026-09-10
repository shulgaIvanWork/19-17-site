import type { Metadata } from 'next';
import { AboutScene } from '@/components/scenes/AboutScene';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { phoneHref, phoneLabel } from '@/content/nav';
import { aboutHero, founders, foundersBand, howWeOperate } from '@/content/team';

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

      <Section surface="ash" style={{ paddingTop: 0 }}>
        <div style={{ paddingTop: 'clamp(64px, 9vw, 140px)' }}>
          <h2 className="h2">{foundersBand.title}</h2>
          <p className="body" style={{ marginTop: 12, maxWidth: '46ch' }}>
            {foundersBand.body}
          </p>
          <div
            className="g2"
            style={{ marginTop: 48, maxWidth: 720, gap: 'clamp(20px, 3vw, 32px)' }}
          >
            {founders.map((founder) => (
              <div key={founder.image.id}>
                <Photo slot={founder.image} ground="white" />
                <h3 className="h3" style={{ marginTop: 16 }}>
                  {founder.name}
                </h3>
                <div className="label">{founder.role}</div>
                <p className="body" style={{ marginTop: 10 }}>
                  {founder.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
