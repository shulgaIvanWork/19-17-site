import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { serviceGroupTitles, serviceHref, services, servicesHref, type ServiceGroupId } from '@/content/nav';
import styles from './ServiceMore.module.css';

/** Подвал страницы услуги: остальные услуги по группам и ссылка на витрину.
 *
 *  Заменил рельс разделов, который был нужен, пока девять услуг жили якорями на
 *  двух длинных страницах. Теперь у каждой свой адрес, прыгать внутри страницы
 *  не по чему, и переход между услугами - обычные ссылки. */
export function ServiceMore({ current }: { current: string }) {
  const groups = (Object.keys(serviceGroupTitles) as ServiceGroupId[])
    .map((group) => ({
      title: serviceGroupTitles[group],
      items: services.filter((service) => service.group === group && service.slug !== current),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Section surface="ash">
      <h2 className="h2" style={{ maxWidth: '20ch' }}>
        Другие услуги
      </h2>
      <div className={styles.groups}>
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="label">{group.title}</h3>
            <ul className={styles.list}>
              {group.items.map((service) => (
                <li key={service.slug}>
                  <Link href={serviceHref(service.slug)} className={['tlink', styles.link].join(' ')}>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 36 }}>
        <Link href={servicesHref} className="actionlink">
          Все услуги
        </Link>
      </p>
    </Section>
  );
}
