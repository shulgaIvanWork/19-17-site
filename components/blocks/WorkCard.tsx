import { Photo } from '@/components/ui/Photo';
import type { Work } from '@/content/works';
import styles from './WorkCard.module.css';

/** Карточка работы: снимок макета, тип, название, описание и состав работы.
 *  Снимок вертикальный, поэтому рамка обрезает его по верху - в кадр попадает
 *  первый экран, по которому работа и узнается.
 *
 *  onOpen открывает макет целиком. Кнопка растянута на всю карточку: так
 *  нажимается любое место, а список состава работы не попадает внутрь кнопки. */
export function WorkCard({ work, onOpen }: { work: Work; onOpen?: () => void }) {
  return (
    <article className={[styles.card, onOpen ? styles.clickable : ''].filter(Boolean).join(' ')} data-cursor-glow>
      {onOpen ? (
        <button
          type="button"
          className={styles.hit}
          onClick={onOpen}
          data-cursor-skip
          aria-label={`Посмотреть макет целиком: ${work.title}`}
        />
      ) : null}
      <Photo
        slot={work.image}
        ground="pale"
        rounded={false}
        align="top"
        className={styles.shot}
        sizes="(max-width: 768px) 92vw, (max-width: 1100px) 46vw, 420px"
      />
      {onOpen ? <span className={styles.peek} aria-hidden="true">Смотреть макет</span> : null}
      <div className={styles.copy}>
        <div className={styles.kind}>{work.kind}</div>
        <h2 className={styles.name}>{work.title}</h2>
        <p className="body" style={{ marginTop: 10, maxWidth: '44ch' }}>
          {work.body}
        </p>
        <ul className={styles.parts}>
          {work.parts.map((part) => (
            <li key={part}>{part}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
