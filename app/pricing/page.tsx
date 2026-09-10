import type { Metadata } from 'next';
import { CompareTable } from '@/components/CompareTable';
import { ContactSalesButton } from '@/components/ContactSalesButton';
import { Section } from '@/components/Section';
import { pricingHero, pricingTables, webPlans } from '@/content/pricing';
import { footnotes } from '@/content/site';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Цены',
  description: 'Как рассчитывается стоимость сайта, поддержки, интеграций, корпоративного VPN и локального AI.',
};

export default function PricingPage() {
  return (
    <>
      <Section style={{ paddingTop: 'clamp(56px, 7vw, 104px)' }}>
        <h1 className="h1" style={{ maxWidth: '24ch' }}>
          {pricingHero.title}
        </h1>
        <p className="lede" style={{ marginTop: 16, maxWidth: '56ch' }}>
          {pricingHero.lede}
        </p>
      </Section>

      <section style={{ paddingBottom: 'clamp(48px, 7vw, 104px)' }}>
        <div className="wrap">
          <h2 className={styles.bandLabel}>Сайты</h2>
          <div className="g3" style={{ marginTop: 32 }}>
            {webPlans.map((plan) => (
              <div className={styles.column} key={plan.name}>
                <h3 className="h2" style={{ fontSize: 24, lineHeight: '30px' }}>
                  {plan.name}
                </h3>
                <div className="label" style={{ marginTop: 6, color: 'var(--blue)' }}>
                  {plan.price}
                </div>
                <p className="body" style={{ marginTop: 16 }}>
                  {plan.body}
                </p>
                <div className={styles.items}>
                  {plan.items.map((item) => (
                    <div className={['body', styles.item].join(' ')} key={item}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className={styles.action}>
                  <ContactSalesButton hero interest="Создание сайта" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {pricingTables.map(({ table, surface }, index) => (
        <Section surface={surface} key={table.heading}>
          <h2 className={styles.bandLabel}>{table.heading}</h2>
          <div style={{ marginTop: 28 }}>
            <CompareTable
              headers={table.headers}
              rows={table.rows}
              caption={`${table.heading}: ориентиры по стоимости`}
            />
          </div>
          {index === pricingTables.length - 1 && (
            <p className="footnote" style={{ marginTop: 24, maxWidth: '64ch' }}>
              {footnotes.pricing}
            </p>
          )}
        </Section>
      ))}
    </>
  );
}
