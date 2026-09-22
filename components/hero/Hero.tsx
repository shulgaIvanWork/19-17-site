import { ButtonLink } from '@/components/ui/Button';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { HeroObjectMount } from './HeroObjectMount';
import { type HeroShape } from './heroTypes';
import { serviceBySlug } from '@/content/services';
import { settings } from '@/content/settings';
import type { Hero as HeroCopy } from '@/content/site';
import styles from './Hero.module.css';

type Props = {
  copy: HeroCopy;
  /** 'tall' - главная; у страниц услуг всегда 'short'. */
  size?: 'tall' | 'short';
  /** Куда ведет белая кнопка. В утвержденном дизайне это цены на всех страницах. */
  secondaryHref?: string;
  /** Проволочная фигура за текстом. `true` - глобус главной. */
  object?: boolean | HeroShape;
};

export function Hero({ copy, size = 'short', secondaryHref = '/pricing', object = false }: Props) {
  const shape: HeroShape | null = !object || !settings.heroObject ? null : object === true ? 'globe' : object;
  // Фигура услуги названа так же, как сама услуга, поэтому тему заявки берет
  // реестр. Отдельной таблицы «фигура - тема» больше нет: она была четвертой
  // копией одного и того же списка (аудит 2026-09-22).
  const service = shape && shape !== 'globe' && shape !== 'works' ? serviceBySlug.get(shape) : undefined;

  return (
    <section
      className={[styles.hero, size === 'short' ? styles.short : ''].filter(Boolean).join(' ')}
      data-hero
    >
      <div className={styles.block} style={{ maxWidth: copy.blockWidth }}>
        <h1 className="h1" style={{ maxWidth: copy.titleWidth }}>
          {copy.title}
        </h1>
        <p className="lede" style={{ maxWidth: copy.ledeWidth }}>
          {copy.lede}
        </p>
      </div>
      {shape && (
        <div className={styles.object}>
          <HeroObjectMount nodes={settings.heroObjectNodes} shape={shape} />
        </div>
      )}
      <div className={styles.cta}>
        <ContactSalesButton hero interest={service?.interest} />
        <ButtonLink href={secondaryHref} variant="white" hero prefetch>
          {copy.secondaryCta}
        </ButtonLink>
      </div>
    </section>
  );
}
