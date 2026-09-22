import Image from 'next/image';
import { photoBlur } from '@/content/photoBlur';
import type { worksBand } from '@/content/works';
import styles from './ProjectFlow.module.css';

type Plan = typeof worksBand.plan;

/** Путь проекта одним листом: холст, на котором этапы разложены по колонкам, а
 *  справа готовая страница. Холст показан целиком прямо на странице, без окна
 *  просмотра: увеличивать нечего, все этапы видны сразу. Поэтому компонент
 *  серверный - состояния и обработчиков тут нет. */
export function ProjectFlow({ plan }: { plan: Plan }) {
  const blur = photoBlur[plan.board.src];

  return (
    <figure className={styles.board}>
      <div className={styles.frame}>
        <Image
          src={plan.board.src}
          alt={plan.board.alt}
          width={plan.board.width}
          height={plan.board.height}
          sizes="(max-width: 768px) 92vw, 1040px"
          quality={82}
          placeholder={blur ? 'blur' : 'empty'}
          blurDataURL={blur}
          className={styles.shot}
        />
      </div>
      <figcaption className="footnote">{plan.caption}</figcaption>
    </figure>
  );
}
