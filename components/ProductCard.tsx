import Link from 'next/link';
import { EnquireLink } from './ContactSalesButton';
import { CardMark } from './CardMark';
import { TextLink } from './TextLink';
import type { ProductPath } from '@/content/products';
import styles from './ProductCard.module.css';

export function ProductCard({ path }: { path: ProductPath }) {
  return (
    <article className={styles.card} data-service-card data-cursor-glow>
      <Link href={path.href} className={styles.photo} tabIndex={-1} aria-hidden="true" prefetch={false}>
        <CardMark kind={path.mark} />
      </Link>
      <div className={styles.copy}>
        <h2 className={styles.name}>
          <Link href={path.href}>{path.card}</Link>
        </h2>
        <p className="h3" style={{ marginTop: 8 }}>
          {path.title}
        </p>
        <p className="body" style={{ marginTop: 8, maxWidth: '44ch' }}>
          {path.body}
        </p>
        <div className={styles.links}>
          <TextLink href={path.href} className="actionlink">
            Подробнее
          </TextLink>
          <EnquireLink interest={path.interest} className="actionlink" />
        </div>
      </div>
    </article>
  );
}
