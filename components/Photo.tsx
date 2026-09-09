import Image from 'next/image';
import type { ImageSlot } from '@/content/products';
import styles from './Photo.module.css';

type Props = {
  slot: ImageSlot;
  /** Set once real photography exists; until then the frame renders empty. */
  src?: string;
  /** 12px radius on every photographic frame. */
  rounded?: boolean;
  /** The ground an unfilled slot shows. Portraits sit on ash, so they take white. */
  ground?: 'ash' | 'white';
  className?: string;
};

/** One of the eight image slots. No photography has been supplied yet, so an
 *  unfilled slot renders as a quiet ash frame naming what belongs there —
 *  visible in review, never mistaken for a design element. */
export function Photo({ slot, src, rounded = true, ground = 'ash', className }: Props) {
  return (
    <div
      className={[styles.frame, rounded ? styles.rounded : '', className].filter(Boolean).join(' ')}
      style={{
        aspectRatio: slot.ratio.replace('/', ' / '),
        background: ground === 'white' ? 'var(--white)' : 'var(--ash)',
      }}
    >
      {src ? (
        <Image src={src} alt={slot.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.img} />
      ) : (
        <span className={styles.empty}>
          {slot.alt} — {slot.ratio}
        </span>
      )}
    </div>
  );
}
