import Link from 'next/link';
import { EnquireLink } from '@/components/contact/ContactSalesButton';
import { CardMark } from './CardMark';
import { TextLink } from '@/components/ui/TextLink';
import type { ProductPath } from '@/content/products';
import { serviceBySlug, serviceHref } from '@/content/services';
import styles from './ProductCard.module.css';

/** Карточка услуги на главной. Название, адрес, знак и тему заявки берет
 *  реестр услуг, в карточке лежат только заголовок и текст. */
export function ProductCard({ path }: { path: ProductPath }) {
  const service = serviceBySlug.get(path.slug);
  if (!service) return null;
  const href = serviceHref(path.slug);

  return (
    <article className={styles.card} data-service-card data-cursor-glow>
      <Link href={href} className={styles.photo} tabIndex={-1} aria-hidden="true" prefetch={false}>
        <CardMark kind={path.slug} />
      </Link>
      <div className={styles.copy}>
        <h2 className={styles.name}>
          <Link href={href}>{service.label}</Link>
        </h2>
        <p className="h3" style={{ marginTop: 8 }}>
          {path.title}
        </p>
        <p className="body" style={{ marginTop: 8, maxWidth: '44ch' }}>
          {path.body}
        </p>
        <div className={styles.links}>
          <TextLink href={href} className="actionlink">
            Подробнее
          </TextLink>
          <EnquireLink interest={service.interest} className="actionlink" />
        </div>
      </div>
    </article>
  );
}
