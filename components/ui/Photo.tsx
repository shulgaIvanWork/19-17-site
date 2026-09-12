import Image from 'next/image';
import type { ImageSlot } from '@/content/products';
import styles from './Photo.module.css';

type Props = {
  slot: ImageSlot;
  src?: string;
  /** 12px radius on every photographic frame. */
  rounded?: boolean;
  /** The ground an unfilled slot shows. Portraits sit on ash, so they take white.
   *  pale - заметная серая заглушка на месте фото, которого пока нет. */
  ground?: keyof typeof grounds;
  className?: string;
};

const grounds = { ash: 'var(--ash)', white: 'var(--white)', pale: 'var(--pale)' } as const;

/** Слот без src остается пустой рамкой фона ground. Подпись имени и пропорции
 *  внутри рамки была заготовкой макета; имя уходит в aria-label. */
export function Photo({ slot, src, rounded = true, ground = 'ash', className }: Props) {
  const imageSrc = src ?? slot.src;

  return (
    <div
      className={[styles.frame, rounded ? styles.rounded : '', className].filter(Boolean).join(' ')}
      style={{
        aspectRatio: slot.ratio.replace('/', ' / '),
        background: grounds[ground],
      }}
      role={imageSrc ? undefined : 'img'}
      aria-label={imageSrc ? undefined : slot.alt}
    >
      {imageSrc ? (
        <Image src={imageSrc} alt={slot.alt} fill sizes="(max-width: 768px) 100vw, 50vw" quality={82} className={[styles.img, slot.ratio === '4/5' ? styles.portrait : ''].filter(Boolean).join(' ')} />
      ) : null}
    </div>
  );
}
