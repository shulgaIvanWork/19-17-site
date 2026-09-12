import Link from 'next/link';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { TextLink } from '@/components/ui/TextLink';
import type { PricingOffer } from '@/content/pricing';
import { PricingMark } from './PricingMark';
import styles from './PricingCard.module.css';

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7.1" fill="none" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M4.6 8.15 L7.05 10.5 L11.45 5.55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingCard({ offer }: { offer: PricingOffer }) {
  const art = <PricingMark kind={offer.mark} />;

  return (
    <article className={styles.card} data-pricing-card data-service-card data-cursor-glow>
      {offer.href ? (
        <Link href={offer.href} className={styles.photo} tabIndex={-1} aria-hidden="true" prefetch={false}>
          {art}
        </Link>
      ) : (
        <div className={styles.photo}>{art}</div>
      )}
      <div className={styles.copy}>
        <h3 className={styles.name}>
          {offer.href ? <Link href={offer.href}>{offer.name}</Link> : offer.name}
        </h3>
        <div className={styles.price}>{offer.price}</div>
        <p className="body" style={{ marginTop: 10 }}>
          {offer.body}
        </p>
        <ul className={styles.items}>
          {offer.items.map((item) => (
            <li className={styles.item} key={item}>
              <Check />
              <span className="body">{item}</span>
            </li>
          ))}
        </ul>
        <div className={styles.links}>
          <ContactSalesButton interest={offer.interest} />
          {offer.href ? (
            <TextLink href={offer.href} className="actionlink">
              Подробнее
            </TextLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
