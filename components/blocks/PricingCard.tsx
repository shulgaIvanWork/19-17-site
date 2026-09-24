import Link from 'next/link';
import { Check } from '@/components/ui/Check';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { TextLink } from '@/components/ui/TextLink';
import type { PricingOffer } from '@/content/pricing';
import { PricingMark } from './PricingMark';
import styles from './PricingCard.module.css';

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
        {/* Срок идет внутри строки цены, а не отдельным блоком: на узком экране
            карточка встает в ленту через subgrid, и лишняя строка сбила бы
            выравнивание соседних карточек. */}
        <div className={styles.price}>
          {offer.price}
          <span className={styles.term}>Срок: {offer.term}</span>
        </div>
        <p className="body" style={{ marginTop: 10 }}>
          {offer.body}
        </p>
        <ul className={styles.items}>
          {offer.items.map((item) => (
            <li className={styles.item} key={item}>
              <Check className={styles.check} />
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
