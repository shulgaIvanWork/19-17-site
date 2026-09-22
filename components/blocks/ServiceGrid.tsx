import Link from 'next/link';
import { EnquireLink } from '@/components/contact/ContactSalesButton';
import { TextLink } from '@/components/ui/TextLink';
import { serviceGroupTitles, serviceHref, services, type ServiceGroupId } from '@/content/nav';
import { serviceMeta } from '@/content/site';
import styles from './ServiceGrid.module.css';

/** Витрина услуг: все услуги по группам. Знаков услуг тут нет намеренно -
 *  карточки со знаком стоят на главной, а витрина отвечает на другой вопрос,
 *  какие услуги вообще есть и куда идти дальше. */
export function ServiceGrid() {
  const groups = (Object.keys(serviceGroupTitles) as ServiceGroupId[]).map((group) => ({
    id: group,
    title: serviceGroupTitles[group],
    items: services.filter((service) => service.group === group),
  }));

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section key={group.id} className={styles.group} aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="h3">
            {group.title}
          </h2>
          <div className={styles.tiles}>
            {group.items.map((service) => (
              <article key={service.slug} className={styles.tile} data-cursor-glow>
                <h3 className={styles.name}>
                  <Link href={serviceHref(service.slug)}>{service.label}</Link>
                  {service.badge ? (
                    <span className="hitbadge" aria-hidden="true">
                      {service.badge}
                    </span>
                  ) : null}
                </h3>
                <p className="body" style={{ marginTop: 10, maxWidth: '46ch' }}>
                  {serviceMeta[service.slug].description}
                </p>
                <div className={styles.links}>
                  <TextLink href={serviceHref(service.slug)} className="actionlink">
                    Подробнее
                  </TextLink>
                  <EnquireLink interest={service.interest} className="actionlink" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
