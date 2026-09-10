import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

/** В утвержденном дизайне страницы 404 нет - собрана из частей той же системы
 *  и намеренно проста. Заменить, если у заказчика будет свой текст. */
export default function NotFound() {
  return (
    <Section style={{ paddingTop: 'clamp(56px, 7vw, 104px)' }}>
      <h1 className="h1" style={{ maxWidth: '20ch' }}>
        Такой страницы нет
      </h1>
      <p className="lede" style={{ marginTop: 16, maxWidth: '46ch' }}>
        Ссылка устарела или страницу переименовали. Разделы сайта — в шапке выше.
      </p>
      <div style={{ marginTop: 24 }}>
        <ButtonLink href="/" variant="ash">
          На главную
        </ButtonLink>
      </div>
    </Section>
  );
}
