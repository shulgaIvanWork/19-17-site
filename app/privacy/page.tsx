import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { policyPage, policySections } from '@/content/legal';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  description:
    'Какие данные собирает сайт 19×17, зачем, на каком основании и как их удалить.',
};

/** Единственная длинная текстовая страница на сайте. В дизайне такой полосы
 *  нет, поэтому она собрана из тех же элементов: заголовки .h2/.h3, основной
 *  текст, разделительные линии между разделами. Ширина колонки ограничена
 *  70ch - на всю ширину контента такой текст читать нельзя. */
export default function PrivacyPage() {
  return (
    <>
      <Section style={{ paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 0 }}>
        <h1 className="h1" style={{ maxWidth: '22ch' }}>
          {policyPage.title}
        </h1>
        <p className="lede" style={{ marginTop: 16, maxWidth: '52ch' }}>
          {policyPage.lede}
        </p>
      </Section>

      <Section>
        <div className={styles.column}>
          {policySections.map((section) => (
            <section className={styles.block} key={section.title}>
              <h2 className="h3">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p className="body" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className={styles.list}>
                  {section.list.map((item) => (
                    <li className="body" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
