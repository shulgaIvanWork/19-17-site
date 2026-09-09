import Link from 'next/link';
import { EnquireLink } from './ContactSalesButton';
import { TextLink } from './TextLink';
import type { ProductPath } from '@/content/products';
import styles from './ProductCard.module.css';

/** Home's product cards. Typographic, not photographic: the service name set
 *  in the display face, bottom-left on an ash ground that goes cloud on hover.
 *  The name sizes against the card (`15cqw`), not the page. Whole card clicks
 *  through; below it, the title, body and two text links. */
export function ProductCard({ path }: { path: ProductPath }) {
  return (
    <div className={styles.card}>
      <Link href={path.href} className="mediacard">
        <span className="cardname">{path.card}</span>
      </Link>
      <h2 className="h3" style={{ marginTop: 20 }}>
        {path.title}
      </h2>
      <p className="body" style={{ marginTop: 8, maxWidth: '44ch' }}>
        {path.body}
      </p>
      <div className={styles.links}>
        <TextLink href={path.href}>Подробнее</TextLink>
        <EnquireLink interest={path.interest} />
      </div>
    </div>
  );
}
