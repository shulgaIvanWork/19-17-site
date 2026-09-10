import Image from 'next/image';
import type { ImageSlot } from '@/content/products';
import styles from './Photo.module.css';

type Props = {
  slot: ImageSlot;
  src?: string;
  /** 12px radius on every photographic frame. */
  rounded?: boolean;
  /** The ground an unfilled slot shows. Portraits sit on ash, so they take white. */
  ground?: 'ash' | 'white';
  className?: string;
};

export function Photo({ slot, src, rounded = true, ground = 'ash', className }: Props) {
  const imageSrc = src ?? slot.src;

  return (
    <div
      className={[styles.frame, rounded ? styles.rounded : '', className].filter(Boolean).join(' ')}
      style={{
        aspectRatio: slot.ratio.replace('/', ' / '),
        background: ground === 'white' ? 'var(--white)' : 'var(--ash)',
      }}
    >
      {imageSrc ? (
          <Image src={imageSrc} alt={slot.alt} fill sizes="(max-width: 768px) 100vw, 50vw" quality={82} className={[styles.img, slot.ratio === '4/5' ? styles.portrait : ''].filter(Boolean).join(' ')} />
      ) : (
        <span className={styles.empty}>
          {slot.alt} — {slot.ratio}
        </span>
      )}
    </div>
  );
}
